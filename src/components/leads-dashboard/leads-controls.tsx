import { Search } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import * as Select from "@radix-ui/react-select";
import { ActionButton } from "src/components/action-button";
import { ListFilter, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { useLeads } from "./leads-context";
import { Plus, Download } from "lucide-react";
import { STAGES } from "src/utils/constants";
import { useState, useEffect } from "react";
import { useDebounce } from "src/app/hooks/useDebounce";

export function LeadsControls() {
  const {
    leadsData,
    stageFilter,
    engagementFilter,
    sortBy,
    applyFilters,
    searchQuery,
    setSearchQuery,
    handleAddLead,
  } = useLeads();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localStageFilter, setLocalStageFilter] = useState(stageFilter);
  const [localEngagementFilter, setLocalEngagementFilter] =
    useState(engagementFilter);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  useEffect(() => {
    setLocalStageFilter(stageFilter);
    setLocalEngagementFilter(engagementFilter);
    setLocalSortBy(sortBy);
  }, [stageFilter, engagementFilter, sortBy]);

  const clearAllFilters = () => {
    setLocalStageFilter("all");
    setLocalEngagementFilter("all");
    setLocalSortBy("name");

    applyFilters({
      stageFilter: "all",
      engagementFilter: "all",
      sortBy: "name",
    });
    setIsFilterOpen(false);
  };

  const handleApplyFilters = () => {
    applyFilters({
      stageFilter: localStageFilter,
      engagementFilter: localEngagementFilter,
      sortBy: localSortBy,
    });
    setIsFilterOpen(false);
  };

  const handleFilterOpen = (open: boolean) => {
    setIsFilterOpen(open);
  };

  const exportToCSV = () => {
    const visibleLeads = leadsData;

    const headers = [
      "ID",
      "Name",
      "Email",
      "Company",
      "Stage",
      "Engaged",
      "Last Contacted",
      "Initials",
    ];

    const csvRows = [
      headers.join(","),
      ...visibleLeads.map((lead) =>
        [
          lead.id,
          `"${lead.name.replace(/"/g, '""')}"`,
          `"${lead.email.replace(/"/g, '""')}"`,
          `"${lead.company.replace(/"/g, '""')}"`,
          lead.stage,
          lead.engaged ? "Yes" : "No",
          lead.lastContacted,
          lead.initials,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `leads-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();

    // clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mb-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <ActionButton
            variant="secondary"
            onClick={handleAddLead}
            className="flex-1 sm:flex-initial justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="sm:inline">Add Lead</span>
          </ActionButton>
          <ActionButton
            className="flex-1 sm:flex-initial justify-center"
            onClick={exportToCSV}
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="sm:inline">Export</span>
          </ActionButton>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            defaultValue={searchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
          />
        </div>
        <Popover.Root open={isFilterOpen} onOpenChange={handleFilterOpen}>
          <Popover.Trigger asChild>
            <ActionButton
              variant="secondary"
              className="whitespace-nowrap w-full sm:w-auto justify-center"
            >
              <ListFilter className="h-4 w-4 mr-2" />
              Filter & Sort
            </ActionButton>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="w-[calc(100vw-32px)] sm:w-80 rounded-md border border-gray-200 bg-white p-4 shadow-md"
              sideOffset={5}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Filter by Stage</h4>
                  <Select.Root
                    value={localStageFilter}
                    onValueChange={setLocalStageFilter}
                  >
                    <Select.Trigger className="inline-flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm w-full">
                      <Select.Value placeholder="All Stages" />
                      <Select.Icon>
                        <ChevronDown className="h-4 w-4" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                          <ChevronUp className="h-4 w-4" />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                          <Select.Item
                            value="all"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>All Stages</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                          {STAGES.map((stage) => (
                            <Select.Item
                              key={stage}
                              value={stage.toString()}
                              className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            >
                              <Select.ItemText>Stage {stage}</Select.ItemText>
                              <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                                <Check className="h-4 w-4" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                          <ChevronDown className="h-4 w-4" />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Filter by Engagement</h4>
                  <Select.Root
                    value={localEngagementFilter}
                    onValueChange={setLocalEngagementFilter}
                  >
                    <Select.Trigger className="inline-flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm w-full">
                      <Select.Value placeholder="All" />
                      <Select.Icon>
                        <ChevronDown className="h-4 w-4" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          <Select.Item
                            value="all"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>All</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            value="engaged"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>Engaged</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            value="not-engaged"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>Not Engaged</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                {/* Sort by */}
                <div className="space-y-2">
                  <h4 className="font-medium">Sort by</h4>
                  <Select.Root
                    value={localSortBy}
                    onValueChange={setLocalSortBy}
                  >
                    <Select.Trigger className="inline-flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm w-full">
                      <Select.Value placeholder="Last Contacted" />
                      <Select.Icon>
                        <ChevronDown className="h-4 w-4" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          <Select.Item
                            value="stage"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>Stage</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            value="name"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>Name</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            value="company"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>Company</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div className="flex justify-end">
                  <ActionButton
                    variant="secondary"
                    onClick={clearAllFilters}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    Clear all filters
                  </ActionButton>
                  <ActionButton
                    variant="primary"
                    className="text-sm font-medium ml-2"
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </ActionButton>
                </div>
              </div>
              <Popover.Arrow className="fill-white" />
              <Popover.Close className="absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring focus-visible:ring-purple-500">
                <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </Popover.Close>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}
