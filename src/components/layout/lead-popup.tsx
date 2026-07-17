"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";

import { clinicPhotos } from "@/content/media";
import {
  formatBrazilianPhone,
  formatCityName,
  formatPersonName,
  isValidBrazilianPhone,
  normalizeSpaces,
} from "@/lib/form/formatters";
import { getScrollY } from "@/lib/lenis";
import { zIndex } from "@/lib/z-index";
import { cn } from "@/lib/utils";

type Variant = "scroll" | "tempo";

type PopupAnswers = {
  nome: string;
  whatsapp: string;
  cidade: string;
};

const fields = [
  {
    id: "nome",
    label: "Nome completo",
    placeholder: "Nome completo",
    type: "text",
    autoComplete: "name",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    placeholder: "(00) 0000-0000",
    type: "tel",
    autoComplete: "tel",
  },
  {
    id: "cidade",
    label: "Cidade",
    placeholder: "Cidade",
    type: "text",
    autoComplete: "address-level2",
  },
] as const satisfies readonly {
  id: keyof PopupAnswers;
  label: string;
  placeholder: string;
  type: string;
  autoComplete: string;
}[];

const initialAnswers: PopupAnswers = { nome: "", whatsapp: "", cidade: "" };

const STORAGE_LAST_SHOWN = "grape_popup_last_shown";
const STORAGE_CONVERTED_AT = "grape_popup_converted_at";
const SESSION_SHOWN_KEY = "grape_popup_shown_session";
const SESSION_VARIANT_KEY = "grape_popup_variant";

const SUPPRESS_DAYS = 5;
/** Meio da faixa pedida (20-30% de scroll). */
const SCROLL_TRIGGER_RATIO = 0.25;
/** Meio da faixa pedida (10-12s) — também o ponto de maior conversão em benchmarks de mercado. */
const TIME_TRIGGER_MS = 11000;

