import Chatbot from "@/components/landing/Chatbot";

export default function Hero() {
  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative pt-32 pb-20 lg:pt-36 lg:pb-24 overflow-hidden"
    >
      <div className="absolute inset-0 noise-bg opacity-60 pointer-events-none" />
      <div className="absolute top-32 -left-10 w-72 h-72 bg-purple-accent/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-accent/10 blur-3xl rounded-full pointer-events-none" />

      <div className="container-wide relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left - Chatbot */}
        <div className="fade-up order-2 lg:order-1">
          <Chatbot />
        </div>

        {/* Right - Portrait with blob */}
        <div className="relative h-[420px] lg:h-[520px] fade-up order-1 lg:order-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[88%] h-[88%]">
              <div className="hero-blob" />
              <img
                data-testid="hero-portrait"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80"
                alt="Sibel Akkurt"
                className="absolute inset-0 w-full h-full object-cover rounded-full p-6"
              />
              <span className="dot-purple absolute top-10 -left-2 floaty" />
              <span className="dot-purple absolute bottom-16 -right-1 floaty" style={{ animationDelay: "1.5s" }} />
              <span className="dot-purple absolute top-1/2 right-8 floaty opacity-60" style={{ animationDelay: "0.8s" }} />
            </div>
          </div>

          <div className="absolute bottom-8 left-4 w-12 h-12 rounded-md bg-purple-accent/90 rotate-[35deg] shadow-lg shadow-purple-accent/30" />
        </div>
      </div>
    </section>
  );
}
