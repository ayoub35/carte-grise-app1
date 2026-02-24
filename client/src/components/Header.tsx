import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, FileText, HelpCircle, LayoutDashboard, Settings, Phone, MessageCircle, Building2, User, LogOut } from "lucide-react";
import logoImage from "@assets/janin-carte-grise-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  companyName?: string;
  siret?: string;
  isAdmin?: boolean;
}

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  const { data: sessionUser } = useQuery<SessionUser>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      setLocation("/");
    },
  });

  const isSessionAuthenticated = !!sessionUser;

  const authenticatedNavLinks = [
    { href: "/documents", label: "Mes Documents", icon: FileText },
  ];

  const publicNavLinks = [
    { href: "/demarches", label: "Démarches" },
    { href: "/cerfas", label: "Cerfas" },
    { href: "/pricing", label: "Tarifs" },
    { href: "/faq", label: "FAQ" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Admin Panel", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href={isAuthenticated ? "/dashboard" : "/"} asChild>
              <div className="flex items-center gap-2 cursor-pointer" data-testid="link-logo">
                <img src={logoImage} alt="AutoDossiers" className="h-10 w-10" />
                <span className="text-xl font-semibold">AutoDossiers</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              {isAuthenticated && (
                <>
                  {authenticatedNavLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location === link.href;
                    return (
                      <Link key={link.href} href={link.href} asChild>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          size="sm"
                          className="gap-2"
                          data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Button>
                      </Link>
                    );
                  })}
                </>
              )}
              {publicNavLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link key={link.href} href={link.href} asChild>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
              {user?.isAdmin && adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;
                return (
                  <Link key={link.href} href={link.href} asChild>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className="gap-2"
                      data-testid="link-nav-admin"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="tel:0761870668" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors" data-testid="link-phone">
              <Phone className="h-4 w-4" />
              <div className="flex flex-col">
                <span>07 61 87 06 68</span>
                <span className="text-xs text-muted-foreground">Appel gratuit</span>
              </div>
            </a>
            <a href="https://wa.me/33761870668" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors" data-testid="link-whatsapp">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isSessionAuthenticated && !isAuthenticated && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="hidden sm:inline-flex gap-2" data-testid="button-connexion-dropdown">
                      <User className="h-4 w-4" />
                      Connexion
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Choisissez votre espace</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="flex items-center gap-2 cursor-pointer" data-testid="link-login-particulier">
                        <User className="h-4 w-4" />
                        Espace Particulier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/login-pro" className="flex items-center gap-2 cursor-pointer" data-testid="link-login-pro">
                        <Building2 className="h-4 w-4" />
                        Espace Professionnel
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Menu Mobile pour tous les utilisateurs */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-menu-mobile">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 mt-8">
                  {isAuthenticated && (
                    <>
                      <div className="pb-4 border-b">
                        <p className="font-semibold mb-3">Mon Compte</p>
                        {authenticatedNavLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link key={link.href} href={link.href} asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start gap-2"
                                data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                <Icon className="h-4 w-4" />
                                {link.label}
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <div className="pb-4 border-b">
                    <p className="font-semibold mb-3 text-foreground">Navigation</p>
                    {publicNavLinks.map((link) => (
                      <Link key={link.href} href={link.href} asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-foreground"
                          data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                  </div>

                  {user?.isAdmin && (
                    <div className="pb-4 border-b">
                      <p className="font-semibold mb-3">Admin</p>
                      {adminLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link key={link.href} href={link.href} asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start gap-2"
                              data-testid="link-mobile-admin"
                            >
                              <Icon className="h-4 w-4" />
                              {link.label}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {isSessionAuthenticated ? (
                    <>
                      <div className="pb-4 border-b">
                        <p className="font-semibold mb-3">Mon Compte</p>
                        <p className="text-sm text-muted-foreground mb-2">{sessionUser?.email}</p>
                        <Link href={sessionUser?.userType === 'professional' ? '/espace-pro' : '/espace-particulier'}>
                          <Button variant="ghost" className="w-full justify-start gap-2" data-testid="link-mobile-espace">
                            {sessionUser?.userType === 'professional' ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
                            Mon Espace
                          </Button>
                        </Link>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => logoutMutation.mutate()}
                        data-testid="button-logout-mobile"
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </Button>
                    </>
                  ) : isAuthenticated ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                      data-testid="button-logout-mobile"
                    >
                      <a href="/api/logout">Déconnexion</a>
                    </Button>
                  ) : (
                    <>
                      <p className="font-semibold mb-3">Connexion</p>
                      <Link href="/login">
                        <Button className="w-full gap-2 mb-2" data-testid="button-login-mobile">
                          <User className="h-4 w-4" />
                          Espace Particulier
                        </Button>
                      </Link>
                      <Link href="/login-pro">
                        <Button variant="outline" className="w-full gap-2" data-testid="button-pro-mobile">
                          <Building2 className="h-4 w-4" />
                          Espace Professionnel
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop User Menu pour utilisateurs authentifiés par session */}
            {isSessionAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hidden md:inline-flex" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {sessionUser?.userType === 'professional' ? (
                          <Building2 className="h-4 w-4" />
                        ) : (
                          sessionUser?.firstName?.[0] || sessionUser?.email?.[0]?.toUpperCase() || "U"
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none" data-testid="text-user-name">
                        {sessionUser?.firstName} {sessionUser?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground" data-testid="text-user-email">
                        {sessionUser?.email}
                      </p>
                      {sessionUser?.companyName && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {sessionUser.companyName}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={sessionUser?.userType === 'professional' ? '/espace-pro' : '/espace-particulier'}
                      className="flex items-center gap-2 cursor-pointer"
                      data-testid="link-mon-espace"
                    >
                      {sessionUser?.userType === 'professional' ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      Mon Espace
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    className="flex items-center gap-2 cursor-pointer"
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Desktop User Menu */}
            {isAuthenticated && !isSessionAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hidden md:inline-flex" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                      <AvatarFallback>{user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none" data-testid="text-user-name">
                        {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground" data-testid="text-user-email">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" data-testid="button-logout">
                      Déconnexion
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
