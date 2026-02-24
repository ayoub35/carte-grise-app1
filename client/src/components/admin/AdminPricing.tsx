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
import { Plus, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPricingSchema } from "@shared/schema";
import type { Pricing, InsertPricing } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

const pricingFormSchema = insertPricingSchema.extend({
  basePrice: z.string().min(1, "Prix requis"),
  professionalPrice: z.string().min(1, "Prix requis"),
});

type PricingFormValues = z.infer<typeof pricingFormSchema>;

export function AdminPricing() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<Pricing | null>(null);

  const { data: pricingList, isLoading } = useQuery<Pricing[]>({
    queryKey: ["/api/admin/pricing"],
  });

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: {
      documentType: "",
      basePrice: "",
      professionalPrice: "",
      description: "",
    },
  });

  const createPricingMutation = useMutation({
    mutationFn: async (data: PricingFormValues) => {
      return await apiRequest("POST", "/api/admin/pricing", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pricing"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pricing"] });
      toast({
        title: "Tarif ajouté",
        description: "Le tarif a été ajouté avec succès",
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

  const updatePricingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PricingFormValues> }) => {
      return await apiRequest("PATCH", `/api/admin/pricing/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pricing"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pricing"] });
      toast({
        title: "Tarif mis à jour",
        description: "Le tarif a été mis à jour avec succès",
      });
      setOpen(false);
      setEditingPricing(null);
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

  const onSubmit = (data: PricingFormValues) => {
    if (editingPricing) {
      updatePricingMutation.mutate({ id: editingPricing.id, data });
    } else {
      createPricingMutation.mutate(data);
    }
  };

  const handleEdit = (pricing: Pricing) => {
    setEditingPricing(pricing);
    form.reset({
      documentType: pricing.documentType,
      basePrice: pricing.basePrice,
      professionalPrice: pricing.professionalPrice,
      description: pricing.description || "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPricing(null);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion des tarifs</CardTitle>
            <CardDescription>
              Configurez les tarifs pour chaque type de document
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-pricing">
                <Plus className="h-4 w-4" />
                Ajouter un tarif
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingPricing ? "Modifier" : "Ajouter"} un tarif</DialogTitle>
                <DialogDescription>
                  Remplissez les champs ci-dessous
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de document</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="carte_grise"
                            {...field}
                            disabled={!!editingPricing}
                            data-testid="input-document-type"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix particulier (€)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="29.00" {...field} data-testid="input-base-price" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="professionalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix professionnel (€)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="19.00" {...field} data-testid="input-professional-price" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description du service..."
                            className="resize-none"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={createPricingMutation.isPending || updatePricingMutation.isPending} data-testid="button-save-pricing">
                      {createPricingMutation.isPending || updatePricingMutation.isPending ? "Enregistrement..." : "Enregistrer"}
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
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : pricingList && pricingList.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type de document</TableHead>
                  <TableHead>Prix particulier</TableHead>
                  <TableHead>Prix professionnel</TableHead>
                  <TableHead>Réduction</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingList.map((pricing: Pricing) => {
                  const discount = Math.round((1 - parseFloat(pricing.professionalPrice) / parseFloat(pricing.basePrice)) * 100);
                  return (
                    <TableRow key={pricing.id} data-testid={`admin-pricing-${pricing.id}`}>
                      <TableCell className="font-medium">{pricing.documentType}</TableCell>
                      <TableCell>{parseFloat(pricing.basePrice).toFixed(2)}€</TableCell>
                      <TableCell>{parseFloat(pricing.professionalPrice).toFixed(2)}€</TableCell>
                      <TableCell className="text-green-600">-{discount}%</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(pricing)}
                          data-testid={`button-edit-${pricing.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun tarif disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
}
