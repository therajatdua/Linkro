import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") ?? "demo";
  const name = searchParams.get("name") ?? `@${username}`;
  const bio = searchParams.get("bio") ?? "Build your digital identity with Linkro";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          background: "#0f172a",
          color: "#f8fafc",
          fontSize: 44,
          fontWeight: 700,
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 18, opacity: 0.85 }}>linkro.com/{username}</div>
        <div>{name}</div>
        <div style={{ marginTop: 14, fontSize: 20, fontWeight: 500, opacity: 0.9 }}>
          {bio}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
