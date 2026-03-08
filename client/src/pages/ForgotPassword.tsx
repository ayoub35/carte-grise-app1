import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { KeyRound, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/forgot-password", data);
      setEmail(data.email);
      setSubmitted(true);
      toast({
        title: "Email envoyé",
        description: "Consultez votre email pour réinitialiser votre mot de passe",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold">Email envoyé</h1>
            <p className="text-muted-foreground mt-2">Vérifiez votre messagerie</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Réinitialisation de mot de passe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Un email de réinitialisation a été envoyé à <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Cliquez sur le lien dans l'email pour créer un nouveau mot de passe.
              </p>
              <p className="text-sm text-muted-foreground">
                Si vous ne recevez pas l'email, vérifiez votre dossier spam.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link href="/login">
                  <Button variant="outline" className="w-full" data-testid="button-back-login">
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Mot de passe oublié</h1>
          <p className="text-muted-foreground mt-2">Réinitialisez votre mot de passe</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Récupération de compte</CardTitle>
            <CardDescription>
              Entrez votre email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="votre@email.com" 
                          {...field} 
                          data-testid="input-forgot-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full mt-6" disabled={isLoading} data-testid="button-send-reset">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  Envoyer le lien
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Vous vous souvenez de votre mot de passe ?{" "}
                <Link href="/login" className="text-primary hover:underline" data-testid="link-back-login">
                  Se connecter
                </Link>
              </p>
              <p className="text-muted-foreground mt-2">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-primary hover:underline" data-testid="link-register">
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
