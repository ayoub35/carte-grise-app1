import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PRICING_TABLE } from "@/data/pricingTable";
import { DOCUMENT_TYPES } from "@/data/documentTypes";
import { FileText, Users, MoreHorizontal, Calculator, Car, MapPin, Calendar, Info, type LucideIcon } from "lucide-react";
import departmentsData from "@/data/departments.json";
import pricingCalculator from "@/data/pricingCalculator.json";

const categoryIcons: Record<string, LucideIcon> = {
  professional: Users,
  other: MoreHorizontal,
};

const categoryLabels = {
  professional: "Pour les pros de l'auto",
  other: "Autres démarches",
};

interface PricingItem {
  name: string;
  particulier: number | null;
  professionnel: number | null;
  id?: string;
  category: 'popular' | 'professional' | 'other';
}

const vehicleTypes = [
  { value: "vt_m1", label: "Voiture particulière (VP)" },
  { value: "utilitaire", label: "Véhicule utilitaire léger" },
  { value: "vasp", label: "VASP (Camping-car, ambulance...)" },
  { value: "moto_plus", label: "Moto > 125cc" },
  { value: "moto_125", label: "Moto ≤ 125cc / Scooter" },
  { value: "tricycle", label: "Tricycle" },
  { value: "quad", label: "Quad" },
  { value: "cyclomoteur", label: "Cyclomoteur" },
  { value: "camion", label: "Camion" },
  { value: "bus", label: "Bus / Autocar" },
  { value: "remorque", label: "Remorque" },
];

const demarcheTypes = [
  { value: "2", label: "Changement de titulaire (achat occasion)", hasY1: true },
];

