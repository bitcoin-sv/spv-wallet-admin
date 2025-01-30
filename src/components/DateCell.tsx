interface DateCellProps {
  date?: string | number | Date | null;
}

export function DateCell({ date }: DateCellProps) {
  if (!date) {
    return <span className="text-gray-400">N/A</span>;
 }

  const formattedDate = new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(new Date(date));

  return <span>{formattedDate}</span>;
}
