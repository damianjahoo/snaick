export function EmptyState() {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 lg:p-12 text-center border border-white/10 max-w-2xl mx-auto">
      {/* Illustration */}
      <div className="mb-6">
        <div className="text-6xl sm:text-7xl mb-4 animate-bounce">🍪</div>
        <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl mb-4">
          <span className="animate-pulse">✨</span>
          <span className="animate-pulse delay-100">🥗</span>
          <span className="animate-pulse delay-200">🍎</span>
        </div>
      </div>

      {/* Main Message */}
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Brak ulubionych przekąsek</h3>
        <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          Nie masz jeszcze żadnych ulubionych przekąsek. Wygeneruj swoją pierwszą przekąskę używając naszego
          inteligentnego generatora i dodaj ją do ulubionych!
        </p>
      </div>

      {/* Features List */}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-blue-100/70">
            <span className="text-green-400">✓</span>
            <span>Spersonalizowane przepisy</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100/70">
            <span className="text-green-400">✓</span>
            <span>Wartości odżywcze</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100/70">
            <span className="text-green-400">✓</span>
            <span>Dostosowane do diety</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100/70">
            <span className="text-green-400">✓</span>
            <span>Łatwe w przygotowaniu</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="space-y-4">
        <a
          href="/generate"
          className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm sm:text-base"
          aria-label="Przejdź do generatora przekąsek"
        >
          🚀 Wygeneruj pierwszą przekąskę
        </a>

        {/* Secondary info */}
        <p className="text-xs text-blue-100/50 max-w-xs mx-auto leading-relaxed">
          Potrzebujesz tylko kilku minut, aby uzyskać idealną przekąskę dopasowaną do Twoich potrzeb
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 left-4 text-white/10 text-xs hidden lg:block">
        <span className="animate-pulse">⭐</span>
      </div>
      <div className="absolute top-8 right-6 text-white/10 text-sm hidden lg:block">
        <span className="animate-pulse delay-300">✨</span>
      </div>
      <div className="absolute bottom-6 left-8 text-white/10 text-xs hidden lg:block">
        <span className="animate-pulse delay-500">🌟</span>
      </div>
    </div>
  );
}
