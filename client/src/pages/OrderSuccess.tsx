import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Clock, Download, CreditCard, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getPricingForDemarche } from "@/data/pricingTable";

interface OrderTrackResponse {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  documentType: string;
  price: string;
  createdAt: string | null;
}

export default function OrderSuccess() {
  const [, params] = useRoute("/order/success/:orderNumber");
  const [, setLocation] = useLocation();
  const orderNumber = params?.orderNumber;
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    if (payment === 'success') {
      setPaymentMessage('Paiement effectué avec succès!');
    } else if (payment === 'cancelled') {
      setPaymentMessage('Paiement annulé. Vous pouvez réessayer.');
    }
  }, []);

  const { data: order, isLoading, refetch } = useQuery<OrderTrackResponse>({
    queryKey: [`/api/orders/track/${orderNumber}`],
    enabled: !!orderNumber,
    refetchInterval: paymentMessage === 'Paiement effectué avec succès!' ? 3000 : false,
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/orders/${orderNumber}/checkout`);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du paiement",
        variant: "destructive",
      });
    },
  });

  const isPaid = order?.paymentStatus === 'succeeded';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            isPaid 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : 'bg-amber-100 dark:bg-amber-900/30'
          }`}>
            {isPaid ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <Clock className="h-8 w-8 text-amber-600" />
            )}
          </div>
          <h1 className="text-3xl font-semibold">
            {isPaid ? 'Paiement confirmé!' : 'Commande enregistrée'}
          </h1>
          {isPaid && (
            <div className="space-y-3">
              <p className="text-lg font-medium text-green-700 dark:text-green-400">
                Votre demande a bien été prise en charge.
              </p>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Vous serez contactés par mail sous 48 heures. N'oubliez pas de vérifier vos spams.
              </p>
            </div>
          )}
          {!isPaid && (
            <p className="text-muted-foreground">
              Finalisez votre commande en procédant au paiement.
            </p>
          )}
          {paymentMessage && (
            <p className={`text-sm font-medium ${
              paymentMessage.includes('succès') ? 'text-green-600' : 'text-amber-600'
            }`}>
              {paymentMessage}
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Détails de la commande
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Numéro de commande</span>
              <span className="font-mono font-semibold text-lg" data-testid="text-order-number">
                {orderNumber}
              </span>
            </div>

            {order && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Type de démarche</span>
                  <span>{order.documentType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Prix total</span>
                  <span className="font-semibold text-lg">{order.price}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Statut du paiement</span>
                  <span className={`flex items-center gap-2 font-medium ${
                    isPaid ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {isPaid ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Payé
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4" />
                        En attente
                      </>
                    )}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <CardContent className="pt-6 space-y-2 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              Service habilité SIV - Ministère de l'Intérieur
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              AutoDossiers est intermédiaire agrégateur auprès de l'ANTS. 
              {order ? (() => {
                const serviceFee = getPricingForDemarche(order.documentType) || 30;
                return `Frais service : ${serviceFee.toFixed(2)}€ TTC (hors taxes immatriculation fixées par l'État).`;
              })() : 'Frais service appliqués selon la démarche.'}
            </p>
          </CardContent>
        </Card>

        {!isPaid && (
          <>
            {/* Paiement par carte via Stripe (inchangé) */}
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CreditCard className="h-5 w-5" />
                  Procéder au paiement par carte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Cliquez sur le bouton ci-dessous pour finaliser votre commande via notre paiement sécurisé par Stripe.
                </p>
                <Button 
                  size="lg" 
                  className="w-full gap-2"
                  onClick={() => checkoutMutation.mutate()}
                  disabled={checkoutMutation.isPending}
                  data-testid="button-checkout"
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirection...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Payer {order?.price}€
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 🧾 Paiement par virement bancaire */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payer par virement bancaire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Vous pouvez également régler votre commande par virement bancaire. 
                  Merci d&apos;utiliser les informations ci-dessous.
                </p>

                <div className="bg-muted rounded-lg p-4 text-sm space-y-1">
                  <p><strong>Titulaire :</strong> VOTRE NOM / SOCIÉTÉ</p>
                  <p><strong>IBAN :</strong> FR.. .. .. .. .. .. .. ..</p>
                  <p><strong>BIC :</strong> XXXXXXXX</p>
                  <p><strong>Montant :</strong> {order?.price}€</p>
                  <p>
                    <strong>Référence du virement :</strong>{" "}
                    {order?.orderNumber ?? orderNumber}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  Votre commande restera en statut <strong>En attente</strong> 
                  jusqu&apos;à réception de votre virement sur notre compte. 
                  Le traitement peut prendre 24 à 72 heures selon les banques.
                </p>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                isPaid ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground'
              }`}>
                {isPaid ? <CheckCircle className="h-4 w-4" /> : '1'}
              </div>
              <div>
                <p className="font-medium">Procédez au paiement</p>
                <p className="text-sm text-muted-foreground">
                  {isPaid ? 'Paiement reçu' : 'Finalisez votre commande en effectuant le paiement sécurisé'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                isPaid && order?.status === 'processing' ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>2</div>
              <div>
                <p className="font-medium">Traitement de votre dossier</p>
                <p className="text-sm text-muted-foreground">Notre équipe vérifie vos documents sous 24-48h</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">3</div>
              <div>
                <p className="font-medium">Réception de votre document</p>
                <p className="text-sm text-muted-foreground">Vous recevez votre document par courrier ou email</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          {isPaid && (
            <Button 
              size="lg" 
              className="flex-1 gap-2"
              asChild
              data-testid="button-download-invoice"
            >
              <a href={`/api/orders/${orderNumber}/invoice`} download>
                <Download className="h-4 w-4" />
                Télécharger la facture
              </a>
            </Button>
          )}
          <Button 
            size="lg" 
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => setLocation("/")}
            data-testid="button-back-home"
          >
            Retour à l'accueil
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Conservez votre numéro de commande <strong>{orderNumber}</strong> pour suivre l'avancement de votre dossier.
        </p>
      </div>
    </div>
  );
}
