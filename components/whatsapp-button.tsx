import { MessageCircle } from 'lucide-react';

const whatsappUrl = 'https://wa.me/254112272061?text=Hello!%20I%20would%20like%20a%20freight%20quote%20from%20Gideon%20Fleet%20Solutions.';

export function WhatsAppButton() {
  return (
    <a className="whatsapp-float" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Get a freight quote or track a shipment on WhatsApp">
      <span className="whatsapp-tooltip" role="tooltip">Get a freight quote or track a shipment</span>
      <MessageCircle aria-hidden="true" size={22} strokeWidth={1.9} />
      <span className="sr-only">WhatsApp support: +254 112 272 061</span>
    </a>
  );
}
