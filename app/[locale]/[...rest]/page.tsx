import { notFound } from 'next/navigation';

/** Sends every unknown URL under a locale to the translated `not-found.tsx`. */
export default function CatchAllPage() {
    notFound();
}
