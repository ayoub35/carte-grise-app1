import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Users, DollarSign, MessageSquare, HelpCircle, Tag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Order, User, Payment, ContactSubmission, Faq, Pricing } from "@shared/schema";
import { AdminUsers } from "../components/admin/AdminUsers";
import { AdminOrders } from "../components/admin/AdminOrders";
import { AdminPayments } from "../components/admin/AdminPayments";
import { AdminContact } from "../components/admin/AdminContact";
import { AdminFAQ } from "../components/admin/AdminFAQ";
import { AdminPricing } from "../components/admin/AdminPricing";

export default function Admin() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires. Redirection...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [isAuthenticated, authLoading, user, toast]);

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: contactSubmissions } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  const stats = {
    totalOrders: orders?.length || 0,
    pendingOrders: orders?.filter(o => o.status === 'pending').length || 0,
    totalUsers: users?.length || 0,
    professionalUsers: users?.filter(u => u.userType === 'professional').length || 0,
    totalRevenue: orders?.filter(o => o.paymentStatus === 'succeeded')?.reduce((sum, o) => sum + parseFloat(o.price), 0) || 0,
    unreadMessages: contactSubmissions?.filter(c => c.status === 'unread').length || 0,
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Panel Administrateur</h1>
          <p className="text-muted-foreground mt-1">
            Gérez tous les aspects de la plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demandes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="stat-admin-orders">
                {stats.totalOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingOrders} en attente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="stat-admin-users">
                {stats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.professionalUsers} professionnels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="stat-admin-revenue">
                {stats.totalRevenue.toFixed(2)}€
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total des paiements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="stat-admin-messages">
                {stats.unreadMessages}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Non lus
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="documents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="documents" className="gap-2" data-testid="tab-documents">
              <FileText className="h-4 w-4" />
              Demandes
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2" data-testid="tab-users">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2" data-testid="tab-payments">
              <DollarSign className="h-4 w-4" />
              Paiements
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2" data-testid="tab-contact">
              <MessageSquare className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2" data-testid="tab-faq">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2" data-testid="tab-pricing">
              <Tag className="h-4 w-4" />
              Tarifs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <AdminOrders />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <AdminPayments />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <AdminContact />
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <AdminFAQ />
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <AdminPricing />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
