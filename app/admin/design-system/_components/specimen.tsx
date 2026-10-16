import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type SpecimenMode = "light" | "dark";

const MODES: { id: SpecimenMode; label: string }[] = [
  { id: "light", label: "jour" },
  { id: "dark", label: "nuit" },
];

type SpecimenComponentProps = {
  name: string;
  /** The files it comes from, relative to components/. */
  files: readonly string[];
  /** One mode under the other, for wide components. Side by side otherwise. */
  stack?: boolean;
  /** Called once per mode, so that ids stay unique on the page. */
  render: (mode: SpecimenMode) => ReactNode;
};

/**
 * A component shown in day mode and in night mode, side by side: the `.light` and `.dark`
 * classes of app/globals.css set the eight tokens on each half, whatever the mode of the
 * page. Above, the component's name and its files.
 */
const SpecimenComponent = ({ name, files, stack = false, render }: SpecimenComponentProps) => {
  return (
    <figure className="flex min-w-0 flex-col overflow-hidden rounded border border-line">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line bg-surface px-4 py-2.5 type-meta text-muted">
        <span className="font-medium text-text">{name}</span>
        <span className="[overflow-wrap:anywhere]">{files.join(" · ")}</span>
      </figcaption>
      <div className={cn("grid", !stack && "md:grid-cols-2")}>
        {MODES.map((mode) => (
          <div
            key={mode.id}
            className={cn(mode.id, "flex min-w-0 flex-col gap-4 bg-bg p-5 text-text")}
          >
            <p className="type-meta text-muted">{mode.label}</p>
            {render(mode.id)}
          </div>
        ))}
      </div>
    </figure>
  );
};

export default SpecimenComponent;
