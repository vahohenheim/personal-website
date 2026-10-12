import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/events/route";
import { getFunnelStore } from "@/lib/funnel/store";
import { jsonRequest } from "../helpers/leads";

const URL = "http://localhost/api/events/";

describe("POST /api/events/", () => {
  it("counts a known event and answers nothing", async () => {
    const response = await POST(jsonRequest(URL, { event: "contact_open" }));

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(await getFunnelStore().totals(null)).toMatchObject({ contact_open: 1 });
  });

  it.each([[{ event: "something_else" }], [{}], ["not json"], [[1]], [null]])(
    "answers the same and counts nothing for %j",
    async (body) => {
      // A body that is not JSON is logged by its error name only.
      vi.spyOn(console, "error").mockImplementation(() => undefined);
      const response = await POST(jsonRequest(URL, body));

      expect(response.status).toBe(204);
      expect(Object.values(await getFunnelStore().totals(null))).toEqual([0, 0, 0, 0]);
    },
  );
});
