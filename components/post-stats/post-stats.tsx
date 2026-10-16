/**
 * A row of figures: mono label, then the value. Flex rather than grid so that a value
 * never breaks inside (`4,0 → 2,4 s`) and a last, shorter row fills the width. Values sit
 * at the bottom, so they stay aligned when a label wraps.
 */
const PostStatsComponent = ({ items }: { items: [label: string, value: string][] }) => {
  return (
    <dl className="my-4 flex list-none flex-wrap gap-px overflow-hidden rounded border border-line bg-line">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="flex grow basis-[132px] flex-col justify-between gap-1 bg-bg p-4"
        >
          <dt className="type-meta text-muted">{label}</dt>
          <dd className="type-title whitespace-nowrap text-text tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default PostStatsComponent;
