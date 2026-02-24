import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Search } from "lucide-react";
import { Link } from "wouter";
import type { Document } from "@shared/schema";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Documents() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
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

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = search === "" || 
      doc.vehiclePlate.toLowerCase().includes(search.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

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
            <h1 className="text-3xl font-semibold tracking-tight">Mes Documents</h1>
            <p className="text-muted-foreground mt-1">
              Gérez tous vos documents automobiles
            </p>
          </div>
          <Button asChild className="gap-2" data-testid="button-new-document">
            <Link href="/documents/new">
              <a className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouveau document
              </a>
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par immatriculation ou type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48" data-testid="select-status-filter">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {documents?.length === 0 ? "Aucun document" : "Aucun résultat"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {documents?.length === 0 
                    ? "Vous n'avez pas encore soumis de document."
                    : "Aucun document ne correspond à vos critères de recherche."}
                </p>
                {documents?.length === 0 && (
                  <Button asChild data-testid="button-first-document">
                    <Link href="/documents/new">
                      <a>Soumettre votre premier document</a>
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-lg border hover-elevate"
                    data-testid={`document-${doc.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium" data-testid={`text-plate-${doc.id}`}>
                          {doc.vehiclePlate}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {doc.vehicleMake && doc.vehicleModel && `${doc.vehicleMake} ${doc.vehicleModel} • `}
                          {doc.documentType}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Soumis le {new Date(doc.createdAt!).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      {getStatusBadge(doc.status)}
                      <span className="font-medium" data-testid={`text-price-${doc.id}`}>
                        {parseFloat(doc.price).toFixed(2)}€
                      </span>
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
