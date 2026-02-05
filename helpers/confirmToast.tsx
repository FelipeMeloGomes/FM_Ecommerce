import toast from "react-hot-toast";

type ConfirmToastOptions = {
  message: string;
  onConfirm: () => void;
};

let activeToastId: string | null = null;

export const confirmToast = ({ message, onConfirm }: ConfirmToastOptions) => {
  if (activeToastId) return; // duplicate prevention

  activeToastId = toast.custom(
    (t) => (
      <div
        className={`flex flex-col gap-3 text-center bg-white shadow-lg rounded-lg p-4 transition-all duration-200 ${
          t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <p className="text-sm font-medium">{message}</p>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              activeToastId = null;
            }}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              toast.dismiss(t.id);
              activeToastId = null;
              requestAnimationFrame(onConfirm);
            }}
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      duration: Infinity,
    },
  );

  return activeToastId;
};
