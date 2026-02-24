import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock, CheckCircle, DollarSign, Plus, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Document, Payment } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté. Redirection...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: documents, isLoading: docsLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    enabled: isAuthenticated,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const pendingDocs = documents?.filter(d => d.status === 'pending').length || 0;
  const inProgressDocs = documents?.filter(d => d.status === 'in_progress').length || 0;
  const completedDocs = documents?.filter(d => d.status === 'completed').length || 0;
  const totalPaid = payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

  const recentDocuments = documents?.slice(0, 5) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      in_progress: { label: "En cours", className: "bg-blue-100 text-blue-800 border-blue-200" },
      completed: { label: "Terminé", className: "bg-green-100 text-green-800 border-green-200" },
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge variant="outline" className={variant.className}>
        <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
        {variant.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Bienvenue, {user?.firstName || user?.email?.split('@')[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              Voici un aperçu de vos démarches administratives
            </p>
          </div>
          <Button asChild className="gap-2" data-testid="button-new-document">
            <Link href="/documents/new">
              <a className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle demande
              </a>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {docsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-semibold" data-testid="stat-pending">
                  {pendingDocs}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Démarches en attente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {docsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-semibold" data-testid="stat-in-progress">
                  {inProgressDocs}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Démarches en cours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminé</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {docsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-semibold" data-testid="stat-completed">
                  {completedDocs}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Démarches terminées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total payé</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-semibold" data-testid="stat-total-paid">
                  {totalPaid.toFixed(2)}€
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Montant total
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lancer une démarche</CardTitle>
            <CardDescription>
              Choisissez une démarche pour commencer
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
                <p className="text-xs font-semibold text-muted-foreground mb-2">Démarches populaires</p>
                <div className="space-y-2">
                  <Button asChild className="w-full justify-start h-auto py-2" variant="outline" data-testid="button-changement-adresse">
                    <Link href="/demarche/changement_adresse_carte_grise">
                      <FileText className="w-4 h-4 mr-2" />
                      Changement d'adresse
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start h-auto py-2" variant="outline" data-testid="button-changement-titulaire">
                    <Link href="/demarche/changement_titulaire">
                      <FileText className="w-4 h-4 mr-2" />
                      Changement de titulaire
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start h-auto py-2" variant="outline" data-testid="button-duplicata">
                    <Link href="/demarche/duplicata_carte_grise">
                      <FileText className="w-4 h-4 mr-2" />
                      Duplicata de carte grise
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Documents récents</CardTitle>
                <CardDescription className="mt-1">
                  Vos dernières soumissions de documents
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild data-testid="button-view-all-docs">
                <Link href="/documents">
                  <a className="flex items-center gap-1">
                    Voir tout
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {docsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : recentDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun document</h3>
                <p className="text-muted-foreground mb-4">
                  Vous n'avez pas encore soumis de document.
                </p>
                <Button asChild data-testid="button-first-document">
                  <Link href="/documents/new">
                    <a>Soumettre votre premier document</a>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border hover-elevate"
                    data-testid={`document-${doc.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{doc.vehiclePlate}</div>
                        <div className="text-sm text-muted-foreground">
                          {doc.documentType} • {new Date(doc.createdAt!).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:ml-auto">
                      {getStatusBadge(doc.status)}
                      <span className="font-medium">{parseFloat(doc.price).toFixed(2)}€</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
