import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, FileText, Plus, Clock, CheckCircle, AlertCircle, 
  LogOut, User, CreditCard, TrendingUp, Loader2, Gift, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  companyName: string;
  siret: string;
  isAdmin: boolean;
  paidOrdersCount: number;
  freeCredits: number;
}

export default function EspacePro() {
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

  useEffect(() => {
    if (!userLoading && (error || !user || user.userType !== 'professional')) {
      setLocation("/login-pro");
    }
  }, [user, userLoading, error, setLocation]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user || user.userType !== 'professional') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Bonjour, {user.firstName}</h1>
              <p className="text-muted-foreground">{user.companyName}</p>
              <p className="text-sm text-muted-foreground">SIRET: {user.siret}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" onClick={() => logoutMutation.mutate()} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
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

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{user.freeCredits}</p>
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Gratuit
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Crédits cession/D.A</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gift className="w-5 h-5 text-primary" />
              Offre 3x2 - Cession ou D.A. gratuit
            </CardTitle>
            <CardDescription>
              Toutes les 2 démarches payées, recevez 1 crédit gratuit pour une cession ou déclaration d'achat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progression vers le prochain crédit</span>
                <span className="font-semibold">{user.paidOrdersCount}/2 démarches</span>
              </div>
              <Progress value={user.paidOrdersCount * 50} className="h-2" />
              {user.freeCredits > 0 && (
                <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Vous avez {user.freeCredits} crédit{user.freeCredits > 1 ? 's' : ''} gratuit{user.freeCredits > 1 ? 's' : ''} à utiliser !
                  </span>
                </div>
              )}
              {user.paidOrdersCount === 1 && (
                <p className="text-xs text-muted-foreground">
                  Plus qu'une démarche pour obtenir votre prochain crédit gratuit !
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nouvelle démarche
              </CardTitle>
              <CardDescription>
                Lancez une nouvelle démarche pour votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start h-auto py-3 text-base" variant="default" data-testid="button-all-demarches">
                  <Link href="/demarches">
                    <FileText className="w-5 h-5 mr-2" />
                    Voir toutes les démarches disponibles
                  </Link>
                </Button>
                <div className="pt-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Démarches populaires pour professionnels</p>
                  <div className="space-y-2">
                    <Button asChild className="w-full justify-start h-auto py-2" variant="outline" data-testid="button-declaration-achat">
                      <Link href="/demarche/declaration_achat">
                        <FileText className="w-4 h-4 mr-2" />
                        Déclaration d'achat
                      </Link>
                    </Button>
                    <Button asChild className="w-full justify-start h-auto py-2" variant="outline" data-testid="button-cession-pro">
                      <Link href="/demarche/cession_vehicule_professionnel">
                        <FileText className="w-4 h-4 mr-2" />
                        Cession de véhicule
                      </Link>
                    </Button>
                    <Button asChild className="w-full justify-start h-auto py-2" variant="outline" data-testid="button-w-garage">
                      <Link href="/demarche/w_garage">
                        <FileText className="w-4 h-4 mr-2" />
                        W garage
                      </Link>
                    </Button>
                  </div>
                </div>
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
              <div>
                <p className="text-sm text-muted-foreground">Entreprise</p>
                <p className="font-medium">{user.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">SIRET</p>
                <p className="font-medium">{user.siret}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
