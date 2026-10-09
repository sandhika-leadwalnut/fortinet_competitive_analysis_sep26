interface SlideCoverProps {
  onNavigateHome?: () => void;
}

export function SlideCover({ onNavigateHome }: SlideCoverProps) {
  return (
    <div className="w-full h-full bg-white flex flex-col relative">
      <div className="w-full h-full flex items-center justify-center px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-block px-8 py-3 bg-blue-600 text-white text-2xl font-bold rounded-xl mb-8">
              SEO &amp; AI VISIBILITY
            </div>
          </div>
          <h1 className="text-[56px] font-bold text-black leading-tight tracking-tight uppercase">
            Monthly Performance Dashboard - Fortinet - Sep 2026
          </h1>
        </div>
      </div>
    </div>
  );
}
