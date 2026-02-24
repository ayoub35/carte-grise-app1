import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Conditions Générales de Vente</h1>
          <p className="text-muted-foreground">CGV AutoDossiers</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Objet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                AutoDossiers propose un service de gestion administrative et de dématérialisation pour les démarches relatives à la 
                carte grise. Les présentes conditions générales de vente régissent les rapports entre AutoDossiers et ses clients.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Statut légal SIV/ANTS</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                <strong>AutoDossiers est un service habilité SIV agrégateur agissant comme intermédiaire auprès de l'ANTS 
                (Agence Nationale des Titres Sécurisés).</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>AutoDossiers agit pour le compte du client auprès des services de l'État</li>
                <li>Les taxes d'immatriculation sont fixées par l'État, non par AutoDossiers</li>
                <li>AutoDossiers facture des frais de service distincts des taxes d'immatriculation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Prestations proposées</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                AutoDossiers met à disposition de ses clients des services en ligne d'assistance pour les démarches administratives 
                liées à la carte grise, incluant :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Changement de titulaire (demarche 2)</li>
                <li>Duplicata de carte grise (demarche 3)</li>
                <li>Immatriculation provisoire (demarche 14)</li>
                <li>Carte W Garage (demarche 14)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Tarification et distinction frais/taxes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                <strong>Frais de service AutoDossiers :</strong> Varient selon la démarche (de 14.90€ à 79.90€ TTC) + 5€ option express 24h
              </p>
              <p>
                <strong>Taxes d'immatriculation :</strong> Fixées par l'État et variants selon la région et le type de véhicule. 
                Ces taxes ne constituent pas un prix de service mais une redevance administrative.
              </p>
              <p>
                Le prix total affiché comprend les frais de service AutoDossiers. Les taxes d'immatriculation sont calculées 
                en sus conformément à la réglementation française.
              </p>
              <p>
                Les tarifs peuvent être modifiés à tout moment. Les modifications n'affecteront que les nouvelles commandes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Modes de paiement</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Le paiement s'effectue en ligne par carte bancaire via la plateforme Stripe. Aucune autre forme de paiement n'est 
                acceptée. Le paiement est sécurisé et chiffré.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Droit de rétractation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Conformément à l'article L. 221-28 du Code de la consommation, le consommateur dispose d'un délai de 14 jours 
                calendaraires à compter de la formation du contrat pour exercer son droit de rétractation.
              </p>
              <p>
                Toutefois, ce droit ne s'applique pas si le service a commencé à être exécuté avant l'expiration du délai de 14 jours 
                et avec l'accord exprès du client.
              </p>
              <p>
                Pour toute demande de rétractation, veuillez contacter AutoDossiers via le formulaire de contact du site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Délais de traitement</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Une fois le paiement confirmé, AutoDossiers s'engage à traiter la demande dans les 24 à 48 heures. Le délai de 
                traitement peut être augmenté selon la complexité du dossier.
              </p>
              <p>
                Les délais de transmission à l'administration (ANTS/DINUM) ne sont pas sous le contrôle de AutoDossiers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Conditions d'utilisation du service</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Le client s'engage à :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Fournir des informations exactes et à jour</li>
                <li>Transmettre les documents nécessaires complets et lisibles</li>
                <li>Respecter la législation en vigueur</li>
              </ul>
              <p className="mt-4">
                AutoDossiers se réserve le droit de suspendre ou d'annuler le service en cas de non-respect de ces conditions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Limitation de responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                AutoDossiers ne peut être tenue responsable de :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Les délais de traitement de l'administration</li>
                <li>Les refus ou modifications de l'administration</li>
                <li>Les erreurs dans les documents fournis par le client</li>
                <li>Les interruptions de service ou dysfonctionnements techniques</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Données personnelles</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Le traitement des données personnelles est effectué conformément à la Politique de confidentialité du site. 
                Veuillez consulter cette dernière pour plus d'informations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Droit applicable et juridiction</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Les présentes conditions générales de vente sont soumises au droit français. En cas de litige, les parties conviennent 
                de rechercher une solution à l'amiable avant toute action en justice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <span className="font-semibold">Email :</span> contact@autodossiers.fr
              </p>
              <p>
                <span className="font-semibold">Téléphone :</span> [Votre numéro]
              </p>
              <p>
                <span className="font-semibold">Formulaire de contact :</span> Disponible sur le site
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
}
