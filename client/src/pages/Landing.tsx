import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Shield, Users, CheckCircle, ArrowRight, Star, Building2, Zap, HeadphonesIcon } from "lucide-react";
import carteGriseImage from "@assets/c49addd6-5fa2-4f8b-b9d3-adc75283d153_1765222615195.webp";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden bg-background">

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              {/* Trust badges */}
              <div className="flex items-center gap-4 justify-center lg:justify-start animate-fade-in-up">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
                  <Building2 className="h-4 w-4 text-primary" />
                  Habilitation Ministère de l'Intérieur
                </span>
                <span className="flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
                  <CheckCircle className="h-4 w-4" />
                  98% satisfaction
                </span>
              </div>

              {/* Hero title with gradient */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight animate-fade-in-up delay-100">
                Faites votre{" "}
                <span className="text-primary font-bold">carte grise</span>
                {" "}en quelques clics
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-200">
                Plateforme d'immatriculation depuis 2022. Service habilité par l'État pour simplifier vos démarches en ligne.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-fade-in-up delay-300">
                <Button size="lg" variant="outline" asChild className="rounded-full gap-2 min-w-[180px] group transition-all duration-300 hover:shadow-md" data-testid="button-cta-particulier">
                  <a href="/demarches">
                    Voir les démarches
                  </a>
                </Button>
                <Button size="lg" asChild className="rounded-full gap-2 min-w-[200px] btn-gradient" data-testid="button-cta-commander">
                  <a href="/demarches">
                    Commander carte grise
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground animate-fade-in-up delay-400">
                Les professionnels bénéficient de <span className="text-primary font-semibold">-35%</span> sur les frais de service
              </p>
            </div>

            {/* Hero image - The "Star of the Show" */}
            <div className="flex justify-center lg:justify-end animate-fade-in-up delay-300 relative">
              <div className="relative group w-full max-w-md">
                {/* Main Card */}
                <div className="relative z-10 hover-animate-spin-y cursor-pointer">
                  <div className="relative p-2 rounded-3xl overflow-hidden border border-border bg-card shadow-lg">
                    <img 
                      src={carteGriseImage} 
                      alt="Certificat d'immatriculation - Carte grise française" 
                      className="rounded-2xl w-full object-cover"
                      data-testid="img-carte-grise-hero"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEPARATOR ═══ */}
      <div className="section-gradient-border" />

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi choisir <span className="text-primary font-bold">AutoDossiers</span> ?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Une plateforme complète pour vos démarches d'immatriculation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Rapide et efficace",
                description: "Soumettez vos documents en quelques minutes et suivez leur progression en temps réel.",
                delay: "delay-100",
              },
              {
                icon: Shield,
                title: "100% sécurisé",
                description: "Vos données et documents sont protégés avec les plus hauts standards de sécurité.",
                delay: "delay-200",
              },
              {
                icon: FileText,
                title: "Suivi transparent",
                description: "Visualisez l'état de toutes vos démarches depuis votre tableau de bord personnalisé.",
                delay: "delay-300",
              },
              {
                icon: Users,
                title: "Tarifs professionnels",
                description: "Bénéficiez de tarifs avantageux pour les garages et concessionnaires.",
                delay: "delay-400",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx} className={`card-premium bg-card animate-fade-in-up ${item.delay}`}>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ SEPARATOR ═══ */}
      <div className="section-gradient-border" />

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-in-up">
            Ils nous font <span className="text-primary font-bold">confiance</span>
          </h2>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { value: "12 500+", label: "Démarches traitées avec succès" },
              { value: "9.8/10", label: "Taux de satisfaction client" },
              { value: "2+ ans", label: "D'expertise SIV accrédité" },
            ].map((stat, idx) => (
              <div key={idx} className={`text-center space-y-3 animate-fade-in-up delay-${(idx + 1) * 100}`}>
                <div className="text-5xl md:text-6xl font-bold text-primary font-bold tracking-tight">{stat.value}</div>
                <p className="text-muted-foreground text-lg">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Maria",
                    role: "Particulier",
                    text: "Accueil au top, avec un service efficace. Je recommande fortement !",
                    rating: 5,
                  },
                  {
                    name: "Jean P.",
                    role: "Garage",
                    text: "Traitement ultra-rapide. Équipe réactive et professionnelle !",
                    rating: 5,
                  },
                  {
                    name: "Sophie D.",
                    role: "Particulier",
                    text: "Parfait ! Démarche complète en 2 jours. Merci !",
                    rating: 5,
                  },
                ].map((testimonial, idx) => (
                  <Card key={idx} className={`card-premium animate-fade-in-up delay-${(idx + 1) * 100}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <CardTitle className="text-base">{testimonial.name}</CardTitle>
                          <CardDescription className="text-xs">{testimonial.role}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground italic text-sm leading-relaxed">"{testimonial.text}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Long reviews */}
            {[
              {
                name: "CLAUDIA NEGRIT",
                role: "Particulier",
                text: "Service rapide et personnels très accueillants. Je vous remercie pour votre rapidité et votre efficacité. L'équipe AutoDossiers est vraiment à l'écoute de vos préoccupations. Nickel !",
                rating: 5,
              },
              {
                name: "Cororton Pauline",
                role: "Garage Pauline Auto",
                text: "Très professionnel, j'ai fait ma carte grise chez eux et elle a été faite super rapidement grâce aux personnels. Je vous remercie beaucoup ! Nous travaillons en partenariat depuis 18 mois et c'est un vrai gain de temps pour nos clients.",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className={`card-premium animate-fade-in-up delay-${(idx + 4) * 100}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic leading-relaxed">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Google My Business */}
          <div className="mt-16 pt-8">
            <div className="section-gradient-border mb-8" />
            <div className="text-center mb-8 animate-fade-in-up">
              <h3 className="text-2xl font-bold mb-2">Retrouvez-nous sur Google</h3>
              <p className="text-muted-foreground">Lisez les avis de nos clients sur Google My Business</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-100">
              <Button size="lg" variant="outline" asChild className="gap-2 transition-all duration-300 hover:shadow-md" data-testid="button-google-reviews">
                <a href="https://www.google.com/maps/place/Carte+grise+immatriculation+auto+moto+et+permis+de+conduire+Saint-%C3%89tienne/@45.4447975,4.3975567,17z/data=!3m1!4b1!4m6!3m5!1s0x47f5abff252f3833:0xb5bfce17dc34d256!8m2!3d45.4447975!4d4.3975567!16s%2Fg%2F11gy19hlmk?authuser=0&hl=es&entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 21.6c-5.3 0-9.6-4.3-9.6-9.6S6.7 2.4 12 2.4s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6z" />
                  </svg>
                  Voir nos avis Google
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 transition-all duration-300 hover:shadow-md" data-testid="button-leave-review">
                <a href="https://www.google.com/maps/place/Carte+grise+immatriculation+auto+moto+et+permis+de+conduire+Saint-%C3%89tienne/@45.4447975,4.3975567,17z/data=!3m1!4b1!4m6!3m5!1s0x47f5abff252f3833:0xb5bfce17dc34d256!8m2!3d45.4447975!4d4.3975567!16s%2Fg%2F11gy19hlmk?authuser=0&hl=es&entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                  Laisser un avis
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEPARATOR ═══ */}
      <div className="section-gradient-border" />

      {/* ═══ PRICING PREVIEW ═══ */}
      <section id="pricing" className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tarifs <span className="text-primary font-bold">transparents</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Des prix clairs et compétitifs sans frais cachés.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Particuliers */}
            <Card className="card-premium relative overflow-hidden h-full flex flex-col animate-fade-in-up delay-100">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Particuliers</CardTitle>
                <div className="mt-4">
                  <span className="text-muted-foreground text-sm">À partir de</span>
                  <div>
                    <span className="text-5xl font-bold text-foreground">14.90€</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <ul className="space-y-3 flex-1">
                  {[
                    "Soumission illimitée de documents",
                    "Suivi en temps réel",
                    "Support par email",
                    "Paiement sécurisé",
                    "Facture automatique",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 rounded-full btn-gradient" asChild data-testid="button-individual-cta">
                  <a href="/register">S'inscrire en tant que particulier</a>
                </Button>
              </CardContent>
            </Card>

            {/* Professionnels */}
            <Card className="card-premium relative overflow-hidden h-full flex flex-col animate-fade-in-up delay-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
              <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Jusqu'à -25%
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Professionnels</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Garages, concessionnaires & loueurs</p>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-amber-500">-25%</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <ul className="space-y-3 flex-1">
                  {[
                    "Tous les avantages Particuliers",
                    "Tarifs préférentiels (-30%)",
                    "Gestion multi-véhicules",
                    "Support prioritaire",
                    "Espace dédié pour les professionnels",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 rounded-full btn-gradient" asChild data-testid="button-professional-cta">
                  <a href="/register-pro">S'inscrire en tant que pro</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══ SEPARATOR ═══ */}
      <div className="section-gradient-border" />

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 px-4 relative overflow-hidden bg-muted/20">
        <div className="relative z-10 mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold animate-fade-in-up">
            Prêt à simplifier vos <span className="text-primary font-bold">démarches</span> ?
          </h2>
          <p className="text-xl text-muted-foreground animate-fade-in-up delay-100">
            Rejoignez des centaines de particuliers et professionnels qui nous font confiance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
            <Button size="lg" asChild className="rounded-full gap-2 btn-gradient" data-testid="button-footer-particulier">
              <a href="/register">
                Particulier
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full gap-2 transition-all duration-300 hover:shadow-md" data-testid="button-footer-pro">
              <a href="/register-pro">
                Professionnel (jusqu'à -25%)
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
