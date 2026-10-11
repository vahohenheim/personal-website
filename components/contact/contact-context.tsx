"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

/** Set in `localStorage` once a message is sent: the home page then shows it. */
const SENT_KEY = "contact-sent-at";
const SENT_EVENT = "contact-sent-change";

type ContactContextValue = {
  open: () => void;
};

export const ContactContext = createContext<ContactContextValue | null>(null);

/** Opens the contact dialog. Only available under `ContactDialogProvider`. */
export const useContactDialog = () => {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error("useContactDialog must be used inside ContactDialogProvider");
  }

  return context;
};

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(SENT_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SENT_EVENT, onChange);
  };
};

const readSent = () => {
  try {
    return window.localStorage.getItem(SENT_KEY) !== null;
  } catch {
    // Storage can be blocked: the site then simply keeps showing the buttons.
    return false;
  }
};

/** Whether this browser has already sent a message. False on the server and until hydration. */
export const useContactSent = () => useSyncExternalStore(subscribe, readSent, () => false);

export const markContactSent = (sent: boolean) => {
  try {
    if (sent) {
      window.localStorage.setItem(SENT_KEY, new Date().toISOString());
    } else {
      window.localStorage.removeItem(SENT_KEY);
    }
  } catch {
    // Nothing to do: the confirmation is a comfort, not a requirement.
  }

  window.dispatchEvent(new Event(SENT_EVENT));
};
