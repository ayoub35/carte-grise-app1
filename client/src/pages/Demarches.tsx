import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { DOCUMENT_TYPES } from "@/data/documentTypes";
import { FileText, Users, MoreHorizontal, ArrowRight, type LucideIcon } from "lucide-react";

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
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">{label} <span className="text-muted-foreground font-normal text-lg">({demarches.length})</span></h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demarches.map((demarche, idx) => (
          <button
            key={demarche.id}
            onClick={() => handleSelectDemarche(demarche.id)}
            className="group text-left"
            data-testid={`button-demarche-${demarche.id}`}
          >
            <Card className={`h-full card-premium border-transparent bg-card/80 backdrop-blur-sm cursor-pointer animate-fade-in-up delay-${Math.min((idx + 1) * 100, 400)}`}>
              <CardContent className="p-5">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors duration-300">
                      {demarche.name}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{demarche.description}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="mx-auto max-w-6xl space-y-14">
        {/* Header */}
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Toutes les <span className="text-primary font-bold">démarches</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Sélectionnez une démarche pour voir les détails et commencer votre procédure en ligne
          </p>
        </div>

        <CategorySection
          category="popular"
          label={categoryLabels.popular}
          icon={categoryIcons.popular}
          demarches={grouped.popular}
        />

        <CategorySection
          category="professional"
          label={categoryLabels.professional}
          icon={categoryIcons.professional}
          demarches={grouped.professional}
        />

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
