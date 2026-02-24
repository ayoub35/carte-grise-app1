import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappNumber = "33761870668";
  const message = "Bonjour, j'ai une question sur une démarche automobile.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all duration-300 hover:scale-110 dark:bg-green-600 dark:hover:bg-green-700"
      data-testid="button-whatsapp-floating"
      aria-label="Contacter par WhatsApp"
      title="Contacter par WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </a>
  );
}
