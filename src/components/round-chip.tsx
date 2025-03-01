import { memo } from "react";

const RoundChip = memo(function RoundChip({ children }: { children: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-bold">
      {children}
    </div>
  );
});

export { RoundChip };
