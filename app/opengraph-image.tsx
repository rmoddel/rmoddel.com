import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "linear-gradient(180deg, rgba(248,242,234,1) 0%, rgba(244,239,231,1) 56%, rgba(237,223,209,1) 100%)",
          color: "#1f1a17"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px"
          }}
        >
          <div
            style={{
              width: "78px",
              height: "78px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #b14b2b, #d27d56)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 700
            }}
          >
            RM
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "28px", fontWeight: 700 }}>Reuben Moddel</div>
            <div style={{ fontSize: "20px", color: "#5c5550" }}>
              Product Operations and Technical Leadership
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
          <div
            style={{
              fontSize: "22px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#82351d"
            }}
          >
            Human understanding. Technical judgment. Practical execution.
          </div>
          <div style={{ fontSize: "74px", lineHeight: 0.96 }}>
            I Help People Make Sense of Messy Work
          </div>
          <div style={{ fontSize: "28px", color: "#5c5550", lineHeight: 1.35 }}>
            Product operations, workflow design, clear communication, and AI-enabled work
            grounded in real human context.
          </div>
        </div>
      </div>
    ),
    size
  );
}
