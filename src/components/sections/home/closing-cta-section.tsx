"use client";

import { Check, ChevronLeft, ChevronRight, LoaderCircle, Send } from "lucide-react";
import { FormEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { AnimatedHeading } from "@/components/motion/animated-heading";
import { Reveal } from "@/components/motion/reveal";
import { PageSection } from "@/components/sections/section-shell";
import { Button } from "@/components/ui/button";
import {
  formatBrazilianPhone,
  formatCityName,
  formatPersonName,
  isValidBrazilianPhone,
  normalizeSpaces,
} from "@/lib/form/formatters";
import { getLenis } from "@/lib/lenis";
import { layout } from "@/lib/layout";
import { type } from "@/lib/typography";
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
  "Até R$ 10.000",
  "R$ 10.000 a R$ 20.000",
  "R$ 20.000 a R$ 40.000",
  "R$ 40.000 a R$ 80.000",
  "Acima de R$ 80.000",
];

const situationOptions = [
  "Falta de energia",
  "Dificuldade para emagrecer",
  "Alterações hormonais",
  "Menopausa ou pós-parto",
  "Sono e ansiedade",
  "Performance física ou mental",
  "Inflamação e endometriose",
  "Outro",
];

const durationOptions = [
  "Menos de 6 meses",
  "6 meses a 1 ano",
  "1 a 3 anos",
  "3 a 5 anos",
  "Mais de 5 anos",
];

const healthMomentOptions = [
  "Só busco informações por agora.",
  "Estou avaliando tratamento.",
  "Pronto(a) para investir se fizer sentido.",
  "Busco acompanhamento de longo prazo.",
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
    description: "Sinais, sintomas e tempo convivendo com essa situação.",
  },
  {
    eyebrow: "03",
    title: "Perfil de atendimento",
    description: "Momento, disponibilidade e compatibilidade com acompanhamento.",
  },
] as const;

type Answers = {
  nome: string;
  whatsapp: string;
  cidade: string;
  renda: string;
  situacoes: string[];
  tempo: string;
  momento: string;
  disponibilidade: string;
};

type CitySuggestion = {
  id: string;
  label: string;
};

const initialAnswers: Answers = {
  nome: "",
  whatsapp: "",
  cidade: "",
  renda: "",
  situacoes: [],
  tempo: "",
  momento: "",
  disponibilidade: "",
};

function getStepValidationError(currentStep: number, currentAnswers: Answers) {
  if (currentStep === 0) {
    if (!normalizeSpaces(currentAnswers.nome)) {
      return "Informe seu nome para continuar.";
    }

    if (!isValidBrazilianPhone(currentAnswers.whatsapp)) {
      return "Informe um WhatsApp válido com DDD.";
    }

    if (!normalizeSpaces(currentAnswers.cidade)) {
      return "Informe sua cidade.";
    }
  }

  if (currentStep === 1) {
    if (currentAnswers.situacoes.length === 0) {
      return "Selecione pelo menos uma situação que impacta sua qualidade de vida.";
    }

    if (!currentAnswers.tempo.trim()) {
      return "Selecione há quanto tempo convive com essa situação.";
    }
  }

  if (currentStep === 2) {
    if (!currentAnswers.momento.trim()) {
      return "Selecione a afirmação que melhor representa seu momento atual.";
    }

    if (!currentAnswers.disponibilidade.trim()) {
      return "Informe sua disponibilidade para uma avaliação estratégica.";
    }

    if (!currentAnswers.renda.trim()) {
      return "Selecione sua faixa de renda mensal.";
    }
  }

  return "";
}

const formFieldClass =
  "h-12 rounded-xl border border-input bg-background px-4 text-sm font-normal outline-none transition-[color,border-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/25";

