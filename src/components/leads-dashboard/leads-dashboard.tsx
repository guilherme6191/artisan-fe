"use client";

import { LeadsProvider, useLeads } from "./leads-context";
import { LeadsTable } from "./leads-table";

import { LeadsControls } from "./leads-controls";
import { LeadFormDialog } from "./lead-form-dialog";
import { ConfirmDialog } from "./confirm-dialog";
import { ActiveFilters } from "./active-filters";

function LeadsDashboardContent() {
  const {
    isLeadFormOpen,
    leadToEdit,
    handleCloseLeadForm,
    leadToDelete,
    confirmDeleteLead,
    cancelDeleteLead,
    error,
  } = useLeads();

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leads</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <LeadsControls />
      <ActiveFilters />
      <LeadsTable />

      <LeadFormDialog
        isOpen={isLeadFormOpen}
        onClose={handleCloseLeadForm}
        lead={leadToEdit}
      />

      <ConfirmDialog
        isOpen={!!leadToDelete}
        title="Delete Lead"
        description={`Are you sure you want to delete ${leadToDelete?.name}? This action cannot be undone.`}
        onConfirm={confirmDeleteLead}
        onClose={cancelDeleteLead}
      />
    </div>
  );
}

export function LeadsDashboard() {
  return (
    <LeadsProvider>
      <LeadsDashboardContent />
    </LeadsProvider>
  );
}
