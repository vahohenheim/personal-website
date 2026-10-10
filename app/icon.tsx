import { ImageResponse } from "next/og";
import { loadGeist } from "@/lib/helpers/og-fonts";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** The letter "v" in Geist Bold, night colours. See the design charter. */
export default async function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0E1111",
        borderRadius: 2,
        color: "#E8ECEB",
        fontFamily: "Geist",
        fontWeight: 700,
        fontSize: 24,
        lineHeight: 1,
        paddingBottom: 3,
      }}
    >
      v
    </div>,
    {
      ...size,
      fonts: [{ name: "Geist", data: await loadGeist("Geist-Bold"), weight: 700, style: "normal" }],
    },
  );
}
