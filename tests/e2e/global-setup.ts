import { E2E } from "./settings";
import { startLotusStub } from "../smoke/lotus-stub";

// The stand-in for lotus, started before the site so that a lead sent from the browser
// is forwarded somewhere real, and never to the production lotus.
export default async function globalSetup() {
  const lotus = await startLotusStub(E2E.lotusPort, E2E.lotusSecret);

  return () => {
    lotus.close();
  };
}
