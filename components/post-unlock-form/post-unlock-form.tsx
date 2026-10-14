"use client";

import { type SyntheticEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Dictionary } from "@/locales/en";

type Texts = Dictionary["posts"]["unlock"];
type ErrorKey = keyof Texts["errors"];

type PostUnlockFormComponentProps = { slug: string; texts: Texts };

/**
 * The password form of a protected post, shown by proxy.ts in place of the post. Sent
 * with `fetch`; on success the page reloads and the proxy now lets the post through.
 */
const PostUnlockFormComponent = ({ slug, texts }: PostUnlockFormComponentProps) => {
  const [password, setPassword] = useState("");
  // Honeypot: hidden from people, so only a bot fills it.
  const [website, setWebsite] = useState("");
  const [isSending, setIsSending] = useState(false);
  // When the form was shown: the server refuses an answer faster than a person can type.
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const report = (error: ErrorKey) => {
    toast.error(texts.errors[error]);
  };

  const submit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("/api/posts/unlock/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password, website, startedAt: startedAt.current }),
      });

      if (!response.ok) {
        report(response.status === 400 ? "invalid_body" : "refused");
        setIsSending(false);

        return;
      }

      // A full load: the cached form must not stand in for the post.
      window.location.reload();
    } catch {
      report("network");
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={(event) => void submit(event)} className="flex max-w-[400px] flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="post-password">{texts.password}</Label>
        <Input
          id="post-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        value={website}
        onChange={(event) => {
          setWebsite(event.target.value);
        }}
      />
      <Button type="submit" disabled={isSending || password === ""} className="self-start">
        {isSending ? texts.sending : texts.submit}
      </Button>
    </form>
  );
};

export default PostUnlockFormComponent;
