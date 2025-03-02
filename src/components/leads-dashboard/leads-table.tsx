import * as Checkbox from "@radix-ui/react-checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { StageIndicator } from "src/components/stage-indicator";
import { EngagementBadge } from "src/components/engagement-badge";
import { RoundChip } from "src/components/round-chip";

import { useLeads } from "./leads-context";
import Skeleton from "./skeleton";

export function LeadsTable() {
  const {
    leadsData,
    totalLeads,
    currentPage,
    perPage,
    selectedLeads,
    isLoading,
    isPending,
    handleSelectAll,
    handleSelectLead,
    setCurrentPage,
    handleEditLead,
    handleDeleteLead,
    setPerPage,
  } = useLeads();

  const leadsPerPage = Number.parseInt(perPage);
  const totalPages = Math.ceil(totalLeads / leadsPerPage);
  const startItem = (currentPage - 1) * leadsPerPage + 1;
  const endItem = Math.min(currentPage * leadsPerPage, totalLeads);

  return (
    <>
      <div className="text-sm text-gray-500 mb-2">
        Showing {startItem}-{endItem} of {totalLeads} leads
      </div>

      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th scope="col" className="w-12 px-4 py-3 text-left">
                {isLoading || isPending ? (
                  <div className="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
                ) : (
                  <Checkbox.Root
                    className="flex h-4 w-4 appearance-none items-center justify-center rounded border border-gray-300 bg-white data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    checked={
                      selectedLeads.length === leadsData.length &&
                      leadsData.length > 0
                    }
                    onCheckedChange={(checked) =>
                      handleSelectAll(checked === true)
                    }
                    id="select-all"
                  >
                    <Checkbox.Indicator>
                      <Check className="h-3 w-3 text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                )}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Company
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Stage
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Engagement
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Last Contacted
              </th>
              <th scope="col" className="relative px-4 py-3 w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: leadsPerPage }).map((_, i) => (
                  <Skeleton.Row key={i} />
                ))
              : leadsData.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      {isPending ? (
                        <div className="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
                      ) : (
                        <Checkbox.Root
                          className="flex h-4 w-4 appearance-none items-center justify-center rounded border border-gray-300 bg-white data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={(checked) =>
                            handleSelectLead(lead.id, checked === true)
                          }
                          id={`select-${lead.id}`}
                        >
                          <Checkbox.Indicator>
                            <Check className="h-3 w-3 text-white" />
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <RoundChip>{lead.initials}</RoundChip>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        {lead.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <StageIndicator stage={lead.stage} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <EngagementBadge engaged={lead.engaged} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-500">
                      {lead.lastContacted
                        ? new Date(lead.lastContacted).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              timeZone: "UTC",
                            }
                          )
                        : "-"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md"
                            sideOffset={5}
                            align="end"
                          >
                            <DropdownMenu.Item
                              className="flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              onClick={() => handleEditLead(lead)}
                            >
                              Edit Lead
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              className="flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none focus:bg-gray-100 text-red-600 focus:text-red-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              onClick={() => handleDeleteLead(lead)}
                            >
                              Delete Lead
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
                  <span>{perPage} per page</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md"
                  sideOffset={5}
                  align="start"
                >
                  {["10", "20", "50"].map((option) => (
                    <DropdownMenu.Item
                      key={option}
                      className="flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      onClick={() => {
                        setPerPage(option);
                        setCurrentPage(1); // Reset to first page when changing items per page
                      }}
                    >
                      <Check
                        className={`h-4 w-4 mr-2 ${
                          perPage === option ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span>{option} per page</span>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          <div className="flex items-center space-x-1">
            <button
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            </button>

            <div className="hidden sm:flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    className={`w-8 h-8 text-sm rounded-md ${
                      currentPage === pageNumber
                        ? "bg-purple-100 text-purple-600 font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <>
                  <span className="text-gray-500">...</span>
                  <button
                    className="w-8 h-8 text-sm rounded-md hover:bg-gray-100 text-gray-700"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <div className="sm:hidden">
              <span className="text-sm text-gray-500 mx-2">
                {currentPage} / {totalPages}
              </span>
            </div>

            <button
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="hidden md:block" />
        </div>
      </div>
    </>
  );
}
