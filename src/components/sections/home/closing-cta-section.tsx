"use client";

import { Check, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { ParallaxImage } from "@/components/media/parallax-image";
import { PageSection } from "@/components/sections/section-shell";
import { Button } from "@/components/ui/button";
import { mediaAssets } from "@/content/media";
import { newWindowHint } from "@/lib/a11y";
import { MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";

const contactFields = [
  {
    id: "nome",
    label: "Nome",
    type: "text",
    placeholder: "Seu nome",
    autoComplete: "name",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    type: "tel",
    placeholder: "(00) 00000-0000",
    autoComplete: "tel",
  },
  {
    id: "cidade",
    label: "Cidade",
    type: "text",
    placeholder: "Onde você mora",
    autoComplete: "address-level2",
  },
] as const;

const incomeOptions = [
  "Ate R$ 10.000",
  "R$ 10.000 a R$ 20.000",
  "R$ 20.000 a R$ 40.000",
  "R$ 40.000 a R$ 80.000",
  "Acima de R$ 80.000",
];

const situationOptions = [
  "Falta de energia",
  "Dificuldade para emagrecer",
  "Ganho de peso frequente",
  "Alteracoes hormonais",
  "Menopausa",
  "Pós-parto",
  "Baixa libido",
  "Sono ruim",
  "Ansiedade",
  "Performance física",
  "Performance mental",
  "Inflamação",
  "Endometriose",
  "Outro",
];

const durationOptions = [
  "Menos de 6 meses",
  "6 meses a 1 ano",
  "1 a 3 anos",
  "3 a 5 anos",
  "Mais de 5 anos",
];

const motivationOptions = [
  "Recuperar energia e disposição",
  "Melhorar composição corporal",
  "Equilibrar hormônios",
  "Melhorar performance física",
  "Melhorar performance mental",
  "Saúde feminina",
  "Prevenção e longevidade",
  "Resolver sintomas sem solução",
  "Outro",
];

const healthMomentOptions = [
  "Busco apenas informações neste momento.",
  "Estou avaliando possibilidades de tratamento.",
  "Estou disposto(a) a investir em um acompanhamento estratégico se identificar uma solução adequada para meu caso.",
  "Entendo que saúde é um investimento e busco um acompanhamento de longo prazo.",
];

const availabilityOptions = ["Sim", "Talvez", "Não"];

const steps = [
  {
    eyebrow: "01",
    title: "Primeiro contato",
    description: "Dados básicos para a equipe entender quem deve retornar.",
  },
  {
    eyebrow: "02",
    title: "Momento atual",
    description: "Sinais, sintomas e contexto que motivaram a avaliação.",
  },
  {
    eyebrow: "03",
    title: "Prioridade",
    description: "O que precisa mudar e há quanto tempo isso aparece.",
  },
  {
    eyebrow: "04",
    title: "Disponibilidade",
    description: "Compatibilidade com uma avaliação estratégica e acompanhamento.",
  },
] as const;

type Answers = {
  nome: string;
  whatsapp: string;
  cidade: string;
  renda: string;
  situacoes: string[];
  tempo: string;
  motivacao: string;
  momento: string;
  disponibilidade: string;
};

const initialAnswers: Answers = {
  nome: "",
  whatsapp: "",
  cidade: "",
  renda: "",
  situacoes: [],
  tempo: "",
  motivacao: "",
  momento: "",
  disponibilidade: "",
};

function buildWhatsAppHref(answers: Answers) {
  const message = [
    "Olá, vim pelo site e gostaria de iniciar uma avaliação estratégica.",
    "",
    `Nome: ${answers.nome || "Não informado"}`,
    `WhatsApp: ${answers.whatsapp || "Não informado"}`,
    `Cidade: ${answers.cidade || "Não informada"}`,
    `Faixa de renda: ${answers.renda || "Não informada"}`,
    `Situações atuais: ${
      answers.situacoes.length ? answers.situacoes.join(", ") : "Não informado"
    }`,
    `Tempo convivendo com a situação: ${answers.tempo || "Não informado"}`,
    `Motivação principal: ${answers.motivacao || "Não informada"}`,
    `Momento atual: ${answers.momento || "Não informado"}`,
    `Disponibilidade: ${answers.disponibilidade || "Não informada"}`,
  ].join("\n");

  return `https://api.whatsapp.com/send?phone=5535991390358&text=${encodeURIComponent(
    message,
  )}`;
}

function OptionButton({
  active,
  children,
  onClick,
  pressed,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed ?? active}
      className={cn(
        "group flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm leading-5 transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5",
        active
          ? "border-primary/40 bg-primary text-primary-foreground"
          : "border-border bg-background/72 text-foreground hover:border-primary/24 hover:bg-background",
      )}
    >
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full border transition-colors duration-300",
          active
            ? "border-primary-foreground/40 bg-primary-foreground text-primary"
            : "border-border bg-card text-transparent",
        )}
        aria-hidden
      >
        <Check className="size-3" />
      </span>
      <span>{children}</span>
    </button>
  );
}

