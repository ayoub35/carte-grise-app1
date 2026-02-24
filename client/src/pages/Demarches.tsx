import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DOCUMENT_TYPES } from "@/data/documentTypes";
import { FileText, Users, MoreHorizontal, type LucideIcon } from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  popular: FileText,
  professional: Users,
  other: MoreHorizontal,
};

const categoryLabels = {
  popular: "Les plus populaires",
  professional: "Pour les pros de l'auto",
  other: "Autres démarches",
};

export default function Demarches() {
  const [, setLocation] = useLocation();

  const grouped = {
    popular: DOCUMENT_TYPES.filter(d => d.category === 'popular' && !d.hidden),
    professional: DOCUMENT_TYPES.filter(d => d.category === 'professional' && !d.hidden),
    other: DOCUMENT_TYPES.filter(d => d.category === 'other' && !d.hidden),
  };

  const handleSelectDemarche = (demarcheId: string) => {
    setLocation(`/demarche/${demarcheId}`);
  };

  const CategorySection = ({ category, label, icon: Icon, demarches }: { 
    category: string; 
    label: string; 
    icon: LucideIcon;
    demarches: typeof DOCUMENT_TYPES;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">{label} ({demarches.length})</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {demarches.map((demarche) => (
          <button
            key={demarche.id}
            onClick={() => handleSelectDemarche(demarche.id)}
            className="group"
            data-testid={`button-demarche-${demarche.id}`}
          >
            <Card className="h-full hover-elevate cursor-pointer transition-all">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm leading-snug text-left group-hover:text-primary transition-colors">
                      {demarche.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">{demarche.description}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Toutes les démarches</h1>
          <p className="text-lg text-muted-foreground">Sélectionnez une démarche pour voir les détails et commencer</p>
        </div>

        {/* Popular Category */}
        <CategorySection
          category="popular"
          label={categoryLabels.popular}
          icon={categoryIcons.popular}
          demarches={grouped.popular}
        />

        {/* Professional Category */}
        <CategorySection
          category="professional"
          label={categoryLabels.professional}
          icon={categoryIcons.professional}
          demarches={grouped.professional}
        />

        {/* Other Category */}
        <CategorySection
          category="other"
          label={categoryLabels.other}
          icon={categoryIcons.other}
          demarches={grouped.other}   
        />
      </div>
    </div>
  );
}
