/** List of achievements, each opened by a mono "+" in the accent colour. */
const AchievementListComponent = ({ items }: { items: string[] }) => {
  return (
    <ul className="flex max-w-[64ch] list-none flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] text-text2">
          <span aria-hidden className="font-mono text-accent">
            +
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default AchievementListComponent;
