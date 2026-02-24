import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Copy, Mail } from "lucide-react";
import type { Lead } from "@shared/schema";

export default function LeadsPage() {
  const { user, isLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && user) {
      fetchLeads();
    }
  }, [isLoading, user]);

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/admin/leads");
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les leads",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (response.ok) {
        setLeads(leads.filter((lead) => lead.id !== id));
        toast({
          title: "Succès",
          description: "Lead supprimé",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le lead",
        variant: "destructive",
      });
    }
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(phone);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBulkCopy = () => {
    const phoneList = leads.map((l) => `${l.name}: ${l.phone}`).join("\n");
    navigator.clipboard.writeText(phoneList);
    toast({
      title: "Copié!",
      description: `${leads.length} numéros copiés`,
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Gestion des Leads</h1>
          <p className="text-lg text-muted-foreground">
            {leads.length} lead{leads.length !== 1 ? "s" : ""} capturé{leads.length !== 1 ? "s" : ""}
          </p>
        </div>

        {leads.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Actions rapides</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Button onClick={handleBulkCopy} className="gap-2" data-testid="button-copy-all">
                <Copy className="h-4 w-4" />
                Copier tous les numéros
              </Button>
            </CardContent>
          </Card>
        )}

        {isLoadingLeads ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Chargement...</p>
            </CardContent>
          </Card>
        ) : leads.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Aucun lead pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <Card key={lead.id} className="hover-elevate">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg">{lead.name}</div>
                      <div className="text-muted-foreground text-sm">{lead.demarcheName}</div>
                      <div className="text-sm text-primary font-mono mt-2 flex items-center gap-2">
                        <span>{lead.phone}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyPhone(lead.phone)}
                          data-testid={`button-copy-${lead.id}`}
                          className="h-6 px-2"
                        >
                          {copiedId === lead.phone ? "✓" : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleString("fr-FR") : "N/A"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        data-testid={`button-whatsapp-${lead.id}`}
                      >
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=Bonjour ${lead.name}, nous avons reçu votre demande`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(lead.id)}
                        data-testid={`button-delete-${lead.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
