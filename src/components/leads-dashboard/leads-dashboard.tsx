"use client";

import { useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";
import * as Popover from "@radix-ui/react-popover";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  ListFilter,
  MoreVertical,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "src/app/hooks/useDebounce";
import { Button } from "src/components/button";
import { RoundChip } from "src/components/round-chip";
import { StageIndicator } from "src/components/stage-indicator";
import { EngagementBadge } from "src/components/engagement-badge";
import { SkeletonRow } from "./skeleton-row";
import { ConfirmDialog } from "./confirm-dialog";

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  stage: number;
  engaged: boolean;
  lastContacted: string;
  initials: string;
}

const SEARCH_DEBOUNCE_TIME = 300;

export function LeadsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState("10");
  const debounceSeachValue = useDebounce(searchQuery, SEARCH_DEBOUNCE_TIME);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Add QueryClient
  const queryClient = useQueryClient();

  // Fetch leads data using React Query
  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery<{
    leads: Lead[];
    count: number;
  }>({
    queryKey: ["leads", currentPage, perPage, debounceSeachValue],
    queryFn: async () => {
      const response = await fetch(
        `/api/leads?page=${currentPage}&pageSize=${perPage}${
          debounceSeachValue
            ? `&search=${encodeURIComponent(debounceSeachValue)}`
            : ""
        }`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }
      return response.json();
    },
  });

  const leadsData = data?.leads || [];
  const totalLeads = data?.count || 0;
  const leadsPerPage = Number.parseInt(perPage);
  const totalPages = Math.ceil(totalLeads / leadsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(leadsData.map((lead) => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, id]);
    } else {
      setSelectedLeads(selectedLeads.filter((leadId) => leadId !== id));
    }
  };

  // Update the pagination display text
  const startItem = (currentPage - 1) * leadsPerPage + 1;
  const endItem = Math.min(currentPage * leadsPerPage, totalLeads);

  // Add delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (leadId: number) => {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete lead");
      }

      return leadId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setLeadToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting lead:", error);
    },
  });

  const isPending = deleteMutation.isPending;

  if (queryError || deleteMutation.error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leads</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">
            {queryError?.message || deleteMutation.error?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by lead's name"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Popover.Root>
          <Popover.Trigger asChild>
            <Button variant="secondary" className="ml-2 whitespace-nowrap">
              <ListFilter className="h-4 w-4 mr-2" />
              Filter & Sort
            </Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="w-80 rounded-md border border-gray-200 bg-white p-4 shadow-md"
              sideOffset={5}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Filter by Stage</h4>
                  <Select.Root>
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
                          <Select.Item
                            value="1"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>Stage 1</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            value="2"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>Stage 2</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            value="3"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>Stage 3</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            value="4"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>Stage 4</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
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
                  <Select.Root>
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
                <div className="space-y-2">
                  <h4 className="font-medium">Sort by</h4>
                  <Select.Root>
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
                            value="last-contacted"
                            className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <Select.ItemText>Last Contacted</Select.ItemText>
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
                  <Button variant="primary" className="text-sm font-medium">
                    Apply Filters
                  </Button>
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

      <div className="text-sm text-gray-500 mb-2">
        Showing {startItem}-{endItem} of {totalLeads} leads
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th scope="col" className="w-12 px-6 py-3 text-left">
                <Checkbox.Root
                  className="flex h-4 w-4 appearance-none items-center justify-center rounded border border-gray-300 bg-white data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  checked={selectedLeads.length === leadsData.length}
                  onCheckedChange={(checked) =>
                    handleSelectAll(checked === true)
                  }
                  id="select-all"
                >
                  <Checkbox.Indicator>
                    <Check className="h-3 w-3 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Company
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stage
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Engaged
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Contacted
              </th>
              <th
                scope="col"
                className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: leadsPerPage }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              : leadsData.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <RoundChip>{lead.initials}</RoundChip>
                        <div>
                          <div className="font-medium text-gray-900">
                            {lead.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StageIndicator stage={lead.stage} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EngagementBadge engaged={lead.engaged} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.lastContacted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="inline-flex items-center justify-center rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="min-w-[180px] rounded-md bg-white p-1 shadow-md border border-gray-200"
                            sideOffset={5}
                            align="end"
                          >
                            <DropdownMenu.Item className="flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                              Edit Lead
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
                            <DropdownMenu.Item
                              className="flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600"
                              onClick={() => setLeadToDelete(lead)}
                            >
                              Delete
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
          <Select.Root value={perPage} onValueChange={setPerPage}>
            <Select.Trigger className="inline-flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm w-[120px]">
              <Select.Value placeholder="10 per page" />
              <Select.Icon>
                <ChevronDown className="h-4 w-4" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
                <Select.Viewport className="p-1">
                  <Select.Item
                    value="10"
                    className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <Select.ItemText>10 per page</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item
                    value="20"
                    className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <Select.ItemText>20 per page</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item
                    value="50"
                    className="relative flex items-center h-8 px-6 py-2 text-sm rounded-md cursor-default select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <Select.ItemText>50 per page</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <nav className="flex items-center space-x-1">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm ${
                  currentPage === i + 1
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {totalPages > 5 && (
              <>
                <span className="text-gray-500">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm ${
                    currentPage === totalPages
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </button>
          </nav>
          <div />
        </div>
      </div>
      {leadToDelete && (
        <ConfirmDialog
          isOpen={!!leadToDelete}
          isPending={isPending}
          title={`Delete Lead ${leadToDelete.name}`}
          onClose={() => setLeadToDelete(null)}
          onConfirm={() => {
            deleteMutation.mutate(leadToDelete.id);
          }}
        />
      )}
    </div>
  );
}
