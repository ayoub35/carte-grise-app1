import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSubmissionSchema } from "@shared/schema";

const contactFormSchema = insertContactSubmissionSchema.extend({
  status: z.string().default('unread'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      status: "unread",
    },
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    submitContactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">
            Nous contacter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une question ? Une suggestion ? Notre équipe est là pour vous aider
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Email</CardTitle>
              <CardDescription>
                Nous répondons généralement sous 24h
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                <a href="mailto:contact@autodossiers.fr" className="text-primary hover:underline">
                  contact@autodossiers.fr
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Support</CardTitle>
              <CardDescription>
                Du lundi au vendredi, 9h-18h
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notre équipe de support est disponible pour répondre à toutes vos questions
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Envoyez-nous un message</CardTitle>
            <CardDescription>
              Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet *</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean Dupont" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="jean.dupont@exemple.com"
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sujet *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Votre sujet"
                          {...field}
                          data-testid="input-subject"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Votre message..."
                          className="min-h-[150px] resize-none"
                          {...field}
                          data-testid="textarea-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full md:w-auto gap-2"
                  disabled={submitContactMutation.isPending}
                  data-testid="button-submit"
                >
                  {submitContactMutation.isPending ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
