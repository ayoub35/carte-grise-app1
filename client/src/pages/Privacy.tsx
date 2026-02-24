import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Politique de Confidentialité</h1>
          <p className="text-muted-foreground">Gestion de vos données personnelles (RGPD)</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Responsable du traitement</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <div>
                <p className="font-semibold">Entreprise :</p>
                <p>AutoDossiers</p>
              </div>
              <div>
                <p className="font-semibold">Email :</p>
                <p>contact@autodossiers.fr</p>
              </div>
              <div>
                <p className="font-semibold">Adresse :</p>
                <p>68 boulevard Jules-Janin, 42000 Saint-Étienne, France</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Données collectées</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                AutoDossiers collecte les données personnelles suivantes pour traiter votre demande :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Données d'identité :</strong> Nom, prénom, email, téléphone</li>
                <li><strong>Données véhicule :</strong> Numéro de plaque, type de véhicule, région</li>
                <li><strong>Données de paiement :</strong> Traitées via Stripe (non conservées)</li>
                <li><strong>Données de navigation :</strong> Adresse IP, cookies analytiques</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Base légale du traitement</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Le traitement de vos données personnelles est basé sur :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Exécution du contrat :</strong> Pour effectuer votre demande</li>
                <li><strong>Obligations légales :</strong> Conservation à titre probatoire</li>
                <li><strong>Consentement :</strong> Pour la communication marketing (optionnel)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Durée de conservation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Vos données personnelles sont conservées pour la durée suivante :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Données contractuelles : 5 ans après la fin du service</li>
                <li>Données de paiement : Non conservées (Stripe)</li>
                <li>Cookies : Jusqu'à 13 mois</li>
                <li>Demandes de contact : 1 an après traitement</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Destinataires des données</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Vos données sont transmises à :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>L'administration française (ANTS/DINUM) pour traiter votre demande</li>
                <li>Stripe pour le traitement des paiements</li>
                <li>Les prestataires techniques (hébergement, email)</li>
              </ul>
              <p className="mt-4">
                Aucune transmission à des tiers non autorisés n'a lieu.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Transferts internationaux</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Les données peuvent être transférées vers des serveurs situés en dehors de l'UE (notamment via Stripe).
                Ces transferts sont effectués conformément aux dispositions du RGPD.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Vos droits</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Accès :</strong> Consulter vos données</li>
                <li><strong>Rectification :</strong> Corriger des données inexactes</li>
                <li><strong>Suppression :</strong> Demander l'effacement de vos données</li>
                <li><strong>Limitation :</strong> Limiter le traitement de vos données</li>
                <li><strong>Portabilité :</strong> Récupérer vos données dans un format standard</li>
                <li><strong>Opposition :</strong> Refuser le traitement de vos données</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous via contact@autodossiers.fr
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Sécurité des données</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                AutoDossiers met en place les mesures techniques et organisationnelles appropriées pour protéger vos données :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Chiffrement SSL/TLS</li>
                <li>Authentification sécurisée</li>
                <li>Contrôle d'accès restreint</li>
                <li>Sauvegarde régulière</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Notre site utilise des cookies pour :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Essentiels :</strong> Fonctionnement du site</li>
                <li><strong>Analytiques :</strong> Comprendre l'utilisation du site</li>
                <li><strong>Marketing :</strong> Afficher des annonces ciblées (si activé)</li>
              </ul>
              <p className="mt-4">
                Vous pouvez refuser les cookies non essentiels via les paramètres de votre navigateur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Réclamation CNIL</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de la CNIL :
              </p>
              <p className="font-semibold">Commission Nationale de l'Informatique et des Libertés (CNIL)</p>
              <p>3 Place de Fontenoy, 75007 Paris</p>
              <p>
                <a href="https://www.cnil.fr" className="text-primary hover:underline" target="_blank" rel="noreferrer">
                  www.cnil.fr
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Modifications de cette politique</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                Cette politique peut être modifiée à tout moment. Les modifications seront notifiées sur cette page.
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
