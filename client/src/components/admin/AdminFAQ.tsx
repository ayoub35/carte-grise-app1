import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFaqSchema } from "@shared/schema";
import type { Faq, InsertFaq } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

const faqFormSchema = insertFaqSchema.extend({
  order: z.coerce.number().default(0),
});

export function AdminFAQ() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  const { data: faqs, isLoading } = useQuery<Faq[]>({
    queryKey: ["/api/admin/faqs"],
  });

  const form = useForm<InsertFaq>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "",
      order: 0,
    },
  });

  const createFaqMutation = useMutation({
    mutationFn: async (data: InsertFaq) => {
      return await apiRequest("POST", "/api/admin/faqs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faqs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({
        title: "FAQ ajoutée",
        description: "La question a été ajoutée avec succès",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateFaqMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertFaq> }) => {
      return await apiRequest("PATCH", `/api/admin/faqs/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faqs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({
        title: "FAQ mise à jour",
        description: "La question a été mise à jour avec succès",
      });
      setOpen(false);
      setEditingFaq(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/faqs/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faqs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({
        title: "FAQ supprimée",
        description: "La question a été supprimée avec succès",
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

  const onSubmit = (data: InsertFaq) => {
    if (editingFaq) {
      updateFaqMutation.mutate({ id: editingFaq.id, data });
    } else {
      createFaqMutation.mutate(data);
    }
  };

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq);
    form.reset({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFaq(null);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion de la FAQ</CardTitle>
            <CardDescription>
              Ajoutez et gérez les questions fréquemment posées
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-faq">
                <Plus className="h-4 w-4" />
                Ajouter une question
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingFaq ? "Modifier" : "Ajouter"} une question</DialogTitle>
                <DialogDescription>
                  Remplissez les champs ci-dessous
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <FormControl>
                          <Input placeholder="Général" {...field} data-testid="input-category" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input placeholder="Quelle est la question?" {...field} data-testid="input-question" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Réponse</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Votre réponse détaillée..."
                            className="min-h-[120px] resize-none"
                            {...field}
                            data-testid="textarea-answer"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordre</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} data-testid="input-order" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={createFaqMutation.isPending || updateFaqMutation.isPending} data-testid="button-save-faq">
                      {createFaqMutation.isPending || updateFaqMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : faqs && faqs.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Ordre</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id} data-testid={`admin-faq-${faq.id}`}>
                    <TableCell className="capitalize">{faq.category}</TableCell>
                    <TableCell className="max-w-md truncate">{faq.question}</TableCell>
                    <TableCell>{faq.order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(faq)}
                          data-testid={`button-edit-${faq.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
                              deleteFaqMutation.mutate(faq.id);
                            }
                          }}
                          disabled={deleteFaqMutation.isPending}
                          data-testid={`button-delete-${faq.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucune question disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
}
