import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check, Users, Gift, TrendingUp, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Referral } from "@shared/schema";

export default function Referrals() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

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

  const { data: referrals, isLoading } = useQuery<Referral[]>({
    queryKey: ["/api/referrals"],
    enabled: isAuthenticated,
  });

  const inviteByEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      return await apiRequest("POST", "/api/referrals/invite", { email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/referrals"] });
      toast({
        title: "Invitation envoyée",
        description: "L'invitation a été envoyée avec succès.",
      });
      setEmail("");
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
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

  const referralCode = user?.referralCode || "";
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Copié !",
      description: "Le lien a été copié dans le presse-papier",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const inviteStats = {
    total: referrals?.length || 0,
    registered: referrals?.filter(r => r.status === 'registered' || r.status === 'completed').length || 0,
    rewards: referrals?.reduce((sum, r) => sum + (r.reward ? parseFloat(r.reward) : 0), 0) || 0,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      registered: { label: "Inscrit", className: "bg-blue-100 text-blue-800 border-blue-200" },
      completed: { label: "Complété", className: "bg-green-100 text-green-800 border-green-200" },
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Programme de parrainage</h1>
          <p className="text-muted-foreground mt-1">
            Invitez vos amis et bénéficiez de récompenses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invitations envoyées</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="stat-total-invites">
                {inviteStats.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total d'invitations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="stat-registered">
                {inviteStats.registered}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Utilisateurs inscrits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Récompenses</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="stat-rewards">
                {inviteStats.rewards.toFixed(2)}€
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total des récompenses
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Votre code de parrainage</CardTitle>
            <CardDescription>
              Partagez ce lien avec vos amis et collègues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="font-mono text-sm"
                data-testid="input-referral-link"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="gap-2 flex-shrink-0"
                data-testid="button-copy-link"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">Comment ça marche ?</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Partagez votre lien de parrainage</li>
                <li>Vos amis s'inscrivent en utilisant votre lien</li>
                <li>Recevez des récompenses pour chaque inscription</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inviter par email</CardTitle>
            <CardDescription>
              Envoyez une invitation directement par email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) {
                  inviteByEmailMutation.mutate(email);
                }
              }}
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-invite-email"
              />
              <Button
                type="submit"
                disabled={inviteByEmailMutation.isPending}
                data-testid="button-send-invite"
              >
                {inviteByEmailMutation.isPending ? "Envoi..." : "Envoyer"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes parrainages</CardTitle>
            <CardDescription>
              Liste de vos invitations et leur statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : referrals && referrals.length > 0 ? (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border"
                    data-testid={`referral-${referral.id}`}
                  >
                    <div>
                      <div className="font-medium">
                        {referral.referredEmail}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Invité le {new Date(referral.createdAt!).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(referral.status)}
                      {referral.reward && (
                        <span className="font-medium text-green-600">
                          +{parseFloat(referral.reward).toFixed(2)}€
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune invitation</h3>
                <p className="text-muted-foreground">
                  Commencez à inviter vos amis pour gagner des récompenses
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
