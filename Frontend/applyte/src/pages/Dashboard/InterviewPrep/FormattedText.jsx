const escapeHtml = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

/**
 * Renders text with support for fenced code blocks:
 * ```js
 * console.log("hi")
 * ```
 */
const FormattedText = ({ text }) => {
  if (!text) return null;

  const parts = String(text).split("```");

  return (
    <div className="space-y-3">
      {parts.map((part, idx) => {
        const isCode = idx % 2 === 1;

        if (!isCode) {
          const t = part.trim();
          if (!t) return null;
          return (
            <p
              key={idx}
              className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed"
            >
              {t}
            </p>
          );
        }

        const normalized = part.replace(/\r\n/g, "\n");
        const lines = normalized.split("\n");
        const first = (lines[0] || "").trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(first);
        const lang = hasLang ? first : "";
        const code = (hasLang ? lines.slice(1) : lines).join("\n").trimEnd();

        return (
          <div
            key={idx}
            className="rounded-xl border border-neutral-800 bg-black/40 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-950/60">
              <span className="text-[11px] text-gray-500 font-mono">
                {lang || "code"}
              </span>
            </div>
            <pre className="p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed">
              <code
                className="font-mono text-gray-200"
                dangerouslySetInnerHTML={{ __html: escapeHtml(code) }}
              />
            </pre>
          </div>
        );
      })}
    </div>
  );
};

export default FormattedText;

