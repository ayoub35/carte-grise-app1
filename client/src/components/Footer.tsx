import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="relative border-t-0 bg-muted/10">
      {/* Gradient top border */}
      <div className="h-[2px] w-full bg-border" />

      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-primary font-bold">AutoDossiers</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Service de gestion administrative pour vos démarches de carte grise en ligne. Habilité par le Ministère de l'Intérieur.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground/80">Navigation</h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              {[
                { href: "/", label: "Accueil" },
                { href: "/about", label: "À propos" },
                { href: "/demarches", label: "Démarches" },
                { href: "/pricing", label: "Tarifs" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300 w-fit">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground/80">Support</h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-300 w-fit">
                Nous contacter
              </Link>
              <a href="mailto:contact@autodossiers.fr" className="text-muted-foreground hover:text-primary transition-colors duration-300 w-fit">
                contact@autodossiers.fr
              </a>
              <Link href="/referrals" className="text-muted-foreground hover:text-primary transition-colors duration-300 w-fit">
                Programme de parrainage
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground/80">Légal</h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              {[
                { href: "/mentions-legales", label: "Mentions légales" },
                { href: "/cgv", label: "Conditions générales" },
                { href: "/confidentialite", label: "Confidentialité" },
                { href: "/cookies", label: "Politique cookies" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300 w-fit">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="section-gradient-border mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} AutoDossiers. Tous droits réservés.
          </p>
          <p className="text-xs">
            Service habilité SIV — Ministère de l'Intérieur
          </p>
        </div>
      </div>
    </footer>
  );
}
