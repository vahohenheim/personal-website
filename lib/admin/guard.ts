import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isAdminAuthorized } from "./auth";

// Access check to call in EVERY admin page, route and Server Action, on top of the proxy.
// See docs/features/admin.md.

const hasAdminAccess = async () => isAdminAuthorized((await headers()).get("authorization"));

/** Admin pages: answers "not found" when access is refused. */
export const requireAdmin = async () => {
  if (!(await hasAdminAccess())) {
    notFound();
  }
};

/** Admin Server Actions and routes: throws when access is refused. */
export const assertAdmin = async () => {
  if (!(await hasAdminAccess())) {
    throw new Error("Access denied.");
  }
};
