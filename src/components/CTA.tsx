export default function CTA() {
  return (
    <section
      id="cta"
      className="py-24 bg-gradient-to-br from-purple-600 to-indigo-600"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Pronto para começar?
        </h2>
        <p className="text-xl text-purple-200 mb-10">
          Junte-se a milhares de empreendedores que usam o Grape para crescer
          todos os dias.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            className="flex-1 px-5 py-4 rounded-full text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="bg-white text-purple-600 font-bold px-7 py-4 rounded-full hover:bg-purple-50 transition-colors whitespace-nowrap"
          >
            Entrar na lista
          </button>
        </form>
        <p className="mt-4 text-sm text-purple-300">
          Sem spam. Cancele quando quiser.
        </p>
      </div>
    </section>
  );
}
