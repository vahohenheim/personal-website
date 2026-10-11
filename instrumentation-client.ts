import { initBotId } from "botid/client/core";

// Routes protected by Vercel BotID. Each route declared here must call checkBotId() on
// the server (see docs/features/contact-form.md).
initBotId({
  protect: [
    { path: "/api/contact/", method: "POST" },
    { path: "/api/events/", method: "POST" },
  ],
});
