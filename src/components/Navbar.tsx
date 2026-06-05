export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold text-purple-600">
          🍇 Grape
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <li>
            <a
              href="#features"
              className="hover:text-purple-600 transition-colors"
            >
              Funcionalidades
            </a>
          </li>
          <li>
            <a
              href="#how-it-works"
              className="hover:text-purple-600 transition-colors"
            >
              Como funciona
            </a>
          </li>
          <li>
            <a
              href="#pricing"
              className="hover:text-purple-600 transition-colors"
            >
              Preços
            </a>
          </li>
        </ul>
        <a
          href="#cta"
          className="bg-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-purple-700 transition-colors"
        >
          Começar grátis
        </a>
      </nav>
    </header>
  );
}
