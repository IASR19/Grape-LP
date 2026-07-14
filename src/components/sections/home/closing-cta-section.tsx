"use client";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  FormEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

const MAX_SITUACOES = 3;

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

const availabilityOptions = ["Sim", "Talvez", "Não"];

const profissaoOptions = [
  "Médico(a)",
  "Advogado(a)",
  "Engenheiro(a)",
  "Empreendedor(a)",
  "Executivo(a) / Gestor(a)",
  "Professor(a) / Educador(a)",
  "Profissional de Saúde",
  "Psicólogo(a)",
  "Servidor(a) Público",
  "Autônomo(a)",
  "Estudante",
  "Outro",
];

const steps = [
  {
    eyebrow: "01",
    title: "Identificação",
    description: "Dados básicos para a equipe saber quem deve retornar.",
  },
  {
    eyebrow: "02",
    title: "Seu momento",
    description: "A principal situação e sua disponibilidade para avaliação.",
  },
] as const;

type Answers = {
  nome: string;
  whatsapp: string;
  cidade: string;
  profissao: string;
  situacoes: string[];
  disponibilidade: string;
  renda: string;
};

type CitySuggestion = {
  id: string;
  label: string;
};

const initialAnswers: Answers = {
  nome: "",
  whatsapp: "",
  cidade: "",
  profissao: "",
  situacoes: [],
  disponibilidade: "",
  renda: "",
};

