import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);

  const title =
    searchParams.get("title") ?? "Laxmikant Nishad";
  const subtitle =
    searchParams.get("subtitle") ??
    "AI/ML Engineer • LLMs • Multi‑Modal • Computer Vision";
  const tagline =
    searchParams.get("tagline") ??
    "Healthcare LLM apps · QLoRA fine‑tuning · Safety & structured JSON · Docker / llama.cpp";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          background:
            "linear-gradient(135deg, #0b1220 0%, #0f2a52 50%, #081120 100%)",
          color: "#E5F0FF",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans"',
        }}
      >
        {/* Glow layers */}
        <div
          style={{
            position: "absolute",
            inset: "-20px",
            background:
              "radial-gradient(800px 400px at 20% 85%, rgba(96,165,250,0.25), rgba(96,165,250,0) 60%), radial-gradient(700px 350px at 85% 10%, rgba(34,211,238,0.25), rgba(34,211,238,0) 60%)",
            filter: "blur(2px)",
          }}
        />
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px, 48px 48px",
            maskImage:
              "radial-gradient(60% 60% at 50% 50%, black 0%, transparent 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            zIndex: 2,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "72px 96px",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: 740 }}>
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#B6C7E7",
              }}
            >
              Applied AI / ML Engineer
            </div>

            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                textShadow:
                  "0 8px 32px rgba(34,211,238,0.25), 0 4px 16px rgba(96,165,250,0.2)",
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                background:
                  "linear-gradient(90deg, #60a5fa, #22d3ee)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                marginTop: 4,
              }}
            >
              {subtitle}
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 24,
                color: "#B6C7E7",
                maxWidth: 720,
              }}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: tagline }}
            />
          </div>

          {/* Orb graphic */}
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 45% 45%, rgba(34,211,238,0.95) 0%, rgba(34,211,238,0.25) 60%, rgba(34,211,238,0) 65%), radial-gradient(circle at 55% 55%, rgba(96,165,250,0.9) 0%, rgba(96,165,250,0.15) 60%, rgba(96,165,250,0) 65%)",
              boxShadow:
                "0 0 80px rgba(34,211,238,0.45), 0 0 160px rgba(96,165,250,0.35), inset 0 0 60px rgba(11,18,32,0.6)",
            }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            left: 96,
            right: 96,
            bottom: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#B6C7E7",
            fontSize: 22,
          }}
        >
          <div
            style={{
              fontFamily:
                'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              color: "#E5F0FF",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            laxmikantnishad.com
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["Transformers", "RAG", "PyTorch", "Docker"].map((t) => (
              <div
                key={t}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(146,176,220,0.35)",
                  background: "rgba(12,20,36,0.35)",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}