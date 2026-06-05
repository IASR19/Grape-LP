export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Novidade 🚀
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
          O jeito mais fácil de <span className="text-purple-600">crescer</span>{" "}
          online
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Grape reúne tudo que você precisa para criar, lançar e escalar seu
          produto digital — em minutos, sem complicação.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#cta"
            className="bg-purple-600 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
          >
            Começar grátis
          </a>
          <a
            href="#how-it-works"
            className="bg-white text-gray-700 font-semibold px-8 py-4 rounded-full text-lg border border-gray-200 hover:border-purple-300 transition-colors"
          >
            Ver como funciona
          </a>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          Sem cartão de crédito. Cancele quando quiser.
        </p>
      </div>
    </section>
  );
}
