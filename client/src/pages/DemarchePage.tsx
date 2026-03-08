import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, ExternalLink, ArrowRight, CheckCircle, FileText, Download } from "lucide-react";
import { DOCUMENT_TYPES, REQUIRED_DOCUMENTS } from "@/data/documentTypes";
import { demarcheInfo } from "@/data/demarcheInfo";
import { getMinPricingForDemarche, getPricingForDemarche } from "@/data/pricingTable";
import WhyChooseUs from "@/components/WhyChooseUs";
import LeadForm from "@/components/LeadForm";
import cerfa13751 from "@assets/cerfa-13751-02-declaration-achat-vehicule-occasion_1764608042290.pdf";
import cerfa15776 from "@assets/cerfa-15776-02-certificat-cession-vehicule-occasion_1764608042296.pdf";

type DemarcheInfoKey = keyof typeof demarcheInfo;
type FAQItem = { question: string; answer: string };
type DetailString = string;

const pdfDownloads: Record<string, string> = {
  cerfa13751,
  cerfa15776,
};

export default function DemarchePage() {
  const [, params] = useRoute("/demarche/:id");
  const [, setLocation] = useLocation();

  const demarcheId = params?.id;
  const demarche = DOCUMENT_TYPES.find(d => d.id === demarcheId);
  const info = demarcheId ? demarcheInfo[demarcheId as keyof typeof demarcheInfo] : null;

  if (!demarche || !info) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold">Démarche non trouvée</h1>
          <Button onClick={() => setLocation("/")} className="mt-4">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const handleStartDemarche = () => {
    setLocation(`/checkout/${demarcheId}`);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      {/* Mobile CTA Button */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background border-b px-4 py-3">
        <Button size="lg" onClick={handleStartDemarche} className="w-full gap-2" data-testid="button-mobile-demarche-cta">
          Commencer la démarche
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 md:mt-0 mt-16">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">{demarche.name}</h1>
          <p className="text-lg text-muted-foreground">{demarche.description}</p>
        </div>

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {/* Left Column - Main Info */}
          <div className="md:col-span-3 space-y-6">
            {/* SIV/ANTS Notice */}
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
              <CardContent className="pt-6 text-sm space-y-2">
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  Service habilité SIV - Ministère de l'Intérieur
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  AutoDossiers est un intermédiaire agrégateur agissant pour le compte du client auprès de l'ANTS. 
                  Les taxes d'immatriculation sont fixées par l'État et ne constituent pas un prix de service.
                </p>
              </CardContent>
            </Card>

            {/* Contact Notice */}
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
              <CardContent className="pt-6 text-sm flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800 dark:text-green-200">
                  Pour toute requête exceptionnelle, veuillez prendre contact avec nous par <strong>WhatsApp</strong> ou par <strong>téléphone</strong>.
                </p>
              </CardContent>
            </Card>

            {/* Explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Explication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
                <p>{info.explanation}</p>
                {info.details && (
                  <div className="space-y-2 pt-2">
                    {info.details.map((detail: DetailString, idx: number) => {
                      // Replace hardcoded prices with dynamic ones from pricing table
                      let displayDetail = detail;
                      const price = getPricingForDemarche(demarcheId || '') || getMinPricingForDemarche(demarcheId || '') || 30;
                      
                      // Replace any "frais de service: XX€" or "frais de service XX€" pattern with actual price
                      displayDetail = displayDetail.replace(/(frais de service:?\s*)\d+(\.\d+)?€/gi, `$1${price.toFixed(2)}€`);
                      
                      // Replace "Coût: XX€" (but not with "environ") with actual price
                      if (detail.includes("Coût:") && !detail.includes("environ")) {
                        displayDetail = displayDetail.replace(/Coût:\s*\d+(\.\d+)?€/, `Coût: ${price.toFixed(2)}€`);
                      }
                      
                      return (
                        <div key={idx} className="flex gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{displayDetail}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents nécessaires</CardTitle>
                <CardDescription>Préparez ces documents pour la démarche</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Special case for succession - show both document lists */}
                {demarcheId === 'succession' && (info as any).documentsAvecNotaire && (info as any).documentsSansNotaire ? (
                  <div className="space-y-6">
                    {/* With Notaire */}
                    <div>
                      <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Véhicule hérité avec intervention d'un notaire
                      </h4>
                      <div className="space-y-2 pl-4">
                        {(info as any).documentsAvecNotaire.map((doc: string, idx: number) => (
                          <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                            <div className="text-sm">{doc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Without Notaire */}
                    <div>
                      <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Véhicule hérité sans notaire (succession simple)
                      </h4>
                      <div className="space-y-2 pl-4">
                        {(info as any).documentsSansNotaire.map((doc: string, idx: number) => (
                          <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="text-sm">{doc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm">
                      <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                        ⚠️ Délai important
                      </p>
                      <p className="text-amber-800 dark:text-amber-200">
                        Les héritiers disposent d'un délai maximal de <strong>3 mois après le décès</strong> pour mettre la carte grise à leur nom. 
                        En cas de vente, tous les documents relatifs à la succession doivent être remis à l'acquéreur.
                      </p>
                    </div>
                  </div>
                ) : (info as any).documentsRequired ? (
                  <div className="space-y-3">
                    {(info as any).documentsRequired.map((doc: string, idx: number) => (
                      <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                        <div className="text-sm">{doc}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {demarche.requiredDocuments.map((docKey) => {
                      const doc = REQUIRED_DOCUMENTS[docKey as keyof typeof REQUIRED_DOCUMENTS];
                      return (
                        <div key={docKey} className="border-l-4 border-primary pl-4 py-2">
                          <div className="font-medium">{doc.label}</div>
                          <div className="text-sm text-muted-foreground">{doc.description}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {info.faq.map((item: FAQItem, idx: number) => (
                    <div key={idx} className="space-y-2">
                      <h4 className="font-medium text-sm">{item.question}</h4>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - CTA */}
          <div className="space-y-4">
            {/* Lead Form */}
            {demarcheId && demarche && (
              <LeadForm demarcheId={demarcheId} demarcheName={demarche.name} />
            )}

            {/* Start Button */}
            <Card className="border-primary/50 bg-primary/5 sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Prêt à commencer?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleStartDemarche}
                  size="lg"
                  className="w-full gap-2"
                  data-testid={`button-start-demarche-${demarcheId}`}
                >
                  Commencer la démarche
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {(() => {
                    if (!demarcheId) return "Tarif sur demande";
                    const minPrice = getMinPricingForDemarche(demarcheId);
                    if (!minPrice) return "Tarif sur demande";
                    
                    if (demarche.hasGovernmentTax) {
                      return `À partir de ${minPrice.toFixed(2)}€ en frais de service (+ taxes d'immatriculation)`;
                    }
                    return `À partir de ${minPrice.toFixed(2)}€ en frais de service`;
                  })()}
                </p>

                {/* Download Cerfas */}
                {'cerfas' in info && info.cerfas && info.cerfas.length > 0 && (
                  <div className="pt-3 border-t space-y-2">
                    <p className="text-xs font-semibold text-foreground">Cerfas à télécharger:</p>
                    {(info.cerfas as any).map((cerfa: any, idx: number) => {
                      const isDownloadable = 'downloadId' in cerfa && cerfa.downloadId in pdfDownloads;
                      const href = isDownloadable ? pdfDownloads[cerfa.downloadId] : (cerfa.url || '#');
                      const isExternal = !isDownloadable && cerfa.url;
                      
                      return (
                        <a
                          key={idx}
                          href={href}
                          download={isDownloadable ? `Cerfa-${cerfa.cerfa}.pdf` : undefined}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-2 text-xs text-primary hover:underline"
                          data-testid={`link-download-cerfa-${idx}`}
                        >
                          <Download className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{cerfa.name}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ANTS Link */}
            {info.antsUrl && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Lien officiel</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={info.antsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                    data-testid={`link-ants-${demarcheId}`}
                  >
                    Site ANTS
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Contact CTA */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Questions?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  asChild
                  data-testid={`button-whatsapp-${demarcheId}`}
                >
                  <a
                    href="https://wa.me/33123456789?text=Bonjour%2C%20j%27ai%20une%20question%20sur%20cette%20d%C3%A9marche"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  asChild
                  data-testid={`button-call-${demarcheId}`}
                >
                  <a href="tel:+33123456789">
                    <Phone className="h-4 w-4" />
                    Appeler
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
