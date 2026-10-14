import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/posts/unlock/route";
import { isAccessTokenValid } from "@/lib/posts/access";

const PASSWORD = "the-password";

const unlock = (body: unknown) =>
  POST(
    new Request("http://localhost/api/posts/unlock/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

const form = (overrides: Record<string, unknown> = {}) => ({
  slug: "headless-commerce",
  password: PASSWORD,
  website: "",
  startedAt: Date.now() - 5000,
  ...overrides,
});

const configure = () => {
  vi.stubEnv("PROTECTED_POSTS_PASSWORD", PASSWORD);
  vi.stubEnv("PROTECTED_POSTS_SECRET", "the-secret");
};

describe("POST /api/posts/unlock/", () => {
  it("stays closed, with a 404, while either variable is missing", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect((await unlock(form())).status).toBe(404);

    vi.stubEnv("PROTECTED_POSTS_PASSWORD", PASSWORD);
    expect((await unlock(form())).status).toBe(404);

    vi.stubEnv("PROTECTED_POSTS_PASSWORD", "");
    vi.stubEnv("PROTECTED_POSTS_SECRET", "the-secret");
    expect((await unlock(form())).status).toBe(404);
    expect(error).toHaveBeenCalled();
  });

  it("sets a signed cookie for the post, HttpOnly, Secure, Lax, 30 days", async () => {
    configure();
    const response = await unlock(form());
    const cookie = response.headers.get("set-cookie") ?? "";
    const value = /^post_access_headless-commerce=([^;]+)/.exec(cookie)?.[1];

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain(`Max-Age=${60 * 60 * 24 * 30}`);
    expect(isAccessTokenValid("headless-commerce", value)).toBe(true);
  });

  it("gives the same neutral answer to every refusal, without a cookie", async () => {
    configure();

    for (const body of [
      form({ password: "wrong" }),
      form({ slug: "pensee" }),
      form({ slug: "unknown" }),
      form({ website: "https://spam.example" }),
      form({ startedAt: Date.now() }),
      form({ password: undefined }),
    ]) {
      const response = await unlock(body);

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: "refused" });
      expect(response.headers.get("set-cookie")).toBeNull();
    }

    expect((await unlock("not json")).status).toBe(400);
  });

  it("never logs the password nor the cookie", async () => {
    configure();
    const logged = [
      vi.spyOn(console, "log").mockImplementation(() => undefined),
      vi.spyOn(console, "error").mockImplementation(() => undefined),
      vi.spyOn(console, "warn").mockImplementation(() => undefined),
    ];
    const response = await unlock(form());
    await unlock(form({ password: "wrong" }));
    const text = JSON.stringify(logged.flatMap((spy) => spy.mock.calls));

    expect(text).not.toContain(PASSWORD);
    expect(text).not.toContain("wrong");
    expect(text).not.toContain(response.headers.get("set-cookie")?.split(";")[0].split("=")[1]);
  });
});
