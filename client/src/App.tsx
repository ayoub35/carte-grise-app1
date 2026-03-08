import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { CookieConsent } from "@/components/CookieConsent";
import { useAuth } from "@/hooks/useAuth";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Documents from "@/pages/Documents";
import NewDocument from "@/pages/NewDocument";
import Demarches from "@/pages/Demarches";
import DemarchePage from "@/pages/DemarchePage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccess from "@/pages/OrderSuccess";
import AdminDashboard from "@/pages/AdminDashboard";
import Pricing from "@/pages/Pricing";
import Referrals from "@/pages/Referrals";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LegalNotice from "@/pages/LegalNotice";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Cookies from "@/pages/Cookies";
import About from "@/pages/About";
import RegisterPro from "@/pages/RegisterPro";
import RegisterParticulier from "@/pages/RegisterParticulier";
import LoginPro from "@/pages/LoginPro";
import LoginParticulier from "@/pages/LoginParticulier";
import ForgotPassword from "@/pages/ForgotPassword";
import Cerfas from "@/pages/Cerfas";
import EspacePro from "@/pages/EspacePro";
import EspaceParticulier from "@/pages/EspaceParticulier";
import LeadsPage from "@/pages/LeadsPage";
import AdminLogin from "@/pages/AdminLogin";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Landing} />
      {isAuthenticated && (
        <>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/documents" component={Documents} />
          <Route path="/documents/new" component={NewDocument} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/leads" component={LeadsPage} />
        </>
      )}
      <Route path="/register-pro" component={RegisterPro} />
      <Route path="/register" component={RegisterParticulier} />
      <Route path="/login-pro" component={LoginPro} />
      <Route path="/login" component={LoginParticulier} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/espace-pro" component={EspacePro} />
      <Route path="/espace-particulier" component={EspaceParticulier} />
      <Route path="/demarches" component={Demarches} />
      <Route path="/demarche/:id" component={DemarchePage} />
      <Route path="/cerfas" component={Cerfas} />
      <Route path="/checkout/:id" component={CheckoutPage} />
      <Route path="/order/success/:orderNumber" component={OrderSuccess} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/about" component={About} />
      <Route path="/referrals" component={Referrals} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      <Route path="/mentions-legales" component={LegalNotice} />
      <Route path="/cgv" component={Terms} />
      <Route path="/confidentialite" component={Privacy} />
      <Route path="/cookies" component={Cookies} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="fixed top-0 left-0 w-full z-[100] bg-[#F59E0B] text-black text-center text-sm font-semibold py-2 px-4 shadow-md">
          🔒 DEMO MODE — Portfolio demonstration only. No real documents are processed or stored.
        </div>
        <div className="flex flex-col min-h-screen bg-background pt-10 relative">
          {/* Subtle noise texture overlay */}
          <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
          <CookieConsent />
          <WhatsAppButton />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
