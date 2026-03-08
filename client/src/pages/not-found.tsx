import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, FileText } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            
            <div className="space-y-2 text-center">
              <h1 className="text-4xl font-bold">404</h1>
              <h2 className="text-2xl font-semibold">Page introuvable</h2>
              <p className="text-muted-foreground">
                La page que vous cherchez n'existe pas ou n'est plus disponible.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={() => setLocation("/")}
              data-testid="button-home"
            >
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => setLocation("/#demarches")}
              data-testid="button-demarches"
            >
              <FileText className="h-4 w-4" />
              Voir les démarches
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
