const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "/mês",
    description: "Ideal para começar e explorar.",
    features: [
      "1 projeto",
      "500 visitas/mês",
      "Templates básicos",
      "Suporte por e-mail",
    ],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 49",
    period: "/mês",
    description: "Para quem está crescendo.",
    features: [
      "Projetos ilimitados",
      "100k visitas/mês",
      "Todos os templates",
      "Analytics avançado",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    highlighted: true,
  },
  {
    name: "Business",
    price: "R$ 149",
    period: "/mês",
    description: "Para times e empresas.",
    features: [
      "Tudo do Pro",
      "Visitas ilimitadas",
      "Membros ilimitados",
      "SLA garantido",
      "Gerente de conta",
    ],
    cta: "Falar com vendas",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Planos simples
          </h2>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Comece de graça e escale conforme cresce. Sem surpresas na fatura.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${
                plan.highlighted
                  ? "border-purple-500 bg-purple-600 text-white shadow-2xl shadow-purple-200 scale-105"
                  : "border-gray-100 bg-white text-gray-900"
              }`}
            >
              <p
                className={`text-sm font-semibold uppercase tracking-wide mb-2 ${plan.highlighted ? "text-purple-200" : "text-purple-600"}`}
              >
                {plan.name}
              </p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span
                  className={`text-sm mb-1 ${plan.highlighted ? "text-purple-200" : "text-gray-400"}`}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className={`text-sm mb-6 ${plan.highlighted ? "text-purple-200" : "text-gray-500"}`}
              >
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span
                      className={
                        plan.highlighted ? "text-purple-200" : "text-purple-600"
                      }
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className={`block text-center font-semibold py-3 rounded-full transition-colors ${
                  plan.highlighted
                    ? "bg-white text-purple-600 hover:bg-purple-50"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
