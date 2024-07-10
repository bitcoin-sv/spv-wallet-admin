export const NoRecordsText = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
