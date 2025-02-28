function RoundChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-bold">
      {children}
    </div>
  );
}

export { RoundChip };
