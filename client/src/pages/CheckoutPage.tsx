import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, FileText, CheckCircle, Upload, X, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DOCUMENT_TYPES, REQUIRED_DOCUMENTS } from "@/data/documentTypes";
import { getPricingForDemarche } from "@/data/pricingTable";
import { demarcheInfo } from "@/data/demarcheInfo";
import departmentsData from "@/data/departments.json";
import pricingCalculator from "@/data/pricingCalculator.json";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone requis"),
  vehicleType: z.string().optional(),
  vehicleRegion: z.string().optional(),
  vehiclePlate: z.string().optional(),
  vehicleOriginCountry: z.string().optional(),
  vehicleRegistrationDay: z.coerce.number().min(1).max(31).optional(),
  vehicleRegistrationMonth: z.coerce.number().min(1).max(12).optional(),
  vehicleRegistrationYear: z.coerce.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  vehicleFiscalHorsepower: z.coerce.number().min(1).optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  notes: z.string().optional(),
  expressDelivery: z.boolean().default(false),
  uploadedFiles: z.record(z.array(z.instanceof(File))).default({}),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [, params] = useRoute("/checkout/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState({ y1: 0, y2: 0, y3: 0, y4: 0, y5: 0, total: 0 });
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [serviceFee, setServiceFee] = useState(0);

  const demarcheId = params?.id;
  const demarche = DOCUMENT_TYPES.find(d => d.id === demarcheId);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      vehicleType: "",
      vehicleRegion: "",
      vehiclePlate: "",
      vehicleOriginCountry: "",
      vehicleRegistrationDay: undefined,
      vehicleRegistrationMonth: undefined,
      vehicleRegistrationYear: undefined,
      vehicleFiscalHorsepower: undefined,
      vehicleMake: "",
      vehicleModel: "",
      notes: "",
      expressDelivery: false,
    },
  });

  const vehicleRegistrationYear = form.watch("vehicleRegistrationYear");
  const fiscalHorsepower = form.watch("vehicleFiscalHorsepower");
  const vehicleType = form.watch("vehicleType");
  const vehicleRegion = form.watch("vehicleRegion");
  const expressDelivery = form.watch("expressDelivery");

  // Calculate price
  const calculatePrice = () => {
    if (!demarche || !demarcheId) return;
    
    // For professional-only démarches, use professional pricing
    let calcServiceFee = getPricingForDemarche(demarcheId, false);
    if (calcServiceFee === null) {
      calcServiceFee = getPricingForDemarche(demarcheId, true) || 30;
    }
    if (calcServiceFee === null) {
      calcServiceFee = 30;
    }
    setServiceFee(calcServiceFee);
    
    if (!demarche.hasGovernmentTax) {
      const expressFee = expressDelivery ? 5 : 0;
      setPriceBreakdown({ y1: 0, y2: 0, y3: 0, y4: 0, y5: 0, total: calcServiceFee + expressFee });
      return;
    }

    if (!vehicleRegistrationYear || !fiscalHorsepower) {
      setPriceBreakdown({ y1: 0, y2: 0, y3: 0, y4: 11, y5: 2.76, total: calcServiceFee + (expressDelivery ? 5 : 0) });
      return;
    }

    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - vehicleRegistrationYear;
    
    let vehicleMultiplier = vehicleAge > 10 ? 0.5 : 1;
    let taxeFPTransport = 0;
    if (vehicleType) {
      const vehicleData = pricingCalculator.baremeVehicule.find(v => v.typeVehicule === vehicleType);
      if (vehicleData) {
        vehicleMultiplier = vehicleAge > 10 ? vehicleData.baremePlus10 : vehicleData.baremeMoins10;
        taxeFPTransport = vehicleData.taxeFPTransport;
      }
    }

    let govDemarcheId = 2;
    if (demarche.id === 'duplicata_carte_grise') govDemarcheId = 3;
    else if (demarche.id === 'immatriculation_provisoire') govDemarcheId = 14;
    else if (demarche.id === 'w_garage') govDemarcheId = 14;

    let demarche_multiplier = 1;
    const demarchemData = pricingCalculator.baremeDemarche.find(d => d.id === govDemarcheId);
    if (demarchemData) {
      const isMotoMoins125 = vehicleType === 'moto_125';
      demarche_multiplier = isMotoMoins125 ? demarchemData.baremeMotoMoins125 : demarchemData.baremeAutre;
    }

    let regionCode = 75;
    if (vehicleRegion) {
      const dept = departmentsData.departments.find(d => d.code === vehicleRegion);
      if (dept) {
        regionCode = dept.regionCode;
      }
    }
    const regionData = pricingCalculator.taxeRegionale.find(r => r.codeRegion === regionCode);
    const regionalTaxRate = regionData?.taxe || 43;

    const y1 = Math.round((fiscalHorsepower * regionalTaxRate * vehicleMultiplier * demarche_multiplier) * 100) / 100;
    const y2 = taxeFPTransport;
    const y3 = 0;
    const y4 = 11;
    const y5 = 2.76;
    const govTotal = y1 + y2 + y3 + y4 + y5;
    const expressFee = expressDelivery ? 5 : 0;
    const total = govTotal + calcServiceFee + expressFee;

    setPriceBreakdown({ y1, y2, y3, y4, y5, total });
  };

  // Recalculate on form changes
  useEffect(calculatePrice, [vehicleRegistrationYear, fiscalHorsepower, vehicleType, vehicleRegion, expressDelivery, demarche, demarcheId]);

  const onSubmit = async (data: CheckoutValues) => {
    if (!demarche || !demarcheId) {
      console.log("Missing demarche or demarcheId");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting order...", data);
      
      // Recalculate service fee to ensure it's correct
      let calcServiceFee = getPricingForDemarche(demarcheId, false);
      if (calcServiceFee === null) {
        calcServiceFee = getPricingForDemarche(demarcheId, true) || 30;
      }
      if (calcServiceFee === null) {
        calcServiceFee = 30;
      }
      
      const govTotal = priceBreakdown.y1 + priceBreakdown.y2 + priceBreakdown.y3 + priceBreakdown.y4 + priceBreakdown.y5;
      const expressFee = data.expressDelivery ? 5 : 0;
      const total = govTotal + calcServiceFee + expressFee;
      
      console.log("Total price:", total, "ServiceFee:", calcServiceFee);
      const response = await apiRequest("POST", "/api/documents/public", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        documentType: demarcheId,
        vehicleInfo: {
          type: data.vehicleType,
          region: data.vehicleRegion,
          plate: data.vehiclePlate,
          registrationDay: data.vehicleRegistrationDay,
          registrationMonth: data.vehicleRegistrationMonth,
          registrationYear: data.vehicleRegistrationYear,
          fiscalHorsepower: data.vehicleFiscalHorsepower,
          make: data.vehicleMake,
          model: data.vehicleModel,
        },
        price: total,
        governmentTax: govTotal,
        serviceFee: calcServiceFee,
        expressFee: expressFee,
        expressDelivery: data.expressDelivery,
        notes: data.notes,
        filePaths: [],
      });

      const result = await response.json();
      if (result && result.orderNumber) {
        toast({
          title: "Commande créée!",
          description: `Numéro: ${result.orderNumber}`,
        });
        setLocation(`/order/success/${result.orderNumber}`);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!demarche) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold">Démarche non trouvée</h1>
          <Button onClick={() => setLocation("/demarches")} className="mt-4">
            Retour aux démarches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">{demarche.name}</h1>
          <p className="text-lg text-muted-foreground">Complétez le formulaire et payez en ligne</p>
        </div>

        {/* Warning for new vehicle */}
        {demarcheId === 'premiere_immatriculation_neuf' && (
          <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30">
            <CardContent className="pt-6 text-sm space-y-2">
              <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                ⚠️ Prix non définitif
              </p>
              <p className="text-yellow-800 dark:text-yellow-200">
                Le tarif affiché n’inclut pas le malus écologique (TCFE), qui dépend des émissions CO₂ de votre véhicule. Si vous êtes concerné, un surcoût vous sera communiqué avant la finalisation de la commande.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} data-testid="input-firstname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" {...field} data-testid="input-lastname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="jean@example.com" type="email" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="06 12 34 56 78" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Vehicle details - only show if demarche requires them and is not a fixed-price demarche */}
                    {demarche.hasGovernmentTax && !['duplicata_carte_grise', 'w_garage', 'changement_adresse_carte_grise', 'carte_grise_vehicule_etranger', 'changement_caracteristiques_techniques', 'changement_raison_sociale', 'correction_erreur_carte_grise', 'ajout_retrait_cotitulaire'].includes(demarcheId || '') && (
                      <>
                        <h3 className="font-medium text-sm pt-4">Détails du véhicule</h3>

                        <FormField
                          control={form.control}
                          name="vehicleType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de véhicule</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-vehicle-type">
                                    <SelectValue placeholder="Sélectionner..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="vt_m1">Voiture particulière</SelectItem>
                                  <SelectItem value="utilitaire">Utilitaire</SelectItem>
                                  <SelectItem value="vasp">VASP (Petit utilitaire spécialisé)</SelectItem>
                                  <SelectItem value="moto_125">Moto -125cc</SelectItem>
                                  <SelectItem value="moto_plus">Moto +125cc</SelectItem>
                                  <SelectItem value="tricycle">Tricycle</SelectItem>
                                  <SelectItem value="quad">Quad</SelectItem>
                                  <SelectItem value="cyclomoteur">Cyclomoteur</SelectItem>
                                  <SelectItem value="camion">Camion</SelectItem>
                                  <SelectItem value="bus">Bus</SelectItem>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-department">
                                    <SelectValue placeholder="Sélectionner..." />
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

                        <div className="space-y-2">
                          <FormLabel>Première mise en circulation</FormLabel>
                          <div className="grid grid-cols-3 gap-2">
                            <FormField
                              control={form.control}
                              name="vehicleRegistrationDay"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="number" placeholder="JJ" min="1" max="31" {...field} data-testid="input-registration-day" className="text-center" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="vehicleRegistrationMonth"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="number" placeholder="MM" min="1" max="12" {...field} data-testid="input-registration-month" className="text-center" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="vehicleRegistrationYear"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="number" placeholder="AAAA" min="1900" max={new Date().getFullYear() + 1} {...field} data-testid="input-registration-year" className="text-center" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="vehicleFiscalHorsepower"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2">
                                <FormLabel>Chevaux fiscaux</FormLabel>
                                <Tooltip delayDuration={100}>
                                  <TooltipTrigger asChild>
                                    <button type="button" className="inline-flex" data-testid="button-cv-info">
                                      <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">Il s'agit du champ "E" sur votre carte grise (Puissance fiscale)</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <FormControl>
                                <Input type="number" placeholder="5" {...field} data-testid="input-cv" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="vehicleMake"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Marque</FormLabel>
                                <FormControl>
                                  <Input placeholder="Renault" {...field} data-testid="input-make" />
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
                                  <Input placeholder="Clio" {...field} data-testid="input-model" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}

                    {demarcheId === 'immatriculation_provisoire' && (
                      <>
                        <h3 className="font-medium text-sm pt-4">Détails du véhicule</h3>

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

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="vehicleMake"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Marque</FormLabel>
                                <FormControl>
                                  <Input placeholder="Renault" {...field} data-testid="input-make" />
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
                                  <Input placeholder="Clio" {...field} data-testid="input-model" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (optionnel)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="..." className="resize-none" {...field} data-testid="textarea-notes" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expressDelivery"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3 rounded-lg border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 rounded border-2 border-primary"
                              data-testid="checkbox-express"
                            />
                          </FormControl>
                          <div className="flex-1">
                            <label className="font-medium text-sm cursor-pointer">Traitement express (12h)</label>
                            <p className="text-xs text-muted-foreground">+5€ pour un traitement sous 12h</p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Document Upload */}
                    <div className="pt-4">
                      <h3 className="font-medium text-sm mb-2">Documents</h3>
                      <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-500 dark:border-green-700 rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                          📄 Vous n'êtes pas obligé d'envoyer vos documents maintenant, mais il faudra les envoyer avant de procéder à la demande. Notre équipe vous contactera si des documents manquent.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {/* Check if demarche has custom documentsRequired in demarcheInfo */}
                      {demarcheId && (demarcheInfo as any)[demarcheId]?.documentsRequired ? (
                        (demarcheInfo as any)[demarcheId].documentsRequired.map((doc: string, idx: number) => {
                          const docKey = `doc-${idx}`;
                          const files = uploadedFiles[docKey] || [];
                          return (
                            <div key={docKey} className="border rounded-lg p-4 space-y-2 hover-elevate">
                              <div>
                                <p className="font-medium text-sm">{doc}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                {files.length > 0 && (
                                  <div className="space-y-1">
                                    {files.map((file, fileIdx) => (
                                      <div key={fileIdx} className="flex items-center justify-between bg-muted/50 rounded p-2 text-sm">
                                        <span className="truncate">{file.name}</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setUploadedFiles(prev => ({
                                              ...prev,
                                              [docKey]: prev[docKey].filter((_, i) => i !== fileIdx)
                                            }));
                                          }}
                                          className="text-destructive hover:text-destructive/80"
                                          data-testid={`button-remove-${docKey}-${fileIdx}`}
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition">
                                  <Upload className="h-4 w-4" />
                                  <span className="text-sm text-muted-foreground">Cliquez pour ajouter</span>
                                  <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={(e) => {
                                      if (e.target.files) {
                                        setUploadedFiles(prev => ({
                                          ...prev,
                                          [docKey]: [...(prev[docKey] || []), ...Array.from(e.target.files!)]
                                        }));
                                      }
                                    }}
                                    className="hidden"
                                    data-testid={`input-file-${docKey}`}
                                  />
                                </label>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        demarche.requiredDocuments.map((docType) => {
                          const docInfo = REQUIRED_DOCUMENTS[docType as keyof typeof REQUIRED_DOCUMENTS];
                          const files = uploadedFiles[docType] || [];
                          return (
                            <div key={docType} className="border rounded-lg p-4 space-y-2 hover-elevate">
                              <div>
                                <p className="font-medium text-sm">{docInfo?.label || docType}</p>
                                <p className="text-xs text-muted-foreground">{docInfo?.description}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                {files.length > 0 && (
                                  <div className="space-y-1">
                                    {files.map((file, idx) => (
                                      <div key={idx} className="flex items-center justify-between bg-muted/50 rounded p-2 text-sm">
                                        <span className="truncate">{file.name}</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setUploadedFiles(prev => ({
                                              ...prev,
                                              [docType]: prev[docType].filter((_, i) => i !== idx)
                                            }));
                                          }}
                                          className="text-destructive hover:text-destructive/80"
                                          data-testid={`button-remove-${docType}-${idx}`}
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition">
                                  <Upload className="h-4 w-4" />
                                  <span className="text-sm text-muted-foreground">Cliquez pour ajouter</span>
                                  <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={(e) => {
                                      if (e.target.files) {
                                        setUploadedFiles(prev => ({
                                          ...prev,
                                          [docType]: [...(prev[docType] || []), ...Array.from(e.target.files!)]
                                        }));
                                      }
                                    }}
                                    className="hidden"
                                    data-testid={`input-file-${docType}`}
                                  />
                                </label>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting} data-testid="button-pay">
                      {isSubmitting ? "Traitement..." : `Procéder au paiement: ${priceBreakdown.total.toFixed(2)}€`}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card className="border-primary/50 bg-primary/5 sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Démarche:</span>
                    <span className="font-medium">{demarche.name}</span>
                  </div>
                  {demarche.hasGovernmentTax && priceBreakdown.y1 > 0 && !['duplicata_carte_grise', 'w_garage', 'changement_adresse_carte_grise', 'carte_grise_vehicule_etranger', 'changement_caracteristiques_techniques', 'changement_raison_sociale', 'correction_erreur_carte_grise', 'ajout_retrait_cotitulaire'].includes(demarcheId || '') && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxe gouvernementale:</span>
                        <span className="font-medium">{priceBreakdown.total > serviceFee + (expressDelivery ? 5 : 0) ? (priceBreakdown.total - serviceFee - (expressDelivery ? 5 : 0)).toFixed(2) : '0.00'}€</span>
                      </div>
                    </>
                  )}
                  {demarcheId !== 'immatriculation_provisoire' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frais de service:</span>
                      <span className="font-medium">{serviceFee.toFixed(2)}€</span>
                    </div>
                  )}
                  {expressDelivery && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Express 24h:</span>
                      <span className="font-medium text-green-600">+5.00€</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span data-testid="text-total">{priceBreakdown.total.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">Service SIV/ANTS</p>
                  <p className="text-xs text-blue-800 dark:text-blue-200 mb-3">
                    {demarcheId === 'immatriculation_provisoire' ? (
                      <>
                        Frais service AutoDossiers : {Math.max(0, priceBreakdown.total - 11).toFixed(2)}€ TTC<br/>
                        Frais administratifs : 11.00€
                      </>
                    ) : (
                      <>
                        Frais service AutoDossiers : {serviceFee.toFixed(2)}€ TTC (hors taxes immatriculation)<br/>
                        Taxes : fixées par l'État (varient par région et véhicule)
                      </>
                    )}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Paiement sécurisé Stripe</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Traitement immédiat</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
