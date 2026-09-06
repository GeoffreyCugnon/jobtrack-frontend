import { useEffect, useLayoutEffect, useRef } from "react";
import { useToastStore, type ToastType } from "../../store/toast.store";
import { STACK_BOTTOM_OFFSET } from "../../constants/layout";

const alertClass: Record<ToastType, string> = {
  success: "alert-success",
  error: "alert-error",
  info: "alert-info",
  warning: "alert-warning",
};

export default function Toast() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  const setStackHeight = useToastStore((state) => state.setStackHeight);
  const containerRef = useRef<HTMLDivElement>(null);

  // Publie la hauteur réelle de la pile pour que le bouton messagerie se cale
  // juste au-dessus (cf. toast.store#stackHeight).
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) {
      setStackHeight(0);
      return;
    }
    const publish = () => setStackHeight(el.offsetHeight);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, [toasts.length, setStackHeight]);

  useEffect(() => () => setStackHeight(0), [setStackHeight]);

  if (toasts.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="toast toast-end toast-bottom z-50"
      // Remonté au-dessus de la barre de nav mobile (même niveau que le
      // bouton flottant messagerie) pour ne pas masquer le menu.
      style={{ bottom: STACK_BOTTOM_OFFSET, top: "auto" }}
    >
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
