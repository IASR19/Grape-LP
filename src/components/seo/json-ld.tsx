type JsonLdProps = {
  id: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

function serializeJsonLd(
  data: Record<string, unknown> | Array<Record<string, unknown>>,
) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Server-only — JSON-LD no HTML inicial para crawlers. */
export function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
