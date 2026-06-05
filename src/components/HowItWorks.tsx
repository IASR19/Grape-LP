const steps = [
  {
    number: "01",
    title: "Crie sua conta",
    description: "Cadastro gratuito em menos de 30 segundos. Sem burocracia.",
  },
  {
    number: "02",
    title: "Configure seu projeto",
    description:
      "Escolha um template ou comece do zero com nosso editor visual.",
  },
  {
    number: "03",
    title: "Publique e cresça",
    description:
      "Lance para o mundo e acompanhe seus resultados em tempo real.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-br from-purple-50 to-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Como funciona
          </h2>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Três passos simples para começar a transformar sua ideia em
            realidade.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-purple-600 text-white text-xl font-extrabold flex items-center justify-center mb-6 shadow-lg shadow-purple-200">
                {step.number}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-purple-200" />
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
