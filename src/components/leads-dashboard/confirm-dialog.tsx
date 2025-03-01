import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ActionButton } from "../action-button";
import { ComponentProps } from "react";

export function ConfirmDialog({
  isOpen,
  title,
  description = "Are you sure you want to delete this lead?",
  onConfirm,
  onClose,
  isPending,
}: {
  isOpen: boolean;
  isPending?: boolean;
  title: string;
  description?: string;
  onConfirm: ComponentProps<typeof ActionButton>["onClick"];
  onClose: () => void;
}) {
  return (
    <AlertDialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg z-50 w-[400px] max-w-[90vw]">
          <AlertDialog.Title className="text-xl font-semibold mb-2">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-gray-600 mb-4">
            {description}
          </AlertDialog.Description>
          <div className="flex gap-3 mt-4 justify-end">
            <AlertDialog.Cancel asChild>
              <ActionButton
                variant="secondary"
                onClick={() => onClose()}
                disabled={isPending}
                loading={isPending}
              >
                Cancel
              </ActionButton>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <ActionButton
                variant="primary"
                className="bg-red-700 hover:bg-red-500 ring-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  onConfirm?.(e);
                }}
                disabled={isPending}
                loading={isPending}
              >
                Delete
              </ActionButton>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
