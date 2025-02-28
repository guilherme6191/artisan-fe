function StageIndicator({ stage }: { stage: number }) {
  const bars = [];
  for (let i = 1; i <= 4; i++) {
    bars.push(
      <div
        key={i}
        className={`h-4 w-1 rounded-full ${
          i <= stage ? "bg-purple-500" : "bg-gray-200"
        }`}
      />
    );
  }
  return <div className="flex items-center space-x-1">{bars}</div>;
}

export { StageIndicator };
