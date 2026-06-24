import { NextResponse } from "next/server";

type EvaluationLeadPayload = {
  nome?: unknown;
  whatsapp?: unknown;
  cidade?: unknown;
  renda?: unknown;
  situacoes?: unknown;
  tempo?: unknown;
  momento?: unknown;
  disponibilidade?: unknown;
};

const requiredStringFields = [
  "nome",
  "whatsapp",
  "cidade",
  "tempo",
  "momento",
  "disponibilidade",
  "renda",
] as const;

function isFilledString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function validatePayload(payload: EvaluationLeadPayload) {
  const missing: string[] = requiredStringFields.filter(
    (field) => !isFilledString(payload[field]),
  );
  const hasSituation =
    Array.isArray(payload.situacoes) &&
    payload.situacoes.some((item) => isFilledString(item));

  if (!hasSituation) {
    missing.push("situacoes");
  }

  return missing;
}

export async function POST(request: Request) {
  let payload: EvaluationLeadPayload;

  try {
    payload = (await request.json()) as EvaluationLeadPayload;
  } catch {
    return NextResponse.json(
      { message: "Não foi possível ler os dados do formulário." },
      { status: 400 },
    );
  }

  const missing = validatePayload(payload);

  if (missing.length > 0) {
    return NextResponse.json(
      {
        message: "Preencha todos os campos antes de enviar.",
        missing,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      message:
        "Banco de dados ainda não configurado. Conecte esta rota ao serviço de leads antes de publicar.",
    },
    { status: 501 },
  );
}
