import { describe, expect, it, vi } from "vitest";
import { isAdminAuthorized, isAdminConfigured } from "@/lib/admin/auth";

const basic = (user: string, password: string) =>
  `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;

describe("isAdminAuthorized", () => {
  it("refuses everyone while the credentials are not configured", () => {
    expect(isAdminConfigured()).toBe(false);
    expect(isAdminAuthorized(basic("", ""))).toBe(false);
    expect(isAdminAuthorized(basic("valentin", "secret"))).toBe(false);
  });

  it("accepts the right credentials only", () => {
    vi.stubEnv("ADMIN_USER", "valentin");
    vi.stubEnv("ADMIN_PASSWORD", "s3cret:with-colon");

    expect(isAdminAuthorized(basic("valentin", "s3cret:with-colon"))).toBe(true);
    expect(isAdminAuthorized(basic("valentin", "wrong"))).toBe(false);
    expect(isAdminAuthorized(basic("someone", "s3cret:with-colon"))).toBe(false);
  });

  it("refuses a missing or malformed header", () => {
    vi.stubEnv("ADMIN_USER", "valentin");
    vi.stubEnv("ADMIN_PASSWORD", "secret");

    expect(isAdminAuthorized(null)).toBe(false);
    expect(isAdminAuthorized("")).toBe(false);
    expect(isAdminAuthorized("Bearer abc")).toBe(false);
    expect(isAdminAuthorized("Basic")).toBe(false);
    expect(isAdminAuthorized(`Basic ${Buffer.from("no-separator").toString("base64")}`)).toBe(
      false,
    );
  });
});
