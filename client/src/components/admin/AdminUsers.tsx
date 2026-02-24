import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function AdminUsers() {
  const { toast } = useToast();
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ id, isAdmin }: { id: string; isAdmin: boolean }) => {
      return await apiRequest("PATCH", `/api/admin/users/${id}`, { isAdmin });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Rôle mis à jour",
        description: "Le rôle de l'utilisateur a été mis à jour",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des utilisateurs</CardTitle>
        <CardDescription>
          Gérez tous les utilisateurs de la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Code parrainage</TableHead>
                  <TableHead>Date création</TableHead>
                  <TableHead>Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} data-testid={`admin-user-${user.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email?.split('@')[0]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.userType === 'professional' ? 'default' : 'secondary'}>
                        {user.userType === 'professional' ? 'Professionnel' : 'Particulier'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{user.referralCode || '-'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt!).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.isAdmin}
                        onCheckedChange={(isAdmin) => 
                          toggleAdminMutation.mutate({ id: user.id, isAdmin })
                        }
                        disabled={toggleAdminMutation.isPending}
                        data-testid={`switch-admin-${user.id}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun utilisateur disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
}
