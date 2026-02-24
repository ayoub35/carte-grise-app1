import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import cerfa13749 from "@assets/cerfa-13749-05-demande-immatriculation-vehicule-neuf_1764608042288.pdf";
import cerfa13750 from "@assets/cerfa-13750-07-demande-certificat-immatriculation-vehicule_1764608042289.pdf";
import cerfa13751 from "@assets/cerfa-13751-02-declaration-achat-vehicule-occasion_1764608042290.pdf";
import cerfa13752 from "@assets/cerfa_13752-02 W GARAGE_1764608042285.pdf";
import cerfa13753 from "@assets/cerfa-13753-04-declaration-perte-vol-carte-grise_1764608042291.pdf";
import cerfa13756 from "@assets/cerfa-13756-declaration-de-retrait-de-la-circulation-dun-vehicule_1764608042292.pdf";
import cerfa14365 from "@assets/cerfa-14365-01-destruction-vehicule-exemple_1764608042295.pdf";
import cerfa14366 from "@assets/cerfa-14366-01-certificat-destruction-vehicule-declaration-intention-destruction_1764608042296.pdf";
import cerfa15776 from "@assets/cerfa-15776-02-certificat-cession-vehicule-occasion_1764608042296.pdf";

const cerfas = [
  {
    number: "13749*05",
    title: "Demande d'immatriculation d'un véhicule neuf",
    description: "Formulaire pour l'immatriculation d'un véhicule neuf",
    file: cerfa13749,
    used_for: ["Immatriculation véhicule neuf"]
  },
  {
    number: "13750*07",
    title: "Demande de certificat d'immatriculation d'un véhicule",
    description: "Formulaire principal pour certificat d'immatriculation (changement titulaire, duplicata, correction)",
    file: cerfa13750,
    used_for: ["Changement de titulaire", "Duplicata", "Corrections"]
  },
  {
    number: "13751*02",
    title: "Déclaration d'achat d'un véhicule d'occasion",
    description: "Formulaire de déclaration d'achat pour véhicule d'occasion",
    file: cerfa13751,
    used_for: ["Changement de titulaire", "Achat d'occasion"]
  },
  {
    number: "13752*02",
    title: "W Garage - Immatriculation provisoire",
    description: "Formulaire pour plaques WW - immatriculation provisoire (véhicules étrangers)",
    file: cerfa13752,
    used_for: ["Immatriculation provisoire"]
  },
  {
    number: "13753*04",
    title: "Déclaration de perte/vol de certificat d'immatriculation",
    description: "Formulaire pour déclarer la perte ou le vol d'une carte grise",
    file: cerfa13753,
    used_for: ["Duplicata (perte/vol)", "Déclaration de perte/vol"]
  },
  {
    number: "13756",
    title: "Déclaration de retrait de la circulation d'un véhicule",
    description: "Formulaire pour retirer un véhicule de la circulation",
    file: cerfa13756,
    used_for: ["Destruction de véhicule", "Retrait de circulation"]
  },
  {
    number: "14365*01",
    title: "Certificat de destruction d'un véhicule",
    description: "Certificat de destruction par un centre VHU (véhicule hors d'usage)",
    file: cerfa14365,
    used_for: ["Destruction de véhicule"]
  },
  {
    number: "14366*01",
    title: "Certificat de destruction - Déclaration d'intention",
    description: "Déclaration d'intention de destruction pour centre VHU",
    file: cerfa14366,
    used_for: ["Destruction de véhicule"]
  },
  {
    number: "15776*02",
    title: "Certificat de cession d'un véhicule d'occasion",
    description: "Formulaire de cession entre ancien et nouveau propriétaire",
    file: cerfa15776,
    used_for: ["Enregistrement de cession", "Vente de véhicule"]
  }
];

export default function Cerfas() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold">Cerfas</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Téléchargez tous les formulaires officiels CERFA nécessaires pour vos démarches d'immatriculation. 
            Ces documents sont fournis à titre informatif et peuvent être complétés via l'ANTS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cerfas.map((cerfa, idx) => (
            <Card key={idx} className="hover-elevate flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{cerfa.title}</CardTitle>
                    <CardDescription className="text-sm mt-2">Cerfa {cerfa.number}</CardDescription>
                  </div>
                  <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 space-y-4">
                <p className="text-sm text-muted-foreground">{cerfa.description}</p>
                
                {cerfa.used_for.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Utilisé pour :</p>
                    <div className="flex flex-wrap gap-2">
                      {cerfa.used_for.map((use, i) => (
                        <span key={i} className="text-xs bg-primary/10 text-primary rounded px-2 py-1">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  asChild 
                  className="w-full mt-auto gap-2" 
                  data-testid={`button-download-cerfa-${cerfa.number}`}
                >
                  <a href={cerfa.file} download={`Cerfa-${cerfa.number}.pdf`}>
                    <Download className="h-4 w-4" />
                    Télécharger
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">À savoir</h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>• Ces formulaires sont les versions officielles du gouvernement français</li>
            <li>• Vous pouvez les imprimer ou les remplir numériquement avant impression</li>
            <li>• Pour soumettre vos démarches en ligne, utilisez le portail ANTS : www.immatriculation.ants.gouv.fr</li>
            <li>• Nos services incluent la préparation et le dépôt de ces formulaires pour vous</li>
            <li>• N'hésitez pas à nous contacter pour clarifier les étapes de remplissage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
