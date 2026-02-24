import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPro() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/login/pro", data);
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace professionnel !",
      });
      setLocation("/espace-pro");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Espace Professionnel</h1>
          <p className="text-muted-foreground mt-2">Connectez-vous à votre espace pro</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion Professionnel</CardTitle>
            <CardDescription>
              Accédez à votre espace de gestion
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
                      <FormLabel>Email professionnel</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@entreprise.fr" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full mt-6" disabled={isLoading} data-testid="button-login">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  Se connecter
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm space-y-2">
              <p className="text-muted-foreground">
                Mot de passe oublié ?{" "}
                <Link href="/forgot-password" className="text-primary hover:underline" data-testid="link-forgot-password">
                  Réinitialiser
                </Link>
              </p>
              <p className="text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link href="/register-pro" className="text-primary hover:underline" data-testid="link-register">
                  Créer un compte pro
                </Link>
              </p>
              <p className="text-muted-foreground">
                Vous êtes un particulier ?{" "}
                <Link href="/login" className="text-primary hover:underline" data-testid="link-particulier">
                  Espace particulier
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
