const features = [
  {
    icon: "⚡",
    title: "Rápido para começar",
    description:
      "Configure seu projeto em minutos com templates prontos e integração com as principais ferramentas do mercado.",
  },
  {
    icon: "🎨",
    title: "Design profissional",
    description:
      "Componentes modernos e responsivos para você criar páginas incríveis sem precisar de um designer.",
  },
  {
    icon: "📈",
    title: "Métricas em tempo real",
    description:
      "Acompanhe o crescimento do seu negócio com dashboards intuitivos e relatórios automáticos.",
  },
  {
    icon: "🔒",
    title: "Segurança total",
    description:
      "Seus dados protegidos com criptografia de ponta a ponta e conformidade com a LGPD.",
  },
  {
    icon: "🤝",
    title: "Colaboração fácil",
    description:
      "Trabalhe em equipe com permissões granulares, comentários e histórico de alterações.",
  },
  {
    icon: "🌐",
    title: "Deploy em 1 clique",
    description:
      "Publique seu produto no ar instantaneamente com CDN global e SSL automático.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Tudo que você precisa
          </h2>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Uma plataforma completa para tirar seu projeto do papel e colocar no
            mundo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-8 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all group"
            >
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
