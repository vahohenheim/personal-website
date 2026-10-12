import { describe, expect, it } from "vitest";
import { isLikelyBot, isValidEmail, parseLead } from "@/lib/leads/validation";
import { MAX_MESSAGE_LENGTH } from "@/lib/models/lead";
import { formBody } from "../helpers/leads";

describe("parseLead", () => {
  it("accepts a complete form and normalises it", () => {
    const result = parseLead(formBody({ email: "  Ada@Example.COM ", name: "  Ada  " }));

    expect(result).toEqual({
      ok: true,
      value: {
        need: "design-system",
        timeline: "asap",
        message: "We need help with our design system.",
        name: "Ada",
        email: "ada@example.com",
        company: "Analytical Engines",
        locale: "fr",
        source: "linkedin.com",
      },
    });
  });

  it("turns optional fields left empty into null", () => {
    const result = parseLead(formBody({ timeline: "", company: "  ", source: "" }));

    expect(result.ok && result.value).toMatchObject({
      timeline: null,
      company: null,
      source: null,
    });
  });

  it.each([
    ["need_required", { need: "something-else" }],
    ["message_too_short", { message: "short" }],
    ["name_required", { name: "   " }],
    ["invalid_email", { email: "not-an-email" }],
  ])("answers %s", (error, overrides) => {
    expect(parseLead(formBody(overrides))).toEqual({ ok: false, error });
  });

  it("cuts a message that is too long instead of refusing it", () => {
    const result = parseLead(formBody({ message: "a".repeat(MAX_MESSAGE_LENGTH + 50) }));

    expect(result.ok && result.value.message).toHaveLength(MAX_MESSAGE_LENGTH);
  });

  it("falls back to a known locale", () => {
    const result = parseLead(formBody({ locale: "de" }));

    expect(result.ok && ["en", "fr"].includes(result.value.locale)).toBe(true);
  });

  it("keeps only safe characters in the source", () => {
    const result = parseLead(formBody({ source: "News<script>.Example.com/?x=1" }));

    expect(result.ok && result.value.source).toBe("newsscript.example.comx1");
  });

  it("ignores values that are not strings", () => {
    expect(parseLead(formBody({ message: { $ne: "" } }))).toEqual({
      ok: false,
      error: "message_too_short",
    });
  });
});

describe("isValidEmail", () => {
  it.each(["ada@example.com", "a.b+c@sub.example.org"])("accepts %s", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(["", "ada", "ada@", "ada@example", "a b@example.com", `${"a".repeat(250)}@example.com`])(
    "refuses %s",
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    },
  );
});

describe("isLikelyBot", () => {
  const now = 1_800_000_000_000;

  it("lets a person through", () => {
    expect(isLikelyBot({ website: "", startedAt: now - 10_000, now })).toBe(false);
  });

  it("catches a filled honeypot", () => {
    expect(isLikelyBot({ website: "https://spam.example", startedAt: now - 10_000, now })).toBe(
      true,
    );
  });

  it("catches a form sent too fast, too late, or without a start time", () => {
    expect(isLikelyBot({ website: "", startedAt: now - 500, now })).toBe(true);
    expect(isLikelyBot({ website: "", startedAt: now - 25 * 60 * 60 * 1000, now })).toBe(true);
    expect(isLikelyBot({ website: "", startedAt: "yesterday", now })).toBe(true);
    expect(isLikelyBot({ website: "", startedAt: undefined, now })).toBe(true);
  });
});
