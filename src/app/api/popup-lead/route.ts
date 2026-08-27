import { NextResponse } from "next/server";

import {
  isValidBrazilianPhone,
  nationalPhoneDigits,
} from "@/lib/form/formatters";

const GRAPEGEST_URL = "https://www.grapegest.com.br/api/webhooks/leads";

type PopupVariant = "scroll" | "tempo";

type PopupLeadPayload = {
  nome?: unknown;
  whatsapp?: unknown;
  cidade?: unknown;
  variant?: unknown;
};

const requiredStringFields = ["nome", "whatsapp", "cidade"] as const;

function isFilledString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPopupVariant(value: unknown): value is PopupVariant {
  return value === "scroll" || value === "tempo";
}

function validatePayload(payload: PopupLeadPayload) {
  return requiredStringFields.filter((field) => !isFilledString(payload[field]));
}

export async function POST(request: Request) {
  let payload: PopupLeadPayload;

  try {
    payload = (await request.json()) as PopupLeadPayload;
  } catch {
    return NextResponse.json(
      { message: "Não foi possível ler os dados do formulário." },
      { status: 400 },
    );
  }

  const missing = validatePayload(payload);

  if (missing.length > 0) {
    return NextResponse.json(
      { message: "Preencha todos os campos antes de enviar.", missing },
      { status: 400 },
    );
  }

  if (!isValidBrazilianPhone(payload.whatsapp as string)) {
    return NextResponse.json(
      {
        message: "Informe um WhatsApp válido com DDD e 9 dígitos.",
        missing: ["whatsapp"],
      },
      { status: 400 },
    );
  }

  const token = process.env.GRAPEGEST_TOKEN;

  if (!token) {
    console.error("[popup-lead] GRAPEGEST_TOKEN não configurado.");
    return NextResponse.json(
      { message: "Serviço de leads não configurado. Tente novamente mais tarde." },
      { status: 503 },
    );
  }

  const variant = isPopupVariant(payload.variant) ? payload.variant : "scroll";

  const grapegestPayload: Record<string, string> = {
    name: payload.nome as string,
    phone: nationalPhoneDigits((payload.whatsapp as string).trim()),
    localizacao: payload.cidade as string,
    source: `popup-${variant}`,
  };

  try {
    const response = await fetch(GRAPEGEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(grapegestPayload),
    });

    if (response.status === 401) {
      console.error("[popup-lead] Token do GrapeGest inválido.");
      return NextResponse.json(
        { message: "Não foi possível registrar seu contato agora. Tente novamente." },
        { status: 502 },
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[popup-lead] GrapeGest retornou ${response.status}: ${body}`);
      return NextResponse.json(
        { message: "Não foi possível registrar seu contato agora. Tente novamente." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: "Contato recebido com sucesso." });
  } catch (error) {
    console.error("[popup-lead] Erro ao contatar GrapeGest:", error);
    return NextResponse.json(
      { message: "Não foi possível registrar seu contato agora. Tente novamente." },
      { status: 502 },
    );
  }
}
