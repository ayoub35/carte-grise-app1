import { Card, CardContent } from "@/components/ui/card";
import { Check, MapPin, Award, Users } from "lucide-react";
import saintEtienneImage from "@assets/image_1765233823860.png";
import partnersImage from "@assets/generated_images/modern_automotive_services_counter.png";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-6xl animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">À propos de <span className="text-primary font-bold">AutoDossiers</span></h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Plus de 35 ans d'expertise dans l'automobile. Un service habilité et agréé par le Ministère de l'Intérieur.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 space-y-16">
        {/* Expertise Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Notre expertise</h2>
            <p className="text-muted-foreground text-lg">
              AutoDossiers est le résultat de plus de 35 années d'expérience dans le secteur automobile.
              Depuis 2015, nous nous spécialisons dans l'immatriculation de véhicules avec plus de 9 ans d'expertise dédiée.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="card-premium animate-fade-in-up delay-100">
              <CardContent className="pt-6">
                <div className="text-5xl font-bold text-primary font-bold mb-2">35+</div>
                <p className="text-muted-foreground">Ans d'expérience dans l'automobile</p>
              </CardContent>
            </Card>
            <Card className="card-premium animate-fade-in-up delay-200">
              <CardContent className="pt-6">
                <div className="text-5xl font-bold text-primary font-bold mb-2">9+</div>
                <p className="text-muted-foreground">Ans d'expertise en immatriculation</p>
              </CardContent>
            </Card>
            <Card className="card-premium animate-fade-in-up delay-300">
              <CardContent className="pt-6">
                <div className="text-5xl font-bold text-primary font-bold mb-2">+15K</div>
                <p className="text-muted-foreground">Démarches réussies</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Accreditations Section */}
        <section className="space-y-6 py-8 px-6 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-semibold">Agréments et Habilitations</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Habilité SIV</h3>
                <p className="text-sm text-muted-foreground">Agréé par le Ministère de l'Intérieur pour les démarches d'immatriculation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Intermédiaire ANTS</h3>
                <p className="text-sm text-muted-foreground">Partenaire officiel de l'Agence Nationale des Titres Sécurisés</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Conformité RGPD</h3>
                <p className="text-sm text-muted-foreground">Respect complet de la protection des données personnelles</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Service Sécurisé</h3>
                <p className="text-sm text-muted-foreground">Paiements 100% sécurisés via Stripe</p>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold">Nos bureaux</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Des bureaux professionnels à Saint-Étienne pour un service de proximité et de confiance.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img src={saintEtienneImage} alt="Bureau AutoDossiers Saint-Étienne" className="w-full h-48 object-cover mb-4" />
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Saint-Étienne</h3>
                  <p className="text-sm text-muted-foreground">
                    Notre siège social situé à Saint-Étienne, Loire.
                    Consultations sur rendez-vous pour vos démarches d'immatriculation.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img src={partnersImage} alt="Partenaires garages AutoDossiers" className="w-full h-48 object-cover mb-4" />
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Partenaires locaux</h3>
                  <p className="text-sm text-muted-foreground">
                    Réseau de garages partenaires pour l'inspection et les contrôles techniques
                    nécessaires à vos démarches.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-8 py-8 bg-muted/30 rounded-lg p-8">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-semibold">Notre équipe</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Une équipe de professionnels de l'automobile dédiée à simplifier vos démarches d'immatriculation.
            Disponibles pour répondre à vos questions et vous guider tout au long de votre démarche.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold">Expertise reconnue</h3>
                <p className="text-sm text-muted-foreground">35 ans d'expérience dans le secteur automobile</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold">Service réactif</h3>
                <p className="text-sm text-muted-foreground">Réponse rapide à vos questions et demandes</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold">Transparence garantie</h3>
                <p className="text-sm text-muted-foreground">Tarification claire et sans frais cachés</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-semibold">Suivi complet</h3>
                <p className="text-sm text-muted-foreground">Suivi de votre dossier du début à la fin</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-2xl p-12 text-center space-y-6 animate-fade-in-up">
          <div className="absolute inset-0 bg-background" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold">Prêt à simplifier votre <span className="text-primary font-bold">démarche</span> ?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
              Consultez notre sélection de démarches ou contactez-nous pour toute question.
            </p>
            <div className="flex gap-4 justify-center pt-6">
              <a href="/demarches" className="btn-gradient inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold" data-testid="button-view-demarches">
                Voir les démarches
              </a>
              <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-primary/30 text-primary rounded-lg font-semibold hover:bg-primary/5 transition-all duration-300 hover:shadow-md" data-testid="button-contact">
                Nous contacter
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
