import { toast } from "sonner";

type ConfirmToastOptions = {
  message: string;
  onConfirm: () => void;
};

export const confirmToast = ({ message, onConfirm }: ConfirmToastOptions) => {
  toast(message, {
    action: {
      label: "Confirmar",
      onClick: () => {
        requestAnimationFrame(onConfirm);
      },
    },
    cancel: {
      label: "Cancelar",
      onClick: () => {
        // Cancel action - just dismiss
      },
    },
    duration: 5000,
  });
};
