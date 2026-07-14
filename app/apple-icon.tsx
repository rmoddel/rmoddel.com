import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
          background: "#fff5ea"
        }}
      >
        <div
          style={{
            width: "144px",
            height: "144px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "34px",
            background: "#181316",
            color: "#fffaf4",
            fontSize: "52px",
            fontWeight: 800,
            letterSpacing: "0.04em"
          }}
        >
          RM
        </div>
      </div>
    ),
    size
  );
}
