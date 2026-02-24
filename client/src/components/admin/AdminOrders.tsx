import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Eye, FileText, Download, User, Car, CreditCard, Calendar, Phone, Mail } from "lucide-react";

export function AdminOrders() {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la demande a été mis à jour avec succès",
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
      cancelled: { label: "Annulé", className: "bg-red-100 text-red-800 border-red-200" },
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Non payé", className: "bg-orange-100 text-orange-800 border-orange-200" },
      succeeded: { label: "Payé", className: "bg-green-100 text-green-800 border-green-200" },
      failed: { label: "Échoué", className: "bg-red-100 text-red-800 border-red-200" },
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const getDocumentTypeName = (type: string) => {
    const names: Record<string, string> = {
      changement_titulaire: "Changement de titulaire",
      premiere_immatriculation: "Première immatriculation",
      duplicata: "Duplicata carte grise",
      changement_adresse: "Changement d'adresse",
      w_garage: "W Garage",
      immatriculation_provisoire: "Immat. provisoire",
    };
    return names[type] || type;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gestion des demandes
          </CardTitle>
          <CardDescription>
            Suivez et gérez toutes les demandes de vos clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Commande</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} data-testid={`admin-order-${order.id}`}>
                      <TableCell className="font-mono font-medium text-primary">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {order.firstName} {order.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">{order.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {getDocumentTypeName(order.documentType)}
                      </TableCell>
                      <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="font-medium">
                        {parseFloat(order.price).toFixed(2)}€
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.createdAt!).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedOrder(order)}
                            data-testid={`button-view-order-${order.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            value={order.status}
                            onValueChange={(status) => updateStatusMutation.mutate({ id: order.id, status })}
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-28" data-testid={`select-status-${order.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="in_progress">En cours</SelectItem>
                              <SelectItem value="completed">Terminé</SelectItem>
                              <SelectItem value="cancelled">Annulé</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune demande disponible
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Demande {selectedOrder.orderNumber}
                </DialogTitle>
                <DialogDescription>
                  Détails complets de la demande
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedOrder.status)}
                  {getPaymentBadge(selectedOrder.paymentStatus)}
                  {selectedOrder.expressDelivery && (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      Express
                    </Badge>
                  )}
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Informations client
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Nom:</span>
                        <span className="font-medium">{selectedOrder.firstName} {selectedOrder.lastName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <a href={`mailto:${selectedOrder.email}`} className="text-primary hover:underline">
                          {selectedOrder.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <a href={`tel:${selectedOrder.phone}`} className="text-primary hover:underline">
                          {selectedOrder.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Informations véhicule
                    </h3>
                    <div className="space-y-2 text-sm">
                      {(() => {
                        const info = selectedOrder.vehicleInfo as Record<string, string> | null;
                        if (!info) return <span className="text-muted-foreground">Non renseigné</span>;
                        return (
                          <>
                            {info.plate && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Immatriculation:</span>
                                <span className="font-mono font-medium">{info.plate}</span>
                              </div>
                            )}
                            {info.fiscalPower && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Puissance fiscale:</span>
                                <span>{info.fiscalPower} CV</span>
                              </div>
                            )}
                            {info.region && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Région:</span>
                                <span>{info.region}</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Détails de la commande
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type de démarche:</span>
                        <span>{getDocumentTypeName(selectedOrder.documentType)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frais de service:</span>
                        <span>{selectedOrder.serviceFee ? parseFloat(selectedOrder.serviceFee).toFixed(2) : '0.00'}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes gouvernementales:</span>
                        <span>{selectedOrder.governmentTax ? parseFloat(selectedOrder.governmentTax).toFixed(2) : '0.00'}€</span>
                      </div>
                      {selectedOrder.expressFee && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frais express:</span>
                          <span>{parseFloat(selectedOrder.expressFee).toFixed(2)}€</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total:</span>
                        <span className="text-primary">{parseFloat(selectedOrder.price).toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Crédit gratuit utilisé:</span>
                        <span>{selectedOrder.usedFreeCredit ? 'Oui' : 'Non'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents joints
                  </h3>
                  {selectedOrder.filePaths && selectedOrder.filePaths.length > 0 ? (
                    <div className="space-y-2">
                      {selectedOrder.filePaths.map((path, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <span className="text-sm truncate flex-1">{path.split('/').pop()}</span>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aucun document joint. Contacter le client pour récupérer les pièces.
                    </p>
                  )}
                </div>

                {selectedOrder.notes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="font-semibold">Notes</h3>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Créée le {new Date(selectedOrder.createdAt!).toLocaleString('fr-FR')}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
