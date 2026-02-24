import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payment } from "@shared/schema";

export function AdminPayments() {
  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      succeeded: { label: "Réussi", className: "bg-green-100 text-green-800 border-green-200" },
      failed: { label: "Échoué", className: "bg-red-100 text-red-800 border-red-200" },
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const totalRevenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
  const successfulPayments = payments?.filter(p => p.status === 'succeeded').length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des paiements</CardTitle>
        <CardDescription>
          Historique de tous les paiements de la plateforme
        </CardDescription>
        <div className="flex gap-6 pt-4">
          <div>
            <div className="text-2xl font-semibold" data-testid="total-revenue">
              {totalRevenue.toFixed(2)}€
            </div>
            <p className="text-sm text-muted-foreground">Revenu total</p>
          </div>
          <div>
            <div className="text-2xl font-semibold" data-testid="successful-payments">
              {successfulPayments}
            </div>
            <p className="text-sm text-muted-foreground">Paiements réussis</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : payments && payments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} data-testid={`admin-payment-${payment.id}`}>
                    <TableCell className="font-mono text-xs">{payment.id.slice(0, 8)}...</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{payment.userId.slice(0, 8)}...</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.documentId ? payment.documentId.slice(0, 8) + '...' : '-'}
                    </TableCell>
                    <TableCell className="font-medium">{parseFloat(payment.amount).toFixed(2)}€</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(payment.createdAt!).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun paiement disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
}