function getStepValidationError(currentStep: number, currentAnswers: Answers) {
  if (currentStep === 1) {
    if (currentAnswers.situacoes.length === 0) {
      return "Selecione pelo menos uma situação que impacta sua qualidade de vida.";
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

type ContactFieldId = (typeof contactFields)[number]["id"];
type FieldErrors = Partial<Record<ContactFieldId, string>>;

function validateContactField(fieldId: ContactFieldId, value: string): string {
  if (fieldId === "nome") {
    return normalizeSpaces(value) ? "" : "Informe seu nome.";
  }
  if (fieldId === "whatsapp") {
    return isValidBrazilianPhone(value)
      ? ""
      : "Informe um WhatsApp válido com DDD.";
  }
  if (fieldId === "cidade") {
    const v = normalizeSpaces(value);
    if (!v) return "Informe sua cidade.";
    if (/\d/.test(v) || !/[a-zA-ZÀ-ÿ]/.test(v))
      return "Informe um nome de cidade válido.";
    return "";
  }
  return "";
}

const formFieldClass =
  "h-12 rounded-xl border border-input bg-background px-4 text-sm font-normal outline-none transition-[color,border-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/25";

const formFieldErrorClass =
  "border-destructive focus-visible:border-destructive focus-visible:outline-destructive/25";

const formFieldSuccessClass =
  "border-emerald-500/70 focus-visible:border-emerald-500 focus-visible:outline-emerald-500/20";

const formStepBodyClass = "p-1";

type OptionSelectProps = {
  options: readonly string[];
  placeholder: string;
  value: string;
  outroConfirmed: string;
  onSelect: (option: string) => void;
  error?: string;
  labelId: string;
};

function OptionSelect({
  options,
  placeholder,
  value,
  outroConfirmed,
  onSelect,
  error,
  labelId,
}: OptionSelectProps) {
  const [open, setOpen] = useState(false);

  const displayValue =
    value === "Outro" && outroConfirmed ? `Outro: ${outroConfirmed}` : value;
  const hasError = !!error;
  const isValid = !!value && !hasError;

  return (
    <div>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          formFieldClass,
          "flex w-full items-center justify-between text-left",
          !value && "text-muted-foreground",
          hasError && formFieldErrorClass,
          isValid && formFieldSuccessClass,
          open && "rounded-b-none border-b-0",
        )}
      >
        <span className="truncate">{displayValue || placeholder}</span>
        <ChevronDown
          className={cn(
            "ml-2 size-4 shrink-0 opacity-50 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-b-xl border border-t-0 border-border bg-background"
            role="listbox"
            aria-labelledby={labelId}
          >
            <div className="grid grid-cols-2 gap-px bg-border p-px pt-0">
              {options.map((option) => {
                const isSelected = value === option;
                const label =
                  option === "Outro" && outroConfirmed
                    ? `Outro: ${outroConfirmed}`
                    : option;
                return (
                  <button
                    type="button"
                    key={option}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      if (option !== "Outro") setOpen(false);
                      onSelect(option);
                    }}
                    className={cn(
                      "flex items-center gap-2.5 bg-background px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted",
                      isSelected && "bg-primary/5 font-medium",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded border transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border",
                      )}
                      aria-hidden
                    >
                      {isSelected && <Check className="size-2.5" />}
                    </span>
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {hasError ? (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type OutroDialogProps = {
  open: boolean;
  title: string;
  description: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

function OutroDialog({
  open,
  title,
  description,
  placeholder,
  value,
  onChange,
  onConfirm,
  onClose,
  inputRef,
}: OutroDialogProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="outro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            key="outro-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="outro-dialog-title"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h4
                  id="outro-dialog-title"
                  className="text-base font-semibold leading-tight"
                >
                  {title}
                </h4>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="mt-0.5 shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              maxLength={120}
              className={cn(formFieldClass, "w-full")}
              onKeyDown={(e) => {
                if (e.key === "Enter") onConfirm();
                if (e.key === "Escape") onClose();
              }}
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={!value.trim()}
              >
                Confirmar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function OptionButton({
  active,
  children,
  onClick,
  pressed,
  disabled,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed ?? active}
      className={cn(
        "group flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm leading-5 outline-none transition-[background-color,border-color,color] duration-300 focus-visible:border-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/25 disabled:pointer-events-none disabled:opacity-40",
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
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const visibleCitySuggestions =
    answers.cidade.trim().length >= 2 ? citySuggestions : [];
  const [stepBodyHeight, setStepBodyHeight] = useState<number>();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const stepBodyRef = useRef<HTMLDivElement>(null);
  const submitErrorRef = useRef<HTMLParagraphElement>(null);
  const skipStepFocusRef = useRef(true);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [profissaoError, setProfissaoError] = useState("");
  const [profissaoOutroDialogOpen, setProfissaoOutroDialogOpen] =
    useState(false);
  const [profissaoOutroDraft, setProfissaoOutroDraft] = useState("");
  const [profissaoOutroConfirmed, setProfissaoOutroConfirmed] = useState("");
  const profissaoOutroInputRef = useRef<HTMLInputElement>(null);

  const [situacaoOutroDialogOpen, setSituacaoOutroDialogOpen] = useState(false);
  const [situacaoOutroDraft, setSituacaoOutroDraft] = useState("");
  const [situacaoOutroConfirmed, setSituacaoOutroConfirmed] = useState("");
  const situacaoOutroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profissaoOutroDialogOpen) return;
    const frame = requestAnimationFrame(() =>
      profissaoOutroInputRef.current?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [profissaoOutroDialogOpen]);

  useEffect(() => {
    if (!situacaoOutroDialogOpen) return;
    const frame = requestAnimationFrame(() =>
      situacaoOutroInputRef.current?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [situacaoOutroDialogOpen]);

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
        const response = await fetch(
          `/api/cidades?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );

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

  function updateAnswer<Key extends keyof Answers>(
    key: Key,
    value: Answers[Key],
  ) {
    setSubmitError("");
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function selectProfissao(value: string) {
    setProfissaoError("");
    if (value === "Outro") {
      if (answers.profissao === "Outro") {
        updateAnswer("profissao", "");
        setProfissaoOutroConfirmed("");
      } else {
        setProfissaoOutroDraft(profissaoOutroConfirmed);
        setProfissaoOutroDialogOpen(true);
      }
      return;
    }
    updateAnswer("profissao", value);
  }

  function confirmProfissaoOutro() {
    const text = profissaoOutroDraft.trim();
    if (!text) return;
    setProfissaoOutroConfirmed(text);
    updateAnswer("profissao", "Outro");
    setProfissaoOutroDialogOpen(false);
  }

  function toggleSituacao(value: string) {
    setSubmitError("");

    if (value === "Outro") {
      if (answers.situacoes.includes("Outro")) {
        setAnswers((current) => ({
          ...current,
          situacoes: current.situacoes.filter((item) => item !== "Outro"),
        }));
        setSituacaoOutroConfirmed("");
      } else if (answers.situacoes.length < MAX_SITUACOES) {
        setSituacaoOutroDraft(situacaoOutroConfirmed);
        setSituacaoOutroDialogOpen(true);
      }
      return;
    }

    setAnswers((current) => {
      const selected = current.situacoes.includes(value);
      if (!selected && current.situacoes.length >= MAX_SITUACOES) {
        return current;
      }

      return {
        ...current,
        situacoes: selected
          ? current.situacoes.filter((item) => item !== value)
          : [...current.situacoes, value],
      };
    });
  }

  function confirmSituacaoOutro() {
    const text = situacaoOutroDraft.trim();
    if (!text) return;
    setSituacaoOutroConfirmed(text);
    setAnswers((current) => ({
      ...current,
      situacoes: [
        ...current.situacoes.filter((item) => item !== "Outro"),
        "Outro",
      ],
    }));
    setSituacaoOutroDialogOpen(false);
  }

  function updateContactField(fieldId: ContactFieldId, value: string) {
    const formatted =
      fieldId === "whatsapp" ? formatBrazilianPhone(value) : value;
    updateAnswer(fieldId, formatted as Answers[typeof fieldId]);

    setFieldErrors((prev) => {
      if (prev[fieldId] === undefined) return prev;
      return { ...prev, [fieldId]: validateContactField(fieldId, formatted) };
    });
  }

  function finalizeContactField(fieldId: ContactFieldId) {
    if (fieldId === "nome") {
      updateAnswer("nome", formatPersonName(answers.nome));
      return;
    }
    if (fieldId === "cidade") {
      updateAnswer("cidade", formatCityName(answers.cidade));
    }
  }

  function handleFieldBlur(fieldId: ContactFieldId, rawValue: string) {
    finalizeContactField(fieldId);
    const error = validateContactField(fieldId, rawValue);
    setFieldErrors((prev) => ({ ...prev, [fieldId]: error }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    if (step === 0) {
      const newErrors: FieldErrors = {};
      let hasErrors = false;
      for (const field of contactFields) {
        const error = validateContactField(field.id, answers[field.id]);
        newErrors[field.id] = error;
        if (error) hasErrors = true;
      }
      setFieldErrors(newErrors);

      if (!answers.profissao.trim()) {
        setProfissaoError("Selecione sua profissão para continuar.");
        hasErrors = true;
      }

      if (hasErrors) return;
      setStep((current) => Math.min(current + 1, steps.length - 1));
      return;
    }

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
          nome: formatPersonName(answers.nome),
          whatsapp: formatBrazilianPhone(answers.whatsapp),
          cidade: formatCityName(answers.cidade),
          profissao:
            answers.profissao === "Outro" && profissaoOutroConfirmed
              ? profissaoOutroConfirmed
              : answers.profissao,
          situacoes: answers.situacoes.map((s) =>
            s === "Outro" && situacaoOutroConfirmed ? situacaoOutroConfirmed : s,
          ),
          disponibilidade: answers.disponibilidade,
          renda: answers.renda,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(
          data?.message || "Não foi possível enviar suas respostas agora.",
        );
      }

      setSubmitted(true);
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead");
      }
      setAnswers(initialAnswers);
      setFieldErrors({});
      setProfissaoError("");
      setProfissaoOutroConfirmed("");
      setSituacaoOutroConfirmed("");
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
                className={cn(
                  "mt-5 max-w-xl text-balance text-primary-foreground",
                  type.section,
                )}
              />
            </div>

            <div className="max-w-md text-sm leading-[1.75] text-primary-foreground/72">
              <p>
                As respostas ajudam a equipe a entender se a avaliação faz
                sentido para o seu caso e qual próximo passo deve ser indicado.
              </p>
              <p className="mt-10 text-sm text-primary-foreground/68">
                02 etapas objetivas · cerca de 1 min para iniciar
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
                    stepBodyHeight !== undefined
                      ? `${stepBodyHeight}px`
                      : "auto",
                }}
              >
                <div
                  ref={stepBodyRef}
                  className={cn(
                    "flex flex-col justify-between",
                    formStepBodyClass,
                  )}
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
                      {steps[step].eyebrow} / 02
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
                      stepBodyHeight !== undefined
                        ? `${stepBodyHeight}px`
                        : "auto",
                  }}
                >
                  <div ref={stepBodyRef} className={formStepBodyClass}>
                    {step === 0 ? (
                      <div className="grid gap-4">
                        {contactFields.map((field) => {
                          const errorMsg = fieldErrors[field.id];
                          const isTouched = errorMsg !== undefined;
                          const hasError = !!errorMsg;
                          const isValid = isTouched && !hasError;
                          return (
                            <div key={field.id} className="grid gap-2">
                              <label
                                htmlFor={field.id}
                                className="text-sm font-medium"
                              >
                                {field.label}
                              </label>
                              <input
                                id={field.id}
                                name={field.id}
                                type={field.type}
                                autoComplete={field.autoComplete}
                                inputMode={
                                  field.id === "whatsapp"
                                    ? "numeric"
                                    : undefined
                                }
                                maxLength={
                                  field.id === "whatsapp" ? 16 : undefined
                                }
                                list={
                                  field.id === "cidade"
                                    ? "city-suggestions"
                                    : undefined
                                }
                                value={answers[field.id]}
                                aria-describedby={
                                  hasError ? `${field.id}-error` : undefined
                                }
                                aria-invalid={hasError}
                                onChange={(event) =>
                                  updateContactField(
                                    field.id,
                                    event.target.value,
                                  )
                                }
                                onBlur={(event) =>
                                  handleFieldBlur(field.id, event.target.value)
                                }
                                placeholder={field.placeholder}
                                className={cn(
                                  formFieldClass,
                                  hasError && formFieldErrorClass,
                                  isValid && formFieldSuccessClass,
                                )}
                              />
                              {hasError ? (
                                <p
                                  id={`${field.id}-error`}
                                  role="alert"
                                  className="text-xs text-destructive"
                                >
                                  {errorMsg}
                                </p>
                              ) : null}
                            </div>
                          );
                        })}
                        <datalist id="city-suggestions">
                          {visibleCitySuggestions.map((city) => (
                            <option key={city.id} value={city.label} />
                          ))}
                        </datalist>

                        <div className="grid gap-2">
                          <label
                            id="profissao-label"
                            className="text-sm font-medium"
                          >
                            Profissão
                          </label>
                          <OptionSelect
                            options={profissaoOptions}
                            placeholder="Selecione sua profissão"
                            value={answers.profissao}
                            outroConfirmed={profissaoOutroConfirmed}
                            onSelect={selectProfissao}
                            error={profissaoError}
                            labelId="profissao-label"
                          />
                        </div>
                      </div>
                    ) : null}

                    {step === 1 ? (
                      <div className="grid gap-7">
                        <fieldset>
                          <legend className="mb-3 text-sm font-medium">
                            Qual dessas situações mais impacta sua qualidade de
                            vida? <span className="font-normal text-muted-foreground">(até 3)</span>
                          </legend>
                          <div
                            className="grid gap-2 sm:grid-cols-2"
                            role="group"
                            aria-label="Situações que impactam sua qualidade de vida"
                          >
                            {situationOptions.map((option) => {
                              const selected = answers.situacoes.includes(option);
                              const limitReached =
                                answers.situacoes.length >= MAX_SITUACOES;
                              return (
                                <OptionButton
                                  key={option}
                                  active={selected}
                                  pressed={selected}
                                  disabled={!selected && limitReached}
                                  onClick={() => toggleSituacao(option)}
                                >
                                  {option === "Outro" && situacaoOutroConfirmed
                                    ? `Outro: ${situacaoOutroConfirmed}`
                                    : option}
                                </OptionButton>
                              );
                            })}
                          </div>
                        </fieldset>

                        <fieldset>
                          <legend className="mb-3 text-sm font-medium">
                            Disponibilidade
                          </legend>
                          <p className="mb-3 text-sm leading-6 text-muted-foreground">
                            Caso seu perfil seja compatível com nossa
                            metodologia, você teria disponibilidade para uma
                            avaliação estratégica?
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
                                onClick={() =>
                                  updateAnswer("disponibilidade", option)
                                }
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
                  <Button
                    type="submit"
                    size="lg"
                    className="min-w-36 bg-cta-accent text-cta-accent-foreground hover:bg-cta-accent/90"
                    disabled={submitting}
                  >
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
      <OutroDialog
        open={profissaoOutroDialogOpen}
        title="Qual é a sua profissão?"
        description="Descreva sua profissão ou área de atuação."
        placeholder="Ex: arquiteto, nutricionista, analista…"
        value={profissaoOutroDraft}
        onChange={setProfissaoOutroDraft}
        onConfirm={confirmProfissaoOutro}
        onClose={() => setProfissaoOutroDialogOpen(false)}
        inputRef={profissaoOutroInputRef}
      />

      <OutroDialog
        open={situacaoOutroDialogOpen}
        title="Qual é a sua situação?"
        description="Descreva o que mais impacta sua qualidade de vida."
        placeholder="Ex: dores crônicas, problemas de tireoide…"
        value={situacaoOutroDraft}
        onChange={setSituacaoOutroDraft}
        onConfirm={confirmSituacaoOutro}
        onClose={() => setSituacaoOutroDialogOpen(false)}
        inputRef={situacaoOutroInputRef}
      />
    </PageSection>
  );
}
