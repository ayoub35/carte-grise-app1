import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">AutoDossiers</h3>
            <p className="text-sm text-muted-foreground">
              Service de gestion administrative pour vos démarches de carte grise en ligne.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Navigation</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Accueil
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                À propos
              </Link>
              <Link href="/demarches" className="text-muted-foreground hover:text-foreground transition-colors">
                Démarches
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Tarifs
              </Link>
              <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Support</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Nous contacter
              </Link>
              <a href="mailto:contact@autodossiers.fr" className="text-muted-foreground hover:text-foreground transition-colors">
                contact@autodossiers.fr
              </a>
              <Link href="/referrals" className="text-muted-foreground hover:text-foreground transition-colors">
                Programme de parrainage
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Légal</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/mentions-legales" className="text-muted-foreground hover:text-foreground transition-colors">
                Mentions légales
              </Link>
              <Link href="/cgv" className="text-muted-foreground hover:text-foreground transition-colors">
                Conditions générales
              </Link>
              <Link href="/confidentialite" className="text-muted-foreground hover:text-foreground transition-colors">
                Confidentialité
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                Politique cookies
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} AutoDossiers. Tous droits réservés.
            </p>
            <p>
              Hébergé par <a href="https://replit.com" className="text-primary hover:underline" target="_blank" rel="noreferrer">Replit</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
