import { ImageResponse } from "next/og";
import { loadGeist } from "@/lib/helpers/og-fonts";

export const size = { width: 180, height: 180 };
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
        borderRadius: 0,
        color: "#E8ECEB",
        fontFamily: "Geist",
        fontWeight: 700,
        fontSize: 132,
        lineHeight: 1,
        paddingBottom: 16,
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
