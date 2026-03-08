import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Faq } from "@shared/schema";

const staticFaqs: Faq[] = [
  {
    id: "static-1",
    question: "Quels sont les documents nécessaires pour faire une carte grise ?",
    answer: "Pour faire votre carte grise, vous aurez généralement besoin d'une pièce d'identité en cours de validité, d'un justificatif de domicile de moins de 6 mois, de la demande de certificat d'immatriculation (Cerfa 13750) et du certificat de cession ou ancienne carte grise barrée.",
    category: "Documents",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "static-2",
    question: "Combien de temps faut-il pour recevoir la carte grise ?",
    answer: "Une fois votre dossier complet et validé, vous recevrez un Certificat Provisoire d'Immatriculation (CPI) vous permettant de rouler pendant 1 mois. La carte grise définitive est envoyée par l'Imprimerie Nationale sous 3 à 5 jours ouvrés.",
    category: "Délais",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "static-3",
    question: "Combien coûte une carte grise ?",
    answer: "Le coût dépend de plusieurs facteurs : la puissance fiscale du véhicule, la région de votre domicile, l'âge du véhicule, et son taux d'émission de CO2. Vous pouvez utiliser notre simulateur en ligne pour obtenir le tarif exact.",
    category: "Tarifs",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "static-4",
    question: "Est-il possible de payer en plusieurs fois ?",
    answer: "Oui, notre plateforme propose des solutions de paiement sécurisé pour faciliter le règlement de vos démarches et frais de taxes.",
    category: "Paiement",
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "static-5",
    question: "Que faire si j'ai perdu ma carte grise ?",
    answer: "En cas de perte, il faut effectuer une demande de duplicata. Vous devrez remplir une déclaration de perte (Cerfa 13753) puis nous soumettre votre dossier.",
    category: "Démarches",
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export default function FAQ() {
  const [search, setSearch] = useState("");
  const { data: faqs, isLoading } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
  });

  const allFaqs = [...staticFaqs, ...(faqs || [])];

  const filteredFaqs = allFaqs.filter(faq =>
    search === "" ||
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase()) ||
    faq.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(allFaqs.map(f => f.category)));

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Foire aux <span className="text-primary font-bold">questions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions
          </p>
        </div>

        <Card className="animate-fade-in-up delay-100">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une question..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-faq"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {faqs?.length === 0 ? "Aucune question" : "Aucun résultat"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {faqs?.length === 0
                    ? "Les questions fréquentes seront bientôt disponibles."
                    : "Aucune question ne correspond à votre recherche."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {categories.map((category) => {
                  const categoryFaqs = filteredFaqs.filter(f => f.category === category);
                  if (categoryFaqs.length === 0) return null;

                  return (
                    <div key={category}>
                      <h3 className="text-lg font-medium mb-4 capitalize">
                        {category}
                      </h3>
                      <Accordion type="single" collapsible className="space-y-2">
                        {categoryFaqs.map((faq, index) => (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id}
                            className="border rounded-lg px-4"
                            data-testid={`faq-item-${index}`}
                          >
                            <AccordionTrigger className="hover:no-underline">
                              <span className="text-left font-medium">
                                {faq.question}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-premium bg-primary/5 border-primary/20 animate-fade-in-up delay-200">
          <CardHeader>
            <CardTitle>Vous ne trouvez pas votre réponse ?</CardTitle>
            <CardDescription>
              Contactez notre équipe de support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild data-testid="button-contact">
              <Link href="/contact">
                <a>Nous contacter</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
