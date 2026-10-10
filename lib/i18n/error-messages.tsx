'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Dictionary } from '@/locales/en';

type ErrorMessages = Dictionary['error'];

const ErrorMessagesContext = createContext<ErrorMessages | null>(null);

/**
 * Hands the translated error texts to `error.tsx`, which is a Client Component
 * and cannot read the dictionary itself.
 */
export const ErrorMessagesProvider = ({ messages, children }: { messages: ErrorMessages; children: ReactNode }) => (
    <ErrorMessagesContext.Provider value={messages}>{children}</ErrorMessagesContext.Provider>
);

export const useErrorMessages = () => useContext(ErrorMessagesContext);
