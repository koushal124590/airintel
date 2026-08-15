export default function Header() {
  return (
    <header className="hidden md:flex justify-between items-center w-full h-16 px-8 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm sticky top-0 z-30">
      {/* Product Name / Context */}
      <div className="flex items-center gap-4">
        <span className="font-title-md text-title-md text-on-surface font-semibold hidden lg:block">AirIntel</span>
        <div className="h-4 w-px bg-outline-variant/30 hidden lg:block"></div>
        <div className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all cursor-pointer">
          <span className="material-symbols-outlined text-sm">location_on</span>
          <span className="font-label-sm text-label-sm">Greater Noida, Uttar Pradesh</span>
        </div>
      </div>
      
      {/* Actions & Profile */}
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:text-primary transition-all p-2 rounded-full hover:bg-surface-variant/50 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20 cursor-pointer opacity-100 hover:opacity-80 transition-opacity">
          <img 
            alt="Municipal Officer Profile" 
            className="w-8 h-8 rounded-full object-cover border border-outline-variant/30" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxSjmt0bX-iKII2wu-h6165ka8eC8CeMR7lE5fYyXQHI3vzQAnQZYjZuzQrHlfXZQT6dtIe9SEeMYHPzTulPOQK0Ai2ABFOVygTfU-KRIGYNqBHu-l36Ii-u6fg7QWoNJW7OmsaBG5yuF_yiJB4A95IqCOXcgGkjU7NoeshO4Itkxyi4O9r4wacLMhkBhFYT0YU-1Kv3YsX7NCcNvvNEOB5qOu7yGFnqu8-rGyTchAd4xnhw7UyzczgA" 
          />
          <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
        </div>
      </div>
    </header>
  );
}
