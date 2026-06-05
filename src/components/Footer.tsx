export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-white font-bold text-xl">🍇 Grape</span>
        <p className="text-sm">
          © {new Date().getFullYear()} Grape. Todos os direitos reservados.
        </p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition-colors">
            Privacidade
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Termos
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contato
          </a>
        </div>
      </div>
    </footer>
  );
}
