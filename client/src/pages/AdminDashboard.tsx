import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, CreditCard, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { useState } from "react";
import type { Order } from "@shared/schema";

interface StatsResponse {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  totalRevenue: string;
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "En attente",
  succeeded: "Payé",
  failed: "Échoué",
};

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("orders");

  const { data: stats, isLoading: statsLoading } = useQuery<StatsResponse>({
    queryKey: ['/api/admin/stats'],
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/admin/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
    },
  });

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Tableau de bord Admin</h1>
          <p className="text-muted-foreground">Gérez les commandes et suivez les statistiques</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">Commandes totales</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-orders">
                {statsLoading ? "..." : stats?.totalOrders || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">Commandes aujourd'hui</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-today-orders">
                {statsLoading ? "..." : stats?.todayOrders || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600" data-testid="text-pending-orders">
                {statsLoading ? "..." : stats?.pendingOrders || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="text-revenue">
                {statsLoading ? "..." : `${stats?.totalRevenue || 0}€`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>Gérez et mettez à jour le statut des commandes</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">N° Commande</th>
                      <th className="text-left py-3 px-2 font-medium">Client</th>
                      <th className="text-left py-3 px-2 font-medium">Type</th>
                      <th className="text-left py-3 px-2 font-medium">Prix</th>
                      <th className="text-left py-3 px-2 font-medium">Paiement</th>
                      <th className="text-left py-3 px-2 font-medium">Statut</th>
                      <th className="text-left py-3 px-2 font-medium">Date</th>
                      <th className="text-left py-3 px-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-muted/50" data-testid={`row-order-${order.id}`}>
                        <td className="py-3 px-2 font-mono text-sm">{order.orderNumber}</td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{order.firstName} {order.lastName}</p>
                            <p className="text-sm text-muted-foreground">{order.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm">{order.documentType}</td>
                        <td className="py-3 px-2 font-medium">{order.price}€</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={order.paymentStatus === 'succeeded' ? 'text-green-600' : 'text-amber-600'}>
                            {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderMutation.mutate({ id: order.id, status: value })}
                          >
                            <SelectTrigger className="w-32" data-testid={`select-status-${order.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="in_progress">En cours</SelectItem>
                              <SelectItem value="completed">Terminé</SelectItem>
                              <SelectItem value="cancelled">Annulé</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune commande pour le moment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
