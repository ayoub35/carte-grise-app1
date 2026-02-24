import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, MessageCircle, Lock, CreditCard } from "lucide-react";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Habilité SIV",
      description: "Service agréé par le Ministère de l'Intérieur"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Traitement rapide",
      description: "Vos démarches traitées en quelques jours"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Assistance WhatsApp",
      description: "Support client réactif sur WhatsApp"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Sécurisé & crypté",
      description: "Vos données protégées avec les meilleurs standards"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Paiement Stripe",
      description: "Paiement sécurisé par Stripe"
    }
  ];

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Pourquoi nous choisir ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {reasons.map((reason, idx) => (
            <Card key={idx} className="hover-elevate flex flex-col">
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <div className="text-primary">{reason.icon}</div>
                </div>
                <CardTitle className="text-sm">{reason.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{reason.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
