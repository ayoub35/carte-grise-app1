import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Upload, ChevronLeft, ChevronRight, CheckCircle, Check, X, FileText as DocIcon } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Pricing } from "@shared/schema";
import { DOCUMENT_TYPES, REQUIRED_DOCUMENTS } from "@/data/documentTypes";
import { getPricingForDemarche } from "@/data/pricingTable";
import pricingCalculator from "@/data/pricingCalculator.json";
import departmentsData from "@/data/departments.json";

const documentFormSchema = z.object({
  documentType: z.string().min(1, "Le type de demande est requis"),
  vehicleType: z.string().optional(),
  vehicleRegion: z.string().optional(),
  vehicleCondition: z.string().optional(),
  vehiclePlate: z.string().optional(),
  vehicleVin: z.string().optional(),
  vehicleOriginCountry: z.string().optional(),
  vehicleYear: z.coerce.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  vehicleFiscalHorsepower: z.coerce.number().min(1).optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  notes: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

export default function NewDocument() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [showVehicleConditionModal, setShowVehicleConditionModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({});
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState({ y1: 0, y2: 0, y3: 0, y4: 11, y5: 2.76, total: 0 });

  const calculateCarteGriseBreakdown = (year: number | undefined, fiscalHorsepower: number | undefined, vehicleType: string | undefined, departmentCode: string | undefined, demarcheId: number = 2) => {
    const defaultBreakdown = { y1: 0, y2: 0, y3: 0, y4: 11, y5: 2.76, total: 0 };
    if (!year || !fiscalHorsepower) return defaultBreakdown;
    
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - year;
    
    // Get vehicle type multiplier
    let vehicleMultiplier = vehicleAge > 10 ? 0.5 : 1;
    let taxeFPTransport = 0;
    if (vehicleType) {
      const vehicleData = pricingCalculator.baremeVehicule.find(v => v.typeVehicule === vehicleType);
      if (vehicleData) {
        vehicleMultiplier = vehicleAge > 10 ? vehicleData.baremePlus10 : vehicleData.baremeMoins10;
        taxeFPTransport = vehicleData.taxeFPTransport;
      }
    }
    
    // Get demarche multiplier
    let demarche_multiplier = 1;
    const demarche = pricingCalculator.baremeDemarche.find(d => d.id === demarcheId);
    if (demarche) {
      const isMotoMoins125 = vehicleType === 'moto_125';
      demarche_multiplier = isMotoMoins125 ? demarche.baremeMotoMoins125 : demarche.baremeAutre;
    }
    
    // Y1: Regional tax = CV × regional_tax_rate × vehicle_multiplier × demarche_multiplier
    // Convert department code to region code
    let regionCode = 75; // Default
    if (departmentCode) {
      const dept = departmentsData.departments.find(d => d.code === departmentCode);
      if (dept) {
        regionCode = dept.regionCode;
      }
    }
    const regionData = pricingCalculator.taxeRegionale.find(r => r.codeRegion === regionCode);
    const regionalTaxRate = regionData?.taxe || 43; // Default to 43
    const y1 = Math.round((fiscalHorsepower * regionalTaxRate * vehicleMultiplier * demarche_multiplier) * 100) / 100;
    
    // Y2: Transport tax
    const y2 = taxeFPTransport;
    
    // Y3: CO2 Malus (simplified for now)
    let y3 = 0;
    if (year >= 2006) {
      const co2Malus = pricingCalculator.malusCO2.find(m => m.annee === year && m.minCO2 === 0 && m.maxCO2 === 120);
      if (co2Malus) {
        y3 = co2Malus.malus;
      }
    }
    
    // Y4: Fixed tax (always 11.00€)
    const y4 = 11.00;
    
    // Y5: Routing fee (always 2.76€)
    const y5 = 2.76;
    
    const total = Math.round((y1 + y2 + y3 + y4 + y5) * 100) / 100;
    return { y1, y2, y3, y4, y5, total };
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté. Redirection...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: pricingData } = useQuery<Pricing[]>({
    queryKey: ["/api/pricing"],
    enabled: isAuthenticated,
  });

  // Get document type from URL query parameter
  const getDocTypeFromUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('type') || "";
    }
    return "";
  };

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      documentType: getDocTypeFromUrl(),
      vehicleType: "",
      vehicleCondition: "",
      vehiclePlate: "",
      vehicleVin: "",
      vehicleOriginCountry: "",
      vehicleYear: undefined,
      vehicleFiscalHorsepower: undefined,
      vehicleMake: "",
      vehicleModel: "",
      notes: "",
    },
  });

  const selectedDocType = form.watch("documentType");
  const vehicleType = form.watch("vehicleType");
  const vehicleRegion = form.watch("vehicleRegion");
  const vehicleYear = form.watch("vehicleYear");
  const fiscalHorsepower = form.watch("vehicleFiscalHorsepower");
  const docTypeConfig = DOCUMENT_TYPES.find(d => d.id === selectedDocType);

  const isProfessional = user?.userType === 'professional';
  const baseServiceFee = getPricingForDemarche(selectedDocType) || 30;
  const serviceFee = isProfessional ? Math.round(baseServiceFee * 0.65 * 100) / 100 : baseServiceFee;

  useEffect(() => {
    if (selectedDocType) {
      const docConfig = DOCUMENT_TYPES.find(d => d.id === selectedDocType);
      const expressFee = expressDelivery ? 5 : 0;
      
      if (docConfig && !docConfig.hasGovernmentTax) {
        const zeroBreakdown = { y1: 0, y2: 0, y3: 0, y4: 0, y5: 0, total: 0 };
        const total = serviceFee + expressFee;
        setCalculatedPrice(total);
        setPriceBreakdown(zeroBreakdown);
      } else {
        let demarcheId = 2;
        if (selectedDocType === 'duplicata_carte_grise') demarcheId = 3;
        else if (selectedDocType === 'immatriculation_provisoire') demarcheId = 14;
        else if (selectedDocType === 'w_garage') demarcheId = 14;
        
        const breakdown = calculateCarteGriseBreakdown(vehicleYear, fiscalHorsepower, vehicleType, vehicleRegion || "", demarcheId);
        const total = breakdown.total + serviceFee + expressFee;
        
        setCalculatedPrice(total);
        setPriceBreakdown(breakdown);
      }
    }
  }, [selectedDocType, vehicleType, vehicleRegion, vehicleYear, fiscalHorsepower, expressDelivery, serviceFee]);

  const createDocumentMutation = useMutation({
    mutationFn: async (data: DocumentFormValues) => {
      const formData = new FormData();
      Object.entries(uploadedFiles).forEach(([, file]) => {
        formData.append('files', file);
      });
      formData.append('data', JSON.stringify({
        ...data,
        price: calculatedPrice,
      }));
      
      return await apiRequest("POST", "/api/documents", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document soumis",
        description: "Votre demande a été soumise avec succès.",
      });
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la soumission",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleFileChange = (docKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedFiles(prev => ({
        ...prev,
        [docKey]: e.target.files![0]
      }));
    }
  };

  const removeFile = (docKey: string) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[docKey];
      return newFiles;
    });
  };

  const canProceed = () => {
    if (step === 1) {
      return selectedDocType !== "";
    }
    if (step === 2) {
      // Documents are now optional - always allow proceeding to step 3
      return true;
    }
    return true;
  };

  const onSubmit = (data: DocumentFormValues) => {
    if (step < 3) {
      if (canProceed()) {
        setStep(step + 1);
      } else {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un type de demande",
          variant: "destructive",
        });
      }
    } else {
      createDocumentMutation.mutate(data);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Nouvelle demande</h1>
          <p className="text-muted-foreground mt-1">
            Soumettez votre demande en 3 étapes simples
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Étape {step} sur 3</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Type de demande"}
              {step === 2 && "Téléchargement des documents"}
              {step === 3 && "Informations du véhicule"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Sélectionnez le type de demande"}
              {step === 2 && "Téléchargez les documents si vous les avez. Nous vous contacterons par mail ou téléphone après paiement si des documents manquent."}
              {step === 3 && "Renseignez vos informations personnelles et effectuez le paiement"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3 text-sm">Les plus populaires</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {DOCUMENT_TYPES.filter(d => d.category === 'popular' && !d.hidden).map(doc => (
                          <div
                            key={doc.id}
                            onClick={() => {
                              form.setValue('documentType', doc.id);
                              if (doc.id === 'changement_titulaire') {
                                setShowVehicleConditionModal(true);
                              }
                            }}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 flex flex-col justify-between min-h-[80px] ${
                              selectedDocType === doc.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'
                            }`}
                            data-testid={`button-doctype-${doc.id}`}
                          >
                            <h4 className="font-medium text-xs leading-tight">{doc.name}</h4>
                            {selectedDocType === doc.id && (
                              <div className="flex justify-end mt-1">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 text-sm">Pour les professionnels</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {DOCUMENT_TYPES.filter(d => d.category === 'professional' && !d.hidden).map(doc => (
                          <div
                            key={doc.id}
                            onClick={() => form.setValue('documentType', doc.id)}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 flex flex-col justify-between min-h-[80px] ${
                              selectedDocType === doc.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'
                            }`}
                            data-testid={`button-doctype-${doc.id}`}
                          >
                            <h4 className="font-medium text-xs leading-tight">{doc.name}</h4>
                            {selectedDocType === doc.id && (
                              <div className="flex justify-end mt-1">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 text-sm">Autres démarches</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {DOCUMENT_TYPES.filter(d => d.category === 'other' && !d.hidden).map(doc => (
                          <div
                            key={doc.id}
                            onClick={() => form.setValue('documentType', doc.id)}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 flex flex-col justify-between min-h-[80px] ${
                              selectedDocType === doc.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'
                            }`}
                            data-testid={`button-doctype-${doc.id}`}
                          >
                            <h4 className="font-medium text-xs leading-tight">{doc.name}</h4>
                            {selectedDocType === doc.id && (
                              <div className="flex justify-end mt-1">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {showVehicleConditionModal && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-sm">
                          <CardHeader>
                            <CardTitle>Type de véhicule</CardTitle>
                            <CardDescription>Le véhicule est-il neuf ou d'occasion ?</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-start h-auto py-3 px-4"
                              onClick={() => {
                                form.setValue('vehicleCondition', 'occasion');
                                setShowVehicleConditionModal(false);
                              }}
                              data-testid="button-vehicle-occasion"
                            >
                              <div className="text-left">
                                <div className="font-medium">Véhicule d'occasion</div>
                                <div className="text-xs text-muted-foreground">Changement de propriétaire pour un véhicule existant</div>
                              </div>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-start h-auto py-3 px-4"
                              onClick={() => {
                                form.setValue('vehicleCondition', 'neuf');
                                setShowVehicleConditionModal(false);
                              }}
                              data-testid="button-vehicle-neuf"
                            >
                              <div className="text-left">
                                <div className="font-medium">Véhicule neuf</div>
                                <div className="text-xs text-muted-foreground">Première immatriculation d'un véhicule neuf</div>
                              </div>
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && docTypeConfig && (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        ✓ Vous n'êtes pas obligé d'envoyer vos documents maintenant, mais il faudra les envoyer avant de procéder à la demande. Notre équipe vous contactera si des documents manquent.
                      </p>
                    </div>

                    <div className="rounded-lg border p-4 bg-muted/30">
                      <p className="text-sm"><span className="font-medium">Demande:</span> {docTypeConfig.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{docTypeConfig.description}</p>
                    </div>
                    
                    {docTypeConfig.requiredDocuments.map(docKey => {
                      const doc = REQUIRED_DOCUMENTS[docKey as keyof typeof REQUIRED_DOCUMENTS];
                      return (
                      <div key={docKey} className="space-y-2">
                        <div>
                          <Label className="text-base">{doc.label}</Label>
                          <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                        </div>
                        <div className="relative">
                          <label
                            htmlFor={docKey}
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover-elevate"
                            data-testid={`label-upload-${docKey}`}
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {uploadedFiles[docKey] ? (
                                <>
                                  <CheckCircle className="w-8 h-8 mb-2 text-green-600" />
                                  <p className="text-sm font-medium text-center px-2">{uploadedFiles[docKey].name}</p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-medium">Cliquez</span> ou glissez-déposez
                                  </p>
                                  <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 10MB)</p>
                                </>
                              )}
                            </div>
                            <input
                              id={docKey}
                              type="file"
                              className="hidden"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileChange(docKey, e)}
                              data-testid={`input-upload-${docKey}`}
                            />
                          </label>
                          {uploadedFiles[docKey] && (
                            <button
                              type="button"
                              onClick={() => removeFile(docKey)}
                              className="absolute top-2 right-2 p-1 rounded-full bg-destructive hover:bg-destructive/90"
                              data-testid={`button-remove-${docKey}`}
                            >
                              <X className="h-4 w-4 text-white" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                    })}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        ✓ Vous n'êtes pas obligé d'envoyer vos documents maintenant, mais il faudra les envoyer avant de procéder à la demande. Notre équipe vous contactera si des documents manquent.
                      </p>
                    </div>
                    
                    {docTypeConfig?.hasGovernmentTax && (
                      <>
                        <FormField
                          control={form.control}
                          name="vehicleType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de véhicule</FormLabel>
                              <Select value={field.value || ""} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-vehicle-type">
                                    <SelectValue placeholder="Sélectionnez le type de véhicule" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="vt_m1">Véhicule de tourisme (VP)</SelectItem>
                                  <SelectItem value="utilitaire">Camionnette/Utilitaire ≤3,5t</SelectItem>
                                  <SelectItem value="vasp">Camping-car/VASP ≤3,5t</SelectItem>
                                  <SelectItem value="moto_125">Moto ≤125cc</SelectItem>
                                  <SelectItem value="moto_plus">Moto ≥125cc</SelectItem>
                                  <SelectItem value="tricycle">Tricycle</SelectItem>
                                  <SelectItem value="quad">Quad</SelectItem>
                                  <SelectItem value="cyclomoteur">Cyclomoteur ≤50cc</SelectItem>
                                  <SelectItem value="camion">Camion</SelectItem>
                                  <SelectItem value="bus">Bus/Transport</SelectItem>
                                  <SelectItem value="remorque">Remorque</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vehicleRegion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Département</FormLabel>
                              <Select value={field.value || ""} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-vehicle-region">
                                    <SelectValue placeholder="Sélectionnez votre département" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {departmentsData.departments.map(dept => (
                                    <SelectItem key={dept.code} value={dept.code}>
                                      {dept.code} - {dept.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="vehiclePlate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Immatriculation</FormLabel>
                          <FormControl>
                            <Input placeholder="AA-123-BB" {...field} data-testid="input-vehicle-plate" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!docTypeConfig?.hasGovernmentTax && (
                      <FormField
                        control={form.control}
                        name="vehicleOriginCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pays de provenance du véhicule</FormLabel>
                            <FormControl>
                              <Input placeholder="Allemagne, Belgique, Italie..." {...field} data-testid="input-origin-country" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="vehicleMake"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marque</FormLabel>
                            <FormControl>
                              <Input placeholder="Renault" {...field} data-testid="input-vehicle-make" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vehicleModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modèle</FormLabel>
                            <FormControl>
                              <Input placeholder="Clio" {...field} data-testid="input-vehicle-model" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {docTypeConfig?.hasGovernmentTax && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="vehicleYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Année</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="2020" {...field} data-testid="input-vehicle-year" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vehicleFiscalHorsepower"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chevaux fiscaux</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="5" {...field} data-testid="input-fiscal-horsepower" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="vehicleVin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro VIN</FormLabel>
                          <FormControl>
                            <Input placeholder="VF1XXXXXXXXXX1234" {...field} data-testid="input-vin" />
                          </FormControl>
                          <FormDescription>
                            Le numéro d'identification unique du véhicule (17 caractères)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (optionnel)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Informations complémentaires..."
                              className="resize-none"
                              {...field}
                              data-testid="textarea-notes"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="rounded-lg border p-4 space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer" data-testid="label-express-delivery">
                        <input
                          type="checkbox"
                          checked={expressDelivery}
                          onChange={(e) => setExpressDelivery(e.target.checked)}
                          className="w-4 h-4 rounded border-2 border-primary"
                          data-testid="checkbox-express-delivery"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Traitement express (12h)</div>
                          <div className="text-xs text-muted-foreground">+5€ pour un traitement sous 12h</div>
                        </div>
                      </label>
                    </div>

                    <div className="rounded-lg border p-6 space-y-4 mt-6">
                      <h3 className="font-medium">Récapitulatif</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type de demande:</span>
                          <span className="font-medium">{docTypeConfig?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Immatriculation:</span>
                          <span className="font-medium">{form.getValues("vehiclePlate") || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Documents:</span>
                          <span className="font-medium">{Object.keys(uploadedFiles).length} fichier(s)</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t space-y-2 text-sm">
                        {docTypeConfig?.hasGovernmentTax && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Taxe gouvernementale:</span>
                            <span className="font-medium">{priceBreakdown.total.toFixed(2)}€</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Frais de service:</span>
                          <div className="flex items-center gap-2">
                            {isProfessional && (
                              <span className="text-muted-foreground line-through text-xs">{baseServiceFee.toFixed(2)}€</span>
                            )}
                            <span className="font-medium">{serviceFee.toFixed(2)}€</span>
                            {isProfessional && (
                              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">-35%</span>
                            )}
                          </div>
                        </div>
                        {expressDelivery && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Frais express (12h):</span>
                            <span className="font-medium text-green-600">+5.00€</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total à payer:</span>
                          <span data-testid="text-total-price">
                            {(priceBreakdown.total + serviceFee + (expressDelivery ? 5 : 0)).toFixed(2)}€
                          </span>
                        </div>
                        {isProfessional && (
                          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Tarif professionnel appliqué (-35% sur les frais de service)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between gap-4 pt-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="gap-2"
                      data-testid="button-previous"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="ml-auto gap-2"
                    disabled={createDocumentMutation.isPending || !canProceed()}
                    data-testid="button-next-submit"
                  >
                    {step < 3 ? (
                      <>
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                      </>
                    ) : createDocumentMutation.isPending ? (
                      "Soumission en cours..."
                    ) : (
                      "Soumettre et payer"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