const formStepBodyClass = "p-1";

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
        "group flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm leading-5 outline-none transition-[background-color,border-color,color] duration-300 focus-visible:border-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/25",
        active
          ? "border-primary/40 bg-primary text-primary-foreground hover:border-primary/55 hover:bg-primary/92"
          : "border-border bg-background/72 text-foreground hover:border-primary/28 hover:bg-primary/[0.06]",
      )}
    >
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full border transition-colors duration-300",
          active
            ? "border-primary-foreground/40 bg-primary-foreground text-primary"
            : "border-border bg-card text-transparent group-hover:border-primary/30 group-hover:bg-primary/[0.08]",
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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const visibleCitySuggestions =
    answers.cidade.trim().length >= 2 ? citySuggestions : [];
  const [stepBodyHeight, setStepBodyHeight] = useState<number>();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const stepBodyRef = useRef<HTMLDivElement>(null);
  const submitErrorRef = useRef<HTMLParagraphElement>(null);
  const skipStepFocusRef = useRef(true);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);
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

  useLayoutEffect(() => {
    const node = stepBodyRef.current;
    if (!node) return;

    const measure = () => {
      setStepBodyHeight(node.scrollHeight);
      getLenis()?.resize();
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, [step, submitted]);

  useEffect(() => {
    if (!submitError) return;

    getLenis()?.resize();

    const frame = window.requestAnimationFrame(() => {
      submitErrorRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [submitError]);

  useEffect(() => {
    const query = answers.cidade.trim();

    if (query.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/cidades?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = (await response.json()) as {
          cities?: CitySuggestion[];
        };

        setCitySuggestions(data.cities ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setCitySuggestions([]);
      }
    }, 160);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [answers.cidade]);

  function updateAnswer<Key extends keyof Answers>(key: Key, value: Answers[Key]) {
    setSubmitError("");
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

  function updateContactField(fieldId: (typeof contactFields)[number]["id"], value: string) {
    if (fieldId === "whatsapp") {
      updateAnswer("whatsapp", formatBrazilianPhone(value));
      return;
    }

    updateAnswer(fieldId, value);
  }

  function finalizeContactField(fieldId: (typeof contactFields)[number]["id"]) {
    if (fieldId === "nome") {
      updateAnswer("nome", formatPersonName(answers.nome));
      return;
    }

    if (fieldId === "cidade") {
      updateAnswer("cidade", formatCityName(answers.cidade));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const validationError = getStepValidationError(step, answers);

    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    if (!isLastStep) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/avaliacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          nome: formatPersonName(answers.nome),
          cidade: formatCityName(answers.cidade),
          whatsapp: formatBrazilianPhone(answers.whatsapp),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(data?.message || "Não foi possível enviar suas respostas agora.");
      }

      setSubmitted(true);
      setAnswers(initialAnswers);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar suas respostas agora.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageSection
      id="contato"
      className={cn(
        "bg-transparent",
        layout.sectionBandEnd,
        "pt-16 sm:pt-20 lg:pt-24",
      )}
    >
      <div className="relative isolate overflow-hidden rounded-lg bg-primary text-primary-foreground ring-1 ring-primary-foreground/10">
        <div className="relative z-10 grid gap-0 lg:grid-cols-[minmax(0,0.82fr)_minmax(31rem,1fr)]">
          <div className="flex min-h-0 flex-col justify-between gap-10 p-6 sm:gap-12 sm:p-10 lg:min-h-[36rem] lg:p-14">
            <div>
              <Reveal preset="fadeUp">
                <p className="text-sm font-medium text-primary-foreground/68">
                  Avaliação estratégica
                </p>
              </Reveal>
              <AnimatedHeading
                text="Comece com uma leitura individual do seu momento."
                className={cn("mt-5 max-w-xl text-balance text-primary-foreground", type.section)}
              />
            </div>

            <div className="max-w-md text-sm leading-[1.75] text-primary-foreground/72">
              <p>
                As respostas ajudam a equipe a entender se a avaliação faz
                sentido para o seu caso e qual próximo passo deve ser indicado.
              </p>
              <p className="mt-10 text-sm text-primary-foreground/68">
                03 etapas objetivas · cerca de 2 min para iniciar
              </p>
            </div>
          </div>

          <form
            id="contato-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulário de avaliação estratégica"
            className={cn(
              "m-3 rounded-lg border border-border/60 bg-background p-5 text-foreground sm:m-5 sm:p-6 lg:m-7 lg:p-7",
              layout.scrollMarginHeader,
            )}
          >
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {stepAnnouncement}
            </p>
            {submitted ? (
              <div
                className="overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{
                  height:
                    stepBodyHeight !== undefined ? `${stepBodyHeight}px` : "auto",
                }}
              >
                <div
                  ref={stepBodyRef}
                  className={cn("flex flex-col justify-between", formStepBodyClass)}
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
                    <h3 className="mt-4 max-w-lg text-balance text-2xl font-medium leading-tight sm:text-3xl">
                      Recebemos suas respostas para a avaliação inicial.
                    </h3>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
                      A equipe irá analisar as informações enviadas e retornar
                      pelo contato informado.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-7 flex items-start justify-between gap-5 border-b border-border pb-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {steps[step].eyebrow} / 03
                    </p>
                    <h3
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="mt-2 text-xl font-medium leading-tight outline-none sm:text-[1.625rem]"
                    >
                      {steps[step].title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-[1.7] text-muted-foreground">
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
                  className="mb-8 h-px overflow-hidden rounded-full bg-border"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-label={`Progresso do formulário: etapa ${step + 1} de ${steps.length}`}
                >
                  <div
                    className="h-full origin-left rounded-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ transform: `scaleX(${progress / 100})` }}
                  />
                </div>

                <div
                  className="overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0"
                  style={{
                    height:
                      stepBodyHeight !== undefined ? `${stepBodyHeight}px` : "auto",
                  }}
                >
                  <div ref={stepBodyRef} className={formStepBodyClass}>
                    {step === 0 ? (
                      <div className="grid gap-4">
                        {contactFields.map((field) => (
                          <label
                            key={field.id}
                            htmlFor={field.id}
                            className="grid gap-2 text-sm font-medium"
                          >
                            {field.label}
                            <input
                              id={field.id}
                              name={field.id}
                              type={field.type}
                              autoComplete={field.autoComplete}
                              inputMode={field.id === "whatsapp" ? "numeric" : undefined}
                              maxLength={field.id === "whatsapp" ? 16 : undefined}
                              list={field.id === "cidade" ? "city-suggestions" : undefined}
                              value={answers[field.id]}
                              onChange={(event) =>
                                updateContactField(field.id, event.target.value)
                              }
                              onBlur={() => finalizeContactField(field.id)}
                              placeholder={field.placeholder}
                              className={formFieldClass}
                            />
                          </label>
                        ))}
                        <datalist id="city-suggestions">
                          {visibleCitySuggestions.map((city) => (
                            <option key={city.id} value={city.label} />
                          ))}
                        </datalist>
                      </div>
                    ) : null}

                    {step === 1 ? (
                      <div className="grid gap-7">
                        <fieldset>
                          <legend className="mb-3 text-sm font-medium">
                            Qual dessas situações mais impacta sua qualidade de
                            vida atualmente?
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
                      </div>
                    ) : null}

                    {step === 2 ? (
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

                        <fieldset>
                          <legend className="mb-3 text-sm font-medium">
                            Qual é a sua faixa de renda mensal?
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
                  </div>
                </div>

                {submitError ? (
                  <p
                    ref={submitErrorRef}
                    role="alert"
                    className="mt-4 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm leading-6 text-destructive"
                  >
                    {submitError}
                  </p>
                ) : null}

                <div className="mt-7 flex items-center justify-between gap-3 border-t border-border pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={step === 0 || submitting}
                    onClick={() => {
                      setSubmitError("");
                      setStep((current) => Math.max(current - 1, 0));
                    }}
                  >
                    <ChevronLeft className="size-4" />
                    Voltar
                  </Button>
                  <Button type="submit" size="lg" className="min-w-36" disabled={submitting}>
                    {submitting
                      ? "Enviando"
                      : isLastStep
                        ? "Enviar respostas"
                        : "Continuar"}
                    {submitting ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : isLastStep ? (
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
      </div>
    </PageSection>
  );
}