export function ClosingCtaSection() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const skipStepFocusRef = useRef(true);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);
  const whatsappHref = useMemo(() => buildWhatsAppHref(answers), [answers]);
  const isLastStep = step === steps.length - 1;
  const stepAnnouncement = useMemo(() => {
    if (submitted) return "";

    const current = steps[step];
    return `Etapa ${step + 1} de ${steps.length}: ${current.title}. ${current.description}`;
  }, [step, submitted]);

  useEffect(() => {
    if (submitted) return;

    if (skipStepFocusRef.current) {
      skipStepFocusRef.current = false;
      return;
    }

    stepHeadingRef.current?.focus();
  }, [step, submitted]);

  function updateAnswer<Key extends keyof Answers>(key: Key, value: Answers[Key]) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function toggleSituation(value: string) {
    setAnswers((current) => {
      const selected = current.situacoes.includes(value);

      return {
        ...current,
        situacoes: selected
          ? current.situacoes.filter((item) => item !== value)
          : [...current.situacoes, value],
      };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLastStep) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
      return;
    }

    setSubmitted(true);
  }

  return (
    <PageSection id="contato" className="bg-transparent pb-16 pt-0 lg:pb-20">
      <Reveal preset="fadeUp" className="relative isolate overflow-hidden rounded-xl bg-primary text-primary-foreground ring-1 ring-primary-foreground/10">
        <ParallaxImage
          alt={mediaAssets.ctaBackground.alt}
          src={mediaAssets.ctaBackground.src}
          speed={MOTION.parallax.card}
          className="absolute inset-0"
          imageClassName="object-cover object-center"
          sizes="(min-width: 1024px) 70vw, 100vw"
        />
        <div className="absolute inset-0 bg-primary/74" />
        <div className="relative z-10 grid gap-0 lg:grid-cols-[minmax(0,0.88fr)_minmax(30rem,1fr)]">
          <div className="flex min-h-[34rem] flex-col justify-between p-6 sm:p-9 lg:p-12">
            <div>
              <p className="text-sm font-medium text-primary-foreground/68">
                Avaliação estratégica
              </p>
              <h2 className="mt-5 max-w-2xl text-balance font-sans text-4xl font-medium leading-[1.12] sm:text-5xl">
                Comece com uma leitura individual do seu momento.
              </h2>
            </div>

            <div className="max-w-md text-sm leading-6 text-primary-foreground/72">
              <p>
                As respostas ajudam a equipe a entender se a avaliação faz
                sentido para o seu caso e qual próximo passo deve ser indicado.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 text-primary-foreground/80">
                <div className="rounded-xl border border-primary-foreground/14 bg-primary-foreground/[0.06] p-4">
                  <p className="text-2xl font-medium">04</p>
                  <p className="mt-1 text-xs leading-5 text-primary-foreground/62">
                    etapas objetivas
                  </p>
                </div>
                <div className="rounded-xl border border-primary-foreground/14 bg-primary-foreground/[0.06] p-4">
                  <p className="text-2xl font-medium">2 min</p>
                  <p className="mt-1 text-xs leading-5 text-primary-foreground/62">
                    para iniciar
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            aria-label="Formulário de avaliação estratégica"
            className="m-3 rounded-xl bg-background p-4 text-foreground shadow-[0_0.75rem_1.5rem_color-mix(in_oklch,var(--foreground)_12%,transparent)] sm:m-5 sm:p-5 lg:m-6 lg:p-6"
          >
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {stepAnnouncement}
            </p>
            {submitted ? (
              <div
                className="flex min-h-[32rem] flex-col justify-between"
                aria-live="polite"
                aria-atomic="true"
              >
                <div>
                  <div className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-5" />
                  </div>
                  <p className="mt-8 text-sm font-medium text-muted-foreground">
                    Avaliação iniciada
                  </p>
                  <h3 className="mt-4 max-w-lg text-balance text-3xl font-medium leading-tight">
                    Recebemos suas respostas para a triagem inicial.
                  </h3>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
                    Para concluir, envie o resumo pelo WhatsApp. A mensagem ja
                    vai preenchida para facilitar o retorno da equipe.
                  </p>
                </div>

                <Button asChild size="lg" className="mt-10 w-full">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    Enviar resumo pelo WhatsApp
                    <Send className="size-4" aria-hidden />
                    <span className="sr-only">{newWindowHint}</span>
                  </a>
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-start justify-between gap-5 border-b border-border pb-5">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {steps[step].eyebrow} / 04
                    </p>
                    <h3
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="mt-2 text-2xl font-medium leading-tight outline-none"
                    >
                      {steps[step].title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                      {steps[step].description}
                    </p>
                  </div>
                  <span
                    className="hidden rounded-full border border-border px-3 py-1 text-xs text-muted-foreground sm:inline-flex"
                    aria-hidden
                  >
                    {Math.round(progress)}%
                  </span>
                </div>

                <div
                  className="mb-7 h-px overflow-hidden rounded-full bg-border"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-label={`Progresso do formulário: etapa ${step + 1} de ${steps.length}`}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="min-h-[25rem]">
                  {step === 0 ? (
                    <div className="grid gap-4">
                      {contactFields.map((field) => (
                        <label key={field.id} htmlFor={field.id} className="grid gap-2 text-sm font-medium">
                          {field.label}
                          <input
                            id={field.id}
                            name={field.id}
                            required
                            type={field.type}
                            autoComplete={field.autoComplete}
                            value={answers[field.id]}
                            onChange={(event) =>
                              updateAnswer(field.id, event.target.value)
                            }
                            placeholder={field.placeholder}
                            className="h-12 rounded-xl border border-input bg-background px-4 text-sm font-normal outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                          />
                        </label>
                      ))}

                      <fieldset>
                        <legend className="mb-3 text-sm font-medium">
                          Qual sua faixa de renda mensal?
                        </legend>
                        <div
                          className="grid gap-2 sm:grid-cols-2"
                          role="radiogroup"
                          aria-label="Faixa de renda mensal"
                        >
                          {incomeOptions.map((option) => (
                            <OptionButton
                              key={option}
                              active={answers.renda === option}
                              onClick={() => updateAnswer("renda", option)}
                            >
                              {option}
                            </OptionButton>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  ) : null}

                  {step === 1 ? (
                    <fieldset>
                      <legend className="mb-3 text-sm font-medium">
                        Qual dessas situacoes mais impacta sua qualidade de vida
                        atualmente?
                      </legend>
                      <div
                        className="grid gap-2 sm:grid-cols-2"
                        role="group"
                        aria-label="Situações que impactam sua qualidade de vida"
                      >
                        {situationOptions.map((option) => (
                          <OptionButton
                            key={option}
                            active={answers.situacoes.includes(option)}
                            pressed={answers.situacoes.includes(option)}
                            onClick={() => toggleSituation(option)}
                          >
                            {option}
                          </OptionButton>
                        ))}
                      </div>
                    </fieldset>
                  ) : null}

                  {step === 2 ? (
                    <div className="grid gap-7">
                      <fieldset>
                        <legend className="mb-3 text-sm font-medium">
                          Há quanto tempo convive com essa situação?
                        </legend>
                        <div
                          className="grid gap-2 sm:grid-cols-2"
                          role="radiogroup"
                          aria-label="Tempo convivendo com a situação"
                        >
                          {durationOptions.map((option) => (
                            <OptionButton
                              key={option}
                              active={answers.tempo === option}
                              onClick={() => updateAnswer("tempo", option)}
                            >
                              {option}
                            </OptionButton>
                          ))}
                        </div>
                      </fieldset>

                      <fieldset>
                        <legend className="mb-3 text-sm font-medium">
                          O que mais motivou você a buscar uma avaliação neste
                          momento?
                        </legend>
                        <div
                          className="grid gap-2 sm:grid-cols-2"
                          role="radiogroup"
                          aria-label="Motivação para buscar avaliação"
                        >
                          {motivationOptions.map((option) => (
                            <OptionButton
                              key={option}
                              active={answers.motivacao === option}
                              onClick={() => updateAnswer("motivacao", option)}
                            >
                              {option}
                            </OptionButton>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="grid gap-7">
                      <fieldset>
                        <legend className="mb-3 text-sm font-medium">
                          Quando se trata da sua saúde, qual afirmação melhor
                          representa seu momento atual?
                        </legend>
                        <div
                          className="grid gap-2"
                          role="radiogroup"
                          aria-label="Momento atual em relação à saúde"
                        >
                          {healthMomentOptions.map((option) => (
                            <OptionButton
                              key={option}
                              active={answers.momento === option}
                              onClick={() => updateAnswer("momento", option)}
                            >
                              {option}
                            </OptionButton>
                          ))}
                        </div>
                      </fieldset>

                      <fieldset>
                        <legend className="mb-3 text-sm font-medium">
                          Disponibilidade
                        </legend>
                        <p className="mb-3 text-sm leading-6 text-muted-foreground">
                          Caso seu perfil seja compatível com nossa metodologia,
                          você teria disponibilidade para uma avaliação estratégica?
                        </p>
                        <div
                          className="grid gap-2 sm:grid-cols-3"
                          role="radiogroup"
                          aria-label="Disponibilidade para avaliação estratégica"
                        >
                          {availabilityOptions.map((option) => (
                            <OptionButton
                              key={option}
                              active={answers.disponibilidade === option}
                              onClick={() => updateAnswer("disponibilidade", option)}
                            >
                              {option}
                            </OptionButton>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  ) : null}
                </div>

                <div className="mt-7 flex items-center justify-between gap-3 border-t border-border pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={step === 0}
                    onClick={() => setStep((current) => Math.max(current - 1, 0))}
                  >
                    <ChevronLeft className="size-4" />
                    Voltar
                  </Button>
                  <Button type="submit" size="lg" className="min-w-36">
                    {isLastStep ? "Enviar respostas" : "Continuar"}
                    {isLastStep ? (
                      <Send className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </Reveal>
    </PageSection>
  );
}
