const DurationComponent = ({
  startDate,
  endDate,
  duration,
}: {
  startDate: string;
  endDate?: string;
  duration: string;
}) => {
  const content = endDate
    ? `${startDate} - ${endDate} · ${duration}`
    : `${startDate} · ${duration}`;

  return (
    <span
      className="w-[760px] shrink-0 grow-0 self-stretch text-base font-semibold"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default DurationComponent;
