import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import type { ContactSubmission } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function AdminContact() {
  const { toast } = useToast();
  const { data: submissions, isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PATCH", `/api/admin/contact/${id}`, { status: 'read' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
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
      unread: { label: "Non lu", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      read: { label: "Lu", className: "bg-blue-100 text-blue-800 border-blue-200" },
      replied: { label: "Répondu", className: "bg-green-100 text-green-800 border-green-200" },
    };
    const variant = variants[status] || variants.unread;
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages de contact</CardTitle>
        <CardDescription>
          Gérez tous les messages reçus via le formulaire de contact
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : submissions && submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id} data-testid={`admin-contact-${submission.id}`}>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{submission.email}</TableCell>
                    <TableCell>{submission.subject}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(submission.createdAt!).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              if (submission.status === 'unread') {
                                markAsReadMutation.mutate(submission.id);
                              }
                            }}
                            data-testid={`button-view-${submission.id}`}
                          >
                            <Eye className="h-4 w-4" />
                            Voir
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{submission.subject}</DialogTitle>
                            <DialogDescription>
                              De {submission.name} ({submission.email})
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Reçu le {new Date(submission.createdAt!).toLocaleDateString('fr-FR')} à{' '}
                                {new Date(submission.createdAt!).toLocaleTimeString('fr-FR')}
                              </p>
                            </div>
                            <div className="rounded-lg border p-4">
                              <p className="whitespace-pre-wrap">{submission.message}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun message disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
}
