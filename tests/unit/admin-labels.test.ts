import { describe, expect, it } from "vitest";
import { describeSync, STATUS_LABELS } from "@/app/admin/labels";
import { LEAD_STATUSES } from "@/lib/models/lead";
import { makeLead } from "../helpers/leads";

const now = new Date("2026-10-12T12:00:00.000Z");
const recent = "2026-10-10T12:00:00.000Z";

describe("describeSync", () => {
  it("says when lotus confirmed", () => {
    const lead = makeLead({
      createdAt: recent,
      lotusStatus: "synced",
      lotusSyncedAt: "2026-10-11T08:00:00.000Z",
      lotusAttempts: 1,
    });

    expect(describeSync(lead, now)).toBe("transmis le 11/10");
  });

  it("says nothing more for a lead that was never tried", () => {
    expect(describeSync(makeLead({ createdAt: recent }), now)).toBe("en attente");
  });

  it("gives the last failure and the number of attempts of a pending lead", () => {
    const once = makeLead({ createdAt: recent, lotusError: "timeout", lotusAttempts: 1 });
    const twice = makeLead({ createdAt: recent, lotusError: "http_503", lotusAttempts: 2 });

    expect(describeSync(once, now)).toBe("en attente · timeout · 1 essai");
    expect(describeSync(twice, now)).toBe("en attente · http_503 · 2 essais");
  });

  it("gives the code of a refusal", () => {
    const lead = makeLead({
      createdAt: recent,
      lotusStatus: "rejected",
      lotusError: "http_400",
      lotusAttempts: 1,
    });

    expect(describeSync(lead, now)).toBe("refusé · http_400");
  });

  it("says that an old pending lead will not be sent by itself", () => {
    expect(describeSync(makeLead({ createdAt: "2026-07-01T12:00:00.000Z" }), now)).toBe(
      "non transmis · plus de 30 jours",
    );
  });
});

describe("admin labels", () => {
  it("name every status", () => {
    for (const status of LEAD_STATUSES) {
      expect(STATUS_LABELS[status]).not.toBe("");
    }
  });
});
