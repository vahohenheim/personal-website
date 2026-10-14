/** A row of figures: mono label, then the value. */
const PostStatsComponent = ({ items }: { items: [label: string, value: string][] }) => {
  return (
    <dl className="my-4 grid list-none grid-cols-[repeat(auto-fit,minmax(min(132px,100%),1fr))] gap-px overflow-hidden rounded border border-line bg-line">
      {items.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-1 bg-bg p-4">
          <dt className="font-mono text-[12px] text-muted">{label}</dt>
          <dd className="text-[22px] leading-[1.2] font-semibold tracking-[-0.02em] text-text tabular-nums">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default PostStatsComponent;
