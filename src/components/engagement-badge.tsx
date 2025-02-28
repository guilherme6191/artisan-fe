function EngagementBadge({ engaged }: { engaged: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        engaged ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
      }`}
    >
      <span
        className={`mr-1.5 h-2 w-2 rounded-full ${
          engaged ? "bg-green-500" : "bg-gray-500"
        }`}
      ></span>
      {engaged ? "Engaged" : "Not Engaged"}
    </span>
  );
}

export { EngagementBadge };
