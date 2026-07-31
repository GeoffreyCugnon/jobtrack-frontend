import { useToastStore, type ToastType } from "../../store/toast.store";


const alertClass: Record<ToastType, string> = {
  success: "alert-success",
  error: "alert-error",
  info: "alert-info",
  warning: "alert-warning",
};

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast toast-end toast-bottom z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert ${alertClass[toast.type]} cursor-pointer shadow-lg`}
          onClick={() => removeToast(toast.id)}
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
