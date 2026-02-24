import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, FileText, Plus, Clock, CheckCircle, AlertCircle, 
  LogOut, CreditCard, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  isAdmin: boolean;
}

export default function EspaceParticulier() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading: userLoading, error } = useQuery<UserData>({
    queryKey: ["/api/auth/me"],
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      setLocation("/");
    },
  });

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user || user.userType !== 'individual') {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Bonjour, {user.firstName}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" onClick={() => logoutMutation.mutate()} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Démarches totales</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">En cours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Terminées</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nouvelle démarche
              </CardTitle>
              <CardDescription>
                Lancez une nouvelle démarche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/demarches">
                  <Button className="w-full justify-start" variant="outline" data-testid="button-new-demarche">
                    <FileText className="w-4 h-4 mr-2" />
                    Voir toutes les démarches disponibles
                  </Button>
                </Link>
                <Link href="/checkout/changement_titulaire">
                  <Button className="w-full justify-start" variant="outline" data-testid="button-carte-grise">
                    <FileText className="w-4 h-4 mr-2" />
                    Changement de titulaire (Carte grise)
                  </Button>
                </Link>
                <Link href="/checkout/duplicata">
                  <Button className="w-full justify-start" variant="outline" data-testid="button-duplicata">
                    <FileText className="w-4 h-4 mr-2" />
                    Duplicata de carte grise
                  </Button>
                </Link>
                <Link href="/checkout/changement_adresse">
                  <Button className="w-full justify-start" variant="outline" data-testid="button-adresse">
                    <FileText className="w-4 h-4 mr-2" />
                    Changement d'adresse
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Démarches récentes
              </CardTitle>
              <CardDescription>
                Vos dernières démarches en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune démarche en cours</p>
                <p className="text-sm mt-2">Lancez votre première démarche !</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations du compte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
