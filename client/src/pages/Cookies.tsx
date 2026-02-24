import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useCookiePreferences } from "@/hooks/useCookiePreferences";

export default function Cookies() {
  const { preferences, updatePreferences, resetToDefaults } = useCookiePreferences();

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Politique Cookies</h1>
          <p className="text-muted-foreground">Gestion des cookies et technologies de suivi</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Qu'est-ce qu'un cookie ?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Un cookie est un petit fichier texte téléchargé et stocké sur votre navigateur lorsque vous visitez notre site. 
                Les cookies permettent de mémoriser vos préférences et d'améliorer votre expérience utilisateur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Cookies essentiels</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Ces cookies sont nécessaires au fonctionnement du site :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Session :</strong> Maintenir votre connexion</li>
                <li><strong>Sécurité :</strong> Protéger contre les attaques CSRF</li>
                <li><strong>Préférences :</strong> Thème clair/sombre</li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                <strong>Durée :</strong> Supprimés à la fermeture du navigateur (sauf indication contraire)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Cookies analytiques</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Ces cookies permettent de comprendre comment les utilisateurs interagissent avec le site :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Pages visitées :</strong> Quelles pages vous consultez</li>
                <li><strong>Durée :</strong> Temps passé sur le site</li>
                <li><strong>Navigateur :</strong> Type d'appareil utilisé</li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                <strong>Durée :</strong> 13 mois
              </p>
              <p className="mt-2">
                <strong>Status :</strong> Désactivés par défaut - consentement requis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Cookies marketing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Ces cookies permettent de vous proposer des annonces pertinentes :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Google Ads :</strong> Publicités personnalisées</li>
                <li><strong>Retargeting :</strong> Vous revoir après une visite</li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                <strong>Durée :</strong> Jusqu'à 18 mois
              </p>
              <p className="mt-2">
                <strong>Status :</strong> Désactivés par défaut - consentement requis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Tiers impliqués</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Les cookies suivants peuvent être définis par des tiers :
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">Google Analytics</p>
                  <p className="text-xs text-muted-foreground">
                    <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noreferrer">
                      Politique de confidentialité Google
                    </a>
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Stripe (paiements)</p>
                  <p className="text-xs text-muted-foreground">
                    <a href="https://stripe.com/privacy" className="text-primary hover:underline" target="_blank" rel="noreferrer">
                      Politique de confidentialité Stripe
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Gestion de vos préférences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm">
                Contrôlez vos préférences de cookies ci-dessous. Les modifications sont sauvegardées automatiquement.
              </p>
              
              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-muted">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Cookies essentiels</p>
                    <p className="text-xs text-muted-foreground mt-1">Nécessaires au fonctionnement du site (session, sécurité, préférences)</p>
                  </div>
                  <Switch 
                    checked={preferences.essential}
                    onCheckedChange={(checked) => updatePreferences({ essential: checked })}
                    disabled
                    className="ml-4"
                    data-testid="toggle-essential-cookies"
                  />
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-muted">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Cookies analytiques</p>
                    <p className="text-xs text-muted-foreground mt-1">Nous aident à comprendre comment vous utilisez le site</p>
                  </div>
                  <Switch 
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => updatePreferences({ analytics: checked })}
                    className="ml-4"
                    data-testid="toggle-analytics-cookies"
                  />
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-muted">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Cookies marketing</p>
                    <p className="text-xs text-muted-foreground mt-1">Utilisés pour vous proposer des annonces pertinentes</p>
                  </div>
                  <Switch 
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => updatePreferences({ marketing: checked })}
                    className="ml-4"
                    data-testid="toggle-marketing-cookies"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={resetToDefaults}
                  data-testid="button-reset-cookies"
                >
                  Réinitialiser aux paramètres par défaut
                </Button>
                <p className="text-xs text-muted-foreground flex items-center">
                  ℹ️ Vos préférences sont sauvegardées automatiquement
                </p>
              </div>

              <p className="text-xs text-muted-foreground pt-2">
                Vous pouvez aussi contrôler les cookies via :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2 text-xs text-muted-foreground">
                <li><strong>Paramètres du navigateur :</strong> Activer/Désactiver les cookies</li>
                <li><strong>Outils tiers :</strong> <a href="http://www.youronlinechoices.eu" className="text-primary hover:underline" target="_blank" rel="noreferrer">youronlinechoices.eu</a></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Impact du refus de cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Refuser les cookies analytiques et marketing :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>✓ Le site fonctionne complètement</li>
                <li>✓ Pas d'annonces personnalisées</li>
                <li>✗ Nous ne voyons pas comment améliorer le site</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Consentement</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Conformément à la CNIL, AutoDossiers collecte votre consentement explicite avant de déposer des cookies 
                non essentiels. Votre consentement peut être retiré à tout moment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Autres technologies de suivi</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Au-delà des cookies, nous utilisons :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Stockage local :</strong> Préférences utilisateur</li>
                <li><strong>Pixels :</strong> Suivi des conversions</li>
                <li><strong>Adresses IP :</strong> Géolocalisation approximative</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Pour toute question concernant les cookies, contactez-nous :
              </p>
              <p>
                <span className="font-semibold">Email :</span> contact@autodossiers.fr
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
