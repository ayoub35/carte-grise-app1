import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface LeadFormProps {
  demarcheId: string;
  demarcheName: string;
}

export default function LeadForm({ demarcheId, demarcheName }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir votre nom et votre numéro",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          demarcheId,
          demarcheName,
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès!",
          description: "Nous avons reçu votre demande. Nous vous recontacterons rapidement.",
        });
        setName("");
        setPhone("");
      } else {
        throw new Error("Erreur lors de l'envoi");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Commencer en 30 secondes</CardTitle>
        <CardDescription className="text-xs">Pas d'inscription requise</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              data-testid="input-lead-name"
              className="text-sm"
            />
          </div>
          <div>
            <Input
              placeholder="Votre numéro"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
              data-testid="input-lead-phone"
              className="text-sm"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            size="sm"
            disabled={isSubmitting}
            data-testid="button-submit-lead"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              "Être rappelé"
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Nous vous rappellerons rapidement
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
