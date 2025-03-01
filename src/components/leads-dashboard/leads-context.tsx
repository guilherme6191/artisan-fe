import React, { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "src/app/hooks/useDebounce";
import { Lead } from "src/app/types";

const SEARCH_DEBOUNCE_TIME = 300;

interface LeadsContextType {
  // State
  searchQuery: string;
  selectedLeads: number[];
  currentPage: number;
  perPage: string;
  stageFilter: string;
  engagementFilter: string;
  sortBy: string;
  leadToDelete: Lead | null;
  isLeadFormOpen: boolean;
  leadToEdit: Lead | null;

  // Query results
  leadsData: Lead[];
  totalLeads: number;
  isLoading: boolean;
  isPending: boolean;
  error: Error | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedLeads: (leads: number[]) => void;
  setCurrentPage: (page: number) => void;
  setPerPage: (perPage: string) => void;
  setStageFilter: (filter: string) => void;
  setEngagementFilter: (filter: string) => void;
  setSortBy: (sortBy: string) => void;
  applyFilters: (filters: {
    stageFilter: string;
    engagementFilter: string;
    sortBy: string;
  }) => void;
  handleSelectAll: (checked: boolean) => void;
  handleSelectLead: (id: number, checked: boolean) => void;
  handleDeleteLead: (lead: Lead) => void;
  confirmDeleteLead: () => void;
  cancelDeleteLead: () => void;
  handleAddLead: () => void;
  handleEditLead: (lead: Lead) => void;
  handleCloseLeadForm: () => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: ReactNode }) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState("10");
  const [stageFilter, setStageFilter] = useState("all");
  const [engagementFilter, setEngagementFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const debounceSeachValue = useDebounce(searchQuery, SEARCH_DEBOUNCE_TIME);
  const queryClient = useQueryClient();

  // Apply filters from component
  const applyFilters = (filters: {
    stageFilter: string;
    engagementFilter: string;
    sortBy: string;
  }) => {
    setStageFilter(filters.stageFilter);
    setEngagementFilter(filters.engagementFilter);
    setSortBy(filters.sortBy);
    setCurrentPage(1);
  };

  // Data fetching
  const { data, isLoading, error } = useQuery<{
    leads: Lead[];
    count: number;
  }>({
    queryKey: [
      "leads",
      currentPage,
      perPage,
      debounceSeachValue,
      stageFilter,
      engagementFilter,
      sortBy,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: perPage,
      });

      if (debounceSeachValue) {
        params.append("search", debounceSeachValue);
      }

      if (stageFilter !== "all") {
        params.append("stage", stageFilter);
      }

      if (engagementFilter !== "all") {
        params.append(
          "engaged",
          engagementFilter === "engaged" ? "true" : "false"
        );
      }

      if (sortBy) {
        params.append("sortBy", sortBy);
      }

      const response = await fetch(`/api/leads?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }
      return response.json();
    },
  });

  const leadsData = data?.leads || [];
  const totalLeads = data?.count || 0;

  // Delete mutation
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
      setSelectedLeads(selectedLeads.filter((id) => id !== leadToDelete?.id));
    },
    onError: (error) => {
      console.error("Error deleting lead:", error);
    },
  });

  const isPending = deleteMutation.isPending;

  // Selection handlers
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

  const handleAddLead = () => {
    setLeadToEdit(null);
    setIsLeadFormOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsLeadFormOpen(true);
  };

  const handleCloseLeadForm = () => {
    setIsLeadFormOpen(false);
    setLeadToEdit(null);
  };

  const handleDeleteLead = (lead: Lead) => {
    setLeadToDelete(lead);
  };

  const confirmDeleteLead = () => {
    if (leadToDelete) {
      deleteMutation.mutate(leadToDelete.id);
    }
  };

  const cancelDeleteLead = () => {
    setLeadToDelete(null);
  };

  const value = {
    // state
    searchQuery,
    selectedLeads,
    currentPage,
    perPage,
    stageFilter,
    engagementFilter,
    sortBy,
    leadToDelete,
    isLeadFormOpen,
    leadToEdit,

    // query results
    leadsData,
    totalLeads,
    isLoading,
    isPending,
    error: error as Error | null,

    // handlers
    setSearchQuery,
    setSelectedLeads,
    setCurrentPage,
    setPerPage,
    setStageFilter,
    setEngagementFilter,
    setSortBy,
    applyFilters,
    handleSelectAll,
    handleSelectLead,
    handleDeleteLead,
    confirmDeleteLead,
    cancelDeleteLead,
    handleAddLead,
    handleEditLead,
    handleCloseLeadForm,
  };

  return (
    <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
}
