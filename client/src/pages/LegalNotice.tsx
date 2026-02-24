import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LegalNotice() {
  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Mentions légales</h1>
          <p className="text-muted-foreground">Informations légales de AutoDossiers</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Responsable du site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-semibold">Raison sociale :</p>
                <p>AutoDossiers (Auto-entrepreneur)</p>
                <p>Également connu sous le nom « Janin Carte Grise ».</p>
              </div>
              <div>
                <p className="font-semibold">Numéro SIRET :</p>
                <p>932 989 734</p>
              </div>
              <div>
                <p className="font-semibold">Adresse :</p>
                <p>68 boulevard Jules-Janin, 42000 Saint-Étienne, France</p>
              </div>
              <div>
                <p className="font-semibold">Téléphone :</p>
                <p>07 61 87 06 68</p>
              </div>
              <div>
                <p className="font-semibold">Email :</p>
                <p>contact@autodossiers.fr</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Directeur de la publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-semibold">Nom et prénom :</p>
                <p>Hakmi Ayoub</p>
              </div>
              <div>
                <p className="font-semibold">Fonction :</p>
                <p>Gérant</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hébergeur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-semibold">Nom de l'hébergeur :</p>
                <p>Railway Corp.</p>
              </div>
              <div>
                <p className="font-semibold">Site web :</p>
                <p>
                  <a href="https://railway.app" className="text-primary hover:underline" target="_blank" rel="noreferrer">
                    www.railway.app
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                L'ensemble du contenu du site AutoDossiers (textes, images, logos, graphismes, etc.) est protégé par les droits d'auteur et
                les droits de propriété intellectuelle. Toute reproduction, représentation, modification, publication, adaptation ou transmission
                de tout ou partie du site est strictement interdite sans l'autorisation préalable écrite de AutoDossiers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation de responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                AutoDossiers s'efforce de maintenir à jour les informations présentées sur son site. Cependant, aucune garantie n'est donnée
                quant à l'exactitude, l'exhaustivité ou la pertinence de ces informations. AutoDossiers ne peut être tenue responsable des
                dommages directs ou indirects résultant de l'utilisation du site.
              </p>
              <p>
                L'utilisateur reconnaît avoir pris connaissance de cet avertissement et l'accepte sans réserve.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modifications</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                AutoDossiers se réserve le droit de modifier le contenu du site à tout moment sans préavis.
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
