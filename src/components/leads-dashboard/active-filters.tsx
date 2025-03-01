import { X } from "lucide-react";
import { useLeads } from "./leads-context";

export function ActiveFilters() {
  const {
    stageFilter,
    engagementFilter,
    sortBy,
    setStageFilter,
    setEngagementFilter,
    setSortBy,
    setCurrentPage,
  } = useLeads();

  if (
    stageFilter === "all" &&
    engagementFilter === "all" &&
    sortBy === "name"
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {stageFilter !== "all" && (
        <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
          <span>Stage: {stageFilter}</span>
          <button
            onClick={() => {
              setStageFilter("all");
              setCurrentPage(1);
            }}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {engagementFilter !== "all" && (
        <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
          <span>
            Engagement:{" "}
            {engagementFilter === "engaged" ? "Engaged" : "Not Engaged"}
          </span>
          <button
            onClick={() => {
              setEngagementFilter("all");
              setCurrentPage(1);
            }}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {sortBy !== "name" && (
        <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
          <span>
            Sorted by:{" "}
            {sortBy === "name"
              ? "Name"
              : sortBy === "company"
              ? "Company"
              : sortBy === "lastContacted"
              ? "Last Contacted"
              : sortBy}
          </span>
          <button
            onClick={() => {
              setSortBy("name");
              setCurrentPage(1);
            }}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <button
        onClick={() => {
          setStageFilter("all");
          setEngagementFilter("all");
          setSortBy("name");
          setCurrentPage(1);
        }}
        className="text-sm text-purple-600 hover:text-purple-800"
      >
        Clear all filters
      </button>
    </div>
  );
}
