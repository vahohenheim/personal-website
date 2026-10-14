import { describe, expect, it, vi } from "vitest";
import {
  ACCESS_MAX_AGE_SECONDS,
  createAccessToken,
  isAccessConfigured,
  isAccessTokenValid,
  isPasswordValid,
} from "@/lib/posts/access";

const configure = () => {
  vi.stubEnv("PROTECTED_POSTS_PASSWORD", "the-password");
  vi.stubEnv("PROTECTED_POSTS_SECRET", "the-secret");
};

describe("access to protected posts", () => {
  it("is closed while either variable is missing", () => {
    expect(isAccessConfigured()).toBe(false);
    expect(isPasswordValid("")).toBe(false);

    vi.stubEnv("PROTECTED_POSTS_PASSWORD", "the-password");
    expect(isAccessConfigured()).toBe(false);
    expect(isPasswordValid("the-password")).toBe(false);

    vi.stubEnv("PROTECTED_POSTS_PASSWORD", "");
    vi.stubEnv("PROTECTED_POSTS_SECRET", "the-secret");
    expect(isAccessTokenValid("headless-commerce", createAccessToken("headless-commerce"))).toBe(
      false,
    );
  });

  it("checks the password", () => {
    configure();

    expect(isPasswordValid("the-password")).toBe(true);
    expect(isPasswordValid("the-passwor")).toBe(false);
    expect(isPasswordValid(42)).toBe(false);
  });

  it("opens one post, for 30 days, with a token signed by the secret", () => {
    configure();
    const now = Date.UTC(2026, 9, 14);
    const token = createAccessToken("headless-commerce", now);

    expect(isAccessTokenValid("headless-commerce", token, now)).toBe(true);
    // Another post.
    expect(isAccessTokenValid("pensee", token, now)).toBe(false);
    // Expired.
    expect(
      isAccessTokenValid("headless-commerce", token, now + ACCESS_MAX_AGE_SECONDS * 1000 + 1),
    ).toBe(false);
    // Forged: a later expiry with the old signature, or no signature.
    const [, signature] = token.split(".");
    expect(isAccessTokenValid("headless-commerce", `9999999999.${signature}`, now)).toBe(false);
    expect(isAccessTokenValid("headless-commerce", "9999999999", now)).toBe(false);
    expect(isAccessTokenValid("headless-commerce", undefined, now)).toBe(false);
    // Signed with another secret.
    vi.stubEnv("PROTECTED_POSTS_SECRET", "another-secret");
    expect(isAccessTokenValid("headless-commerce", token, now)).toBe(false);
  });
});
