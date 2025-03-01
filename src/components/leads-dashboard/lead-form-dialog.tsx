import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, ChevronDown, X } from "lucide-react";
import { ActionButton } from "src/components/action-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lead } from "src/app/types";

interface LeadFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

export function LeadFormDialog({ isOpen, onClose, lead }: LeadFormDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [stage, setStage] = useState("1");
  const [engaged, setEngaged] = useState(false);
  const [lastContacted, setLastContacted] = useState("");
  const [formError, setFormError] = useState("");

  const queryClient = useQueryClient();
  const isEditing = !!lead;

  // Reset form when dialog opens or lead changes
  useEffect(() => {
    if (isOpen) {
      if (lead) {
        // Editing
        setName(lead.name);
        setEmail(lead.email);
        setCompany(lead.company);
        setStage(lead.stage.toString());
        setEngaged(lead.engaged);
        setLastContacted(lead.lastContacted);
      } else {
        // Creating
        setName("");
        setEmail("");
        setCompany("");
        setStage("1");
        setEngaged(false);
        setLastContacted(new Date().toISOString().split("T")[0]);
      }
      setFormError("");
    }
  }, [isOpen, lead]);

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  const createMutation = useMutation({
    mutationFn: async (newLead: Omit<Lead, "id" | "initials">) => {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLead),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create lead");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      onClose();
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedLead: Partial<Lead> & { id: number }) => {
      const response = await fetch(`/api/leads/${updatedLead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLead),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update lead");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      onClose();
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !company) {
      setFormError("Please fill in all required fields");
      return;
    }

    const leadData = {
      name,
      email,
      company,
      stage: parseInt(stage),
      engaged,
      lastContacted,
      initials: getInitials(name),
    };

    if (isEditing && lead) {
      updateMutation.mutate({ id: lead.id, ...leadData });
    } else {
      createMutation.mutate(leadData as Omit<Lead, "id" | "initials">);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow overflow-y-auto">
          <Dialog.Title className="m-0 text-xl font-medium">
            {isEditing ? "Edit Lead" : "Add New Lead"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="stage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stage
                </label>
                <Select.Root value={stage} onValueChange={setStage}>
                  <Select.Trigger
                    id="stage"
                    className="mt-1 inline-flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
                      <Select.Viewport className="p-1">
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
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div>
                <label
                  htmlFor="lastContacted"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Contacted
                </label>
                <input
                  type="date"
                  id="lastContacted"
                  value={lastContacted}
                  onChange={(e) => setLastContacted(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center">
                <Checkbox.Root
                  id="engaged"
                  checked={engaged}
                  onCheckedChange={(checked) => setEngaged(checked === true)}
                  className="flex h-4 w-4 appearance-none items-center justify-center rounded border border-gray-300 bg-white data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                >
                  <Checkbox.Indicator>
                    <Check className="h-3 w-3 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                  htmlFor="engaged"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Engaged
                </label>
              </div>

              {formError && (
                <div className="text-sm text-red-600">{formError}</div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <ActionButton
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancel
                </ActionButton>
                <ActionButton type="submit" disabled={isPending}>
                  {isPending
                    ? "Saving..."
                    : isEditing
                    ? "Update Lead"
                    : "Add Lead"}
                </ActionButton>
              </div>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full focus:outline-none"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
