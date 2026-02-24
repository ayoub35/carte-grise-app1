import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Document } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function AdminDocuments() {
  const { toast } = useToast();
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/admin/documents"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/documents/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut du document a été mis à jour avec succès",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      in_progress: { label: "En cours", className: "bg-blue-100 text-blue-800 border-blue-200" },
      completed: { label: "Terminé", className: "bg-green-100 text-green-800 border-green-200" },
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des documents</CardTitle>
        <CardDescription>
          Gérez tous les documents soumis par les utilisateurs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Immatriculation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} data-testid={`admin-doc-${doc.id}`}>
                    <TableCell className="font-medium">{doc.vehiclePlate}</TableCell>
                    <TableCell>{doc.documentType}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{doc.userId}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell>{parseFloat(doc.price).toFixed(2)}€</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(doc.createdAt!).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={doc.status}
                        onValueChange={(status) => updateStatusMutation.mutate({ id: doc.id, status })}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-32" data-testid={`select-status-${doc.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="in_progress">En cours</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun document disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
}
