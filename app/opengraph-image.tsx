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
            "linear-gradient(180deg, rgba(246,247,244,1) 0%, rgba(232,239,235,1) 58%, rgba(216,226,224,1) 100%)",
          color: "#16201f"
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
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0f615c, #b75b39)",
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
              AI Solutions, Operations, and People Leadership
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
          <div
            style={{
              fontSize: "22px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#0f615c"
            }}
          >
            Genuine problems. Personalized software. Practical results.
          </div>
          <div style={{ fontSize: "74px", lineHeight: 0.96 }}>
            AI Solutions, Operations, and People Leadership
          </div>
          <div style={{ fontSize: "28px", color: "#5c5550", lineHeight: 1.35 }}>
            Improving cumbersome real-world processes through human understanding,
            practical judgment, and personalized software.
          </div>
        </div>
      </div>
    ),
    size
  );
}