export default function Pricing() {
  const [vehicleType, setVehicleType] = useState("");
  const [department, setDepartment] = useState("");
  const [fiscalPower, setFiscalPower] = useState("");
  const [registrationYear, setRegistrationYear] = useState("");
  const [demarcheType, setDemarcheType] = useState("2");
  const [priceBreakdown, setPriceBreakdown] = useState({
    y1: 0,
    y2: 0,
    y3: 0,
    y4: 11,
    y5: 2.76,
    total: 0,
  });

  const calculatePrice = () => {
    const cv = parseInt(fiscalPower) || 0;
    const year = parseInt(registrationYear) || new Date().getFullYear();
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - year;

    let vehicleMultiplier = vehicleAge > 10 ? 0.5 : 1;
    let taxeFPTransport = 0;
    if (vehicleType) {
      const vehicleData = pricingCalculator.baremeVehicule.find(v => v.typeVehicule === vehicleType);
      if (vehicleData) {
        vehicleMultiplier = vehicleAge > 10 ? vehicleData.baremePlus10 : vehicleData.baremeMoins10;
        taxeFPTransport = vehicleData.taxeFPTransport;
      }
    }

    let demarcheMultiplier = 1;
    const demarcheData = pricingCalculator.baremeDemarche.find(d => d.id === parseInt(demarcheType));
    if (demarcheData) {
      const isMotoMoins125 = vehicleType === 'moto_125';
      demarcheMultiplier = isMotoMoins125 ? demarcheData.baremeMotoMoins125 : demarcheData.baremeAutre;
    }

    let regionalTaxRate = 43;
    if (department) {
      const dept = departmentsData.departments.find(d => d.code === department);
      if (dept) {
        const regionData = pricingCalculator.taxeRegionale.find(r => r.codeRegion === dept.regionCode);
        if (regionData) {
          regionalTaxRate = regionData.taxe;
        }
      }
    }

    const selectedDemarche = demarcheTypes.find(d => d.value === demarcheType);
    const hasY1 = selectedDemarche?.hasY1 ?? true;

    const y1 = hasY1 ? Math.round((cv * regionalTaxRate * vehicleMultiplier * demarcheMultiplier) * 100) / 100 : 0;
    const y2 = taxeFPTransport;
    const y3 = 0;
    const y4 = 11;
    const y5 = 2.76;

    const total = y1 + y2 + y3 + y4 + y5;

    setPriceBreakdown({ y1, y2, y3, y4, y5, total });
  };

  useEffect(() => {
    if (fiscalPower && department) {
      calculatePrice();
    }
  }, [vehicleType, department, fiscalPower, registrationYear, demarcheType]);

  const getCategory = (id?: string): 'popular' | 'professional' | 'other' => {
    if (!id) return 'other';
    const doc = DOCUMENT_TYPES.find(d => d.id === id);
    return doc?.category ?? 'other';
  };

  const itemsWithCategory = PRICING_TABLE.map(item => ({
    ...item,
    category: getCategory(item.id),
  }));

  const popular = itemsWithCategory.filter(item => item.category === 'popular' && !DOCUMENT_TYPES.find(d => d.id === item.id)?.hidden);
  const professional = itemsWithCategory.filter(item => item.category === 'professional' && !DOCUMENT_TYPES.find(d => d.id === item.id)?.hidden);
  const other = itemsWithCategory.filter(item => item.category === 'other' && !DOCUMENT_TYPES.find(d => d.id === item.id)?.hidden);

  const PricingRow = ({ item, index }: { item: PricingItem; index: number }) => (
    <div
      key={item.id || index}
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 p-4 rounded-md ${index % 2 === 0 ? 'bg-muted/70' : 'bg-transparent'
        }`}
      data-testid={`pricing-row-${item.id}`}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{item.name}</p>
      </div>
      <div className="flex gap-4 md:gap-8 text-right flex-shrink-0 w-full md:w-auto justify-end">
        <div data-testid={`pricing-particulier-${item.id}`}>
          {item.particulier !== null ? (
            <div className="font-semibold text-sm md:text-base">{item.particulier.toFixed(2)}€</div>
          ) : (
            <div className="text-muted-foreground">—</div>
          )}
          <div className="text-xs text-muted-foreground hidden md:block">Particulier</div>
          <div className="text-xs text-muted-foreground md:hidden">Part.</div>
        </div>
        <div data-testid={`pricing-professionnel-${item.id}`}>
          {item.professionnel !== null ? (
            <div className="font-semibold text-sm md:text-base">{item.professionnel.toFixed(2)}€</div>
          ) : (
            <div className="text-muted-foreground">—</div>
          )}
          <div className="text-xs text-muted-foreground hidden md:block">Professionnel</div>
          <div className="text-xs text-muted-foreground md:hidden">Prof.</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="text-center space-y-3 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Nos <span className="gradient-text">tarifs</span></h1>
          <p className="text-muted-foreground text-lg">
            Tarifs TTC. Réductions automatiques pour les professionnels.
          </p>
        </div>

        {/* Calculator Section */}
        <Card className="card-premium border-primary/30 animate-fade-in-up delay-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Calculatrice Carte Grise
            </CardTitle>
            <CardDescription>
              Estimez le coût des taxes d'immatriculation pour votre véhicule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="demarcheType">Type de démarche</Label>
                  <Select value={demarcheType} onValueChange={setDemarcheType}>
                    <SelectTrigger id="demarcheType" data-testid="select-demarche-type">
                      <SelectValue placeholder="Sélectionnez une démarche" />
                    </SelectTrigger>
                    <SelectContent>
                      {demarcheTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Type de véhicule</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger id="vehicleType" data-testid="select-vehicle-type">
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Département
                  </Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="department" data-testid="select-department">
                      <SelectValue placeholder="Sélectionnez un département" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentsData.departments.map((dept) => (
                        <SelectItem key={dept.code} value={dept.code}>
                          {dept.code} - {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fiscalPower">Puissance fiscale (CV)</Label>
                  <Input
                    id="fiscalPower"
                    type="number"
                    min="1"
                    max="100"
                    value={fiscalPower}
                    onChange={(e) => setFiscalPower(e.target.value)}
                    placeholder="Ex: 5"
                    data-testid="input-fiscal-power"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationYear" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Année de mise en circulation
                  </Label>
                  <Input
                    id="registrationYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={registrationYear}
                    onChange={(e) => setRegistrationYear(e.target.value)}
                    placeholder="Ex: 2020"
                    data-testid="input-registration-year"
                  />
                </div>

                <Button
                  onClick={calculatePrice}
                  className="w-full gap-2"
                  data-testid="button-calculate"
                >
                  <Calculator className="h-4 w-4" />
                  Calculer
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold">Estimation des taxes</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Y1 - Taxe régionale:</span>
                      <span className="font-medium" data-testid="text-y1-tax">{priceBreakdown.y1.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Y2 - Taxe transport:</span>
                      <span className="font-medium" data-testid="text-y2-tax">{priceBreakdown.y2.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Y3 - Malus CO2:</span>
                      <span className="font-medium" data-testid="text-y3-tax">{priceBreakdown.y3.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Y4 - Taxe gestion:</span>
                      <span className="font-medium" data-testid="text-y4-tax">{priceBreakdown.y4.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Y5 - Redevance acheminement:</span>
                      <span className="font-medium" data-testid="text-y5-tax">{priceBreakdown.y5.toFixed(2)}€</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total taxes:</span>
                      <span className="font-bold text-xl text-primary" data-testid="text-total-price">
                        {priceBreakdown.total.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Ce calcul est une estimation. Le montant exact peut varier selon votre situation.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium max-w-5xl mx-auto animate-fade-in-up delay-200">
          <CardHeader>
            <CardTitle className="text-lg">Grille tarifaire - Frais de service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {popular.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-sm">Les plus populaires ({popular.length})</h3>
                  </div>
                  {popular.map((item, index) => (
                    <PricingRow key={item.id} item={item} index={index} />
                  ))}
                </div>
              )}

              {professional.length > 0 && (
                <div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="professional" className="border rounded-md">
                      <AccordionTrigger className="hover:no-underline px-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-sm">{categoryLabels.professional} ({professional.length})</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 space-y-1">
                        {professional.map((item, index) => (
                          <PricingRow key={item.id} item={item} index={index} />
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              {other.length > 0 && (
                <div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="other" className="border rounded-md">
                      <AccordionTrigger className="hover:no-underline px-4">
                        <div className="flex items-center gap-2">
                          <MoreHorizontal className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-sm">{categoryLabels.other} ({other.length})</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 space-y-1">
                        {other.map((item, index) => (
                          <PricingRow key={item.id} item={item} index={index} />
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium max-w-7xl mx-auto bg-primary/5 border-primary/20 animate-fade-in-up delay-300">
          <CardHeader>
            <CardTitle className="text-primary">Information importante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Frais de service :</strong> Les tarifs affichés ci-dessus sont nos frais de service. Ils correspondent uniquement à notre rémunération pour le traitement et le suivi de votre dossier.
            </p>
            <p>
              <strong>Taxes gouvernementales :</strong> Pour certaines démarches, des taxes d'immatriculation fixées par l'État s'ajoutent à nos frais de service. Ces taxes varient selon la région, le type de véhicule et la démarche effectuée.
            </p>
            <p>
              <strong>Réduction professionnels :</strong> Si vous êtes garage, concessionnaire ou mandataire, les tarifs professionnels listés ci-dessus s'appliquent automatiquement après inscription.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