function daysSince(timestamp: number) {
  return (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
}

function shouldSuppress() {
  const convertedAt = Number(window.localStorage.getItem(STORAGE_CONVERTED_AT));
  if (convertedAt && daysSince(convertedAt) < SUPPRESS_DAYS) return true;

  const lastShown = Number(window.localStorage.getItem(STORAGE_LAST_SHOWN));
  if (lastShown && daysSince(lastShown) < SUPPRESS_DAYS) return true;

  if (window.sessionStorage.getItem(SESSION_SHOWN_KEY)) return true;

  return false;
}

function validateField(fieldId: keyof PopupAnswers, value: string): string {
  if (fieldId === "nome") {
    return normalizeSpaces(value) ? "" : "Informe seu nome.";
  }
  if (fieldId === "whatsapp") {
    return isValidBrazilianPhone(value)
      ? ""
      : "Informe um WhatsApp válido com DDD.";
  }
  const v = normalizeSpaces(value);
  if (!v) return "Informe sua cidade.";
  if (/\d/.test(v) || !/[a-zA-ZÀ-ÿ]/.test(v))
    return "Informe um nome de cidade válido.";
  return "";
}

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<PopupAnswers>(initialAnswers);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PopupAnswers, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const variantRef = useRef<Variant>("scroll");
  const shownRef = useRef(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldSuppress()) return;

    const stored = window.sessionStorage.getItem(SESSION_VARIANT_KEY);
    const variant: Variant =
      stored === "scroll" || stored === "tempo"
        ? stored
        : Math.random() < 0.5
          ? "scroll"
          : "tempo";
    window.sessionStorage.setItem(SESSION_VARIANT_KEY, variant);
    variantRef.current = variant;

    function show() {
      if (shownRef.current) return;
      shownRef.current = true;
      setOpen(true);
      window.sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
      window.localStorage.setItem(STORAGE_LAST_SHOWN, String(Date.now()));
    }

    if (variant === "tempo") {
      const timeout = window.setTimeout(show, TIME_TRIGGER_MS);
      return () => window.clearTimeout(timeout);
    }

    function handleScroll() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (getScrollY() / scrollable >= SCROLL_TRIGGER_RATIO) show();
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => firstFieldRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open]);

  function updateField(fieldId: keyof PopupAnswers, value: string) {
    setSubmitError("");
    const formatted =
      fieldId === "whatsapp" ? formatBrazilianPhone(value) : value;
    setAnswers((current) => ({ ...current, [fieldId]: formatted }));
    setErrors((prev) => {
      if (prev[fieldId] === undefined) return prev;
      return { ...prev, [fieldId]: validateField(fieldId, formatted) };
    });
  }

  function handleBlur(fieldId: keyof PopupAnswers, rawValue: string) {
    if (fieldId === "nome") {
      setAnswers((current) => ({
        ...current,
        nome: formatPersonName(current.nome),
      }));
    }
    if (fieldId === "cidade") {
      setAnswers((current) => ({
        ...current,
        cidade: formatCityName(current.cidade),
      }));
    }
    setErrors((prev) => ({ ...prev, [fieldId]: validateField(fieldId, rawValue) }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const newErrors: Partial<Record<keyof PopupAnswers, string>> = {};
    let hasErrors = false;
    for (const field of fields) {
      const error = validateField(field.id, answers[field.id]);
      newErrors[field.id] = error;
      if (error) hasErrors = true;
    }
    setErrors(newErrors);
    if (hasErrors) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/popup-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formatPersonName(answers.nome),
          whatsapp: formatBrazilianPhone(answers.whatsapp),
          cidade: formatCityName(answers.cidade),
          variant: variantRef.current,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(
          data?.message || "Não foi possível enviar seus dados agora.",
        );
      }

      window.localStorage.setItem(STORAGE_CONVERTED_AT, String(Date.now()));
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead");
      }
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar seus dados agora.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="lead-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: zIndex.modal }}
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            key="lead-popup-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid w-full max-w-xl grid-cols-1 overflow-hidden rounded-2xl shadow-2xl sm:grid-cols-[1.17fr_1fr]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-popup-title"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="absolute right-4 top-4 z-20 grid size-7 place-items-center rounded-full text-[#f6ead9]/90 transition-colors hover:bg-white/10"
            >
              <X className="size-4" />
            </button>

            <div className="relative hidden sm:block">
              <Image
                src={clinicPhotos.popupConsulta}
                alt="Dra. Marcela Ferreira de Oliveira"
                fill
                sizes="(min-width: 640px) 50vw, 0vw"
                className="object-cover object-[center_75%]"
              />
            </div>

            <div className="relative isolate overflow-hidden bg-[#483328] px-6 py-6 text-[#f6ead9] sm:px-7 sm:pb-6 sm:pt-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-40 -top-1 z-0 h-[254px] w-[386px] bg-black opacity-[0.28]"
                style={{
                  maskImage: "url(/brand/popup/grape-motif.png)",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  maskSize: "contain",
                  WebkitMaskImage: "url(/brand/popup/grape-motif.png)",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  WebkitMaskSize: "contain",
                }}
              />
              {submitted ? (
                <div className="relative z-10 flex min-h-[14rem] flex-col justify-center">
                  <h3 className="text-2xl font-medium leading-tight">
                    Recebemos seus dados.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#f6ead9]/75">
                    Nossa equipe vai entrar em contato pelo WhatsApp.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Formulário rápido de agendamento"
                  className="relative z-10"
                >
                  <h3
                    id="lead-popup-title"
                    className="text-xl font-medium leading-tight tracking-tight sm:text-[1.4rem] sm:leading-[1.3]"
                  >
                    Agende a sua
                    <br className="hidden sm:block" /> primeira consulta
                  </h3>

                  <div className="mt-5 grid gap-2.5">
                    {fields.map((field, index) => {
                      const error = errors[field.id];
                      return (
                        <div key={field.id}>
                          <label
                            htmlFor={`popup-${field.id}`}
                            className="sr-only"
                          >
                            {field.label}
                          </label>
                          <input
                            ref={index === 0 ? firstFieldRef : undefined}
                            id={`popup-${field.id}`}
                            name={field.id}
                            type={field.type}
                            autoComplete={field.autoComplete}
                            inputMode={
                              field.id === "whatsapp" ? "numeric" : undefined
                            }
                            maxLength={field.id === "whatsapp" ? 16 : undefined}
                            value={answers[field.id]}
                            placeholder={field.placeholder}
                            aria-invalid={!!error}
                            aria-describedby={
                              error ? `popup-${field.id}-error` : undefined
                            }
                            onChange={(event) =>
                              updateField(field.id, event.target.value)
                            }
                            onBlur={(event) =>
                              handleBlur(field.id, event.target.value)
                            }
                            className={cn(
                              "h-9 w-full rounded border border-transparent bg-[#f9f1de] px-3.5 text-[13px] text-[#3a2416] outline-none placeholder:text-[#3a2416]/70 focus-visible:border-[#f6ead9]",
                              error && "border-red-400",
                            )}
                          />
                          {error ? (
                            <p
                              id={`popup-${field.id}-error`}
                              role="alert"
                              className="mt-1 text-xs text-red-300"
                            >
                              {error}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {submitError ? (
                    <p role="alert" className="mt-3 text-xs text-red-300">
                      {submitError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-4 h-9 w-full rounded bg-cta-accent text-sm font-medium text-cta-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? "Enviando…" : "Quero agendar"}
                  </button>

                  <div className="mt-3 flex justify-center">
                    <Image
                      src="/brand/popup/grape-badge.png"
                      alt=""
                      width={76}
                      height={50}
                      aria-hidden
                    />
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
