import Chatbot from "@/components/landing/Chatbot";

export default function Hero() {
  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative pt-32 pb-20 lg:pt-36 lg:pb-24 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 noise-bg opacity-60 pointer-events-none" />
      <div className="absolute top-32 -left-10 w-72 h-72 bg-purple-accent/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-accent/10 blur-3xl rounded-full pointer-events-none" />

      {/* Floating Purple Bubbles for Effect */}
      <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-purple-accent/30 rounded-full blur-xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

      {/* Changed Grid to make Chatbot much larger (approx 65% / 35%) */}
      <div className="container-wide relative z-10 grid lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-20 items-center">
        
        {/* Left - Chatbot */}
        <div className="fade-up order-2 lg:order-1 relative z-20">
          <Chatbot />
        </div>

        {/* Right - Portrait (Smaller, Speech Bubble styling) */}
        <div className="relative h-[280px] sm:h-[350px] lg:h-[400px] fade-up order-1 lg:order-2 flex items-center justify-center">
          
          <div className="relative w-full max-w-[320px] aspect-square group">
            
            {/* The Speech Bubble Shape */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-accent/30 to-[#1a1a22] rounded-[40px] rounded-bl-sm border border-purple-accent/40 shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] transition-transform duration-500 group-hover:scale-105" />
            
            {/* Speech Bubble Tail */}
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-accent/30 to-[#1a1a22] rounded-full border-b border-l border-purple-accent/40 z-0" />
            
            {/* Image Inside the Bubble */}
            <img
              data-testid="hero-portrait"
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80"
              alt="Sibel Akkurt"
              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-[32px] rounded-bl-sm z-10"
            />

            {/* Little floating bubbles around the image */}
            <span className="absolute -top-4 -left-2 w-4 h-4 bg-purple-accent rounded-full shadow-[0_0_10px_#8b5cf6] animate-bounce" style={{ animationDuration: '2.5s' }} />
            <span className="absolute top-1/4 -right-6 w-3 h-3 bg-purple-400 rounded-full shadow-[0_0_8px_#a78bfa] animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            <span className="absolute -bottom-8 right-10 w-6 h-6 bg-purple-600/80 rounded-full shadow-[0_0_15px_#7c3aed] animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <span className="absolute bottom-1/3 -left-8 w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_5px_#d8b4fe] animate-bounce" style={{ animationDuration: '2s', animationDelay: '1.5s' }} />

          </div>
        </div>
        
      </div>
    </section>
  );
}
