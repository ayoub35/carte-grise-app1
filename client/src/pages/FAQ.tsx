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

export default function FAQ() {
  const [search, setSearch] = useState("");
  const { data: faqs, isLoading } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
  });

  const filteredFaqs = faqs?.filter(faq =>
    search === "" ||
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase()) ||
    faq.category.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const categories = Array.from(new Set(faqs?.map(f => f.category) || []));

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Foire aux <span className="gradient-text">questions</span>
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
