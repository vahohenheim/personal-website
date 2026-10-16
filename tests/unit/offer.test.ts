import { describe, expect, it } from "vitest";
import { DAY_RATES, HOME_SERVICES, SERVICES } from "@/lib/constants/offer";
import { formatEuros, formatPrice, formatStartingPrice, getService } from "@/lib/helpers/offer";
import en from "@/locales/en";
import fr from "@/locales/fr";

// French prices use narrow non-breaking spaces between thousands and a non-breaking space
// before the euro sign: written out here so that a change of typography is seen.
const NNBSP = " ";
const NBSP = " ";

describe("prices", () => {
  it("are written in the typography of each language", () => {
    expect(formatEuros(1900, "fr")).toBe(`1${NNBSP}900${NBSP}€`);
    expect(formatEuros(1900, "en")).toBe("€1,900");
  });

  it("show a unit, a range or a quote as on the page", () => {
    expect(formatPrice({ type: "fixed", amount: 850, unit: "day" }, "fr", fr.offre.price)).toBe(
      `850${NBSP}€/j`,
    );
    expect(
      formatPrice({ type: "range", min: 2500, max: 4000, unit: "month" }, "en", en.offre.price),
    ).toBe("€2,500 to €4,000/month");
    expect(formatPrice({ type: "range", min: 3500, max: 7000 }, "fr", fr.offre.price)).toBe(
      `3${NNBSP}500${NBSP}€ à 7${NNBSP}000${NBSP}€`,
    );
    expect(formatPrice({ type: "quote" }, "fr", fr.offre.price)).toBe("sur devis");
    expect(formatPrice({ type: "from", amount: 5500 }, "fr", fr.offre.price)).toBe(
      `dès 5${NNBSP}500${NBSP}€`,
    );
    expect(formatPrice({ type: "from", amount: 9000 }, "en", en.offre.price)).toBe("from €9,000");
  });

  it("start from the lowest price on the home page, or show the only one", () => {
    expect(formatStartingPrice(getService("audit"), "fr", fr.offre.price)).toBe(
      `dès 1${NNBSP}900${NBSP}€`,
    );
    expect(formatStartingPrice(getService("lead"), "fr", fr.offre.price)).toBe(`850${NBSP}€/j`);
    expect(formatStartingPrice(getService("launch"), "en", en.offre.price)).toBe("from €3,500");
    expect(formatStartingPrice(getService("retainer"), "en", en.offre.price)).toBe(
      "from €2,500/month",
    );
    expect(formatStartingPrice(getService("build"), "fr", fr.offre.price)).toBe("sur devis");
  });

  it("start a website from its cheapest option, not from an add-on", () => {
    expect(formatStartingPrice(getService("creation"), "fr", fr.offre.price)).toBe(
      `dès 1${NNBSP}200${NBSP}€`,
    );
  });

  it("are those of Valentin's brief", () => {
    expect(
      Object.fromEntries(
        SERVICES.map((service) => [service.id, service.options.map((option) => option.price)]),
      ),
    ).toEqual({
      audit: [
        { type: "fixed", amount: 1900 },
        { type: "fixed", amount: 5000 },
      ],
      lead: [{ type: "fixed", amount: 850, unit: "day" }],
      build: [{ type: "quote" }],
      creation: [
        { type: "fixed", amount: 1200 },
        { type: "fixed", amount: 2500 },
        { type: "fixed", amount: 300 },
        { type: "from", amount: 5500 },
        { type: "from", amount: 9000 },
        { type: "fixed", amount: 120, unit: "month" },
      ],
      launch: [{ type: "range", min: 3500, max: 7000 }],
      retainer: [{ type: "range", min: 2500, max: 4000, unit: "month" }],
    });
    expect(DAY_RATES).toEqual({ reference: 800, urgent: 950 });
    expect(HOME_SERVICES).toEqual(["audit", "lead", "launch", "creation"]);
  });
});

describe("texts of the services", () => {
  it("label every option of every service, in both languages", () => {
    for (const dictionary of [fr, en]) {
      for (const service of SERVICES) {
        const texts = dictionary.offre.services[service.id];

        expect(Object.keys(texts.prices).sort()).toEqual(
          service.options.map((option) => option.id).sort(),
        );
        expect(texts.deliverables.length).toBeGreaterThan(0);
      }
    }
  });

  it("follow French typography", () => {
    const french = JSON.stringify(fr.offre);

    // A plain space before a colon, a semicolon or a percent sign, or a straight apostrophe.
    expect(french).not.toMatch(/ [:;%]/);
    expect(french).not.toContain("'");
  });
});
