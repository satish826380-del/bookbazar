import { MessageCircle } from 'lucide-react';

export const WhatsAppHelp = () => {
    const phone = "918263805441";
    const message = "Hi, I want to buy a book from your website";
    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[9999] group"
            aria-label="Chat on WhatsApp"
        >
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-[#25D366] rounded-full blur opacity-40 group-hover:opacity-100 transition duration-300"></div>

                {/* Main button */}
                <div className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110 active:scale-95">
                    <MessageCircle className="w-8 h-8 fill-current" />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-4 px-3 py-2 bg-black/80 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none translate-y-2 group-hover:translate-y-0">
                    Need help? Chat with us!
                    <div className="absolute top-full right-6 -translate-y-1/2 border-8 border-transparent border-t-black/80"></div>
                </div>
            </div>
        </a>
    );
};
