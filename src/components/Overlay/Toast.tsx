import { useEffect, useLayoutEffect, useRef } from "react";
import {
  useToastStore,
  TOAST_HIDE_DURATION,
  type ToastType,
} from "../../store/toast.store";
import { STACK_ITEM_GAP } from "../../constants/layout";

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
  const bottomBarHeight = useToastStore((state) => state.bottomBarHeight);
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
      // Remonté au-dessus de la barre fixe en bas d'écran (nav mobile, ou le
      // CTA de `GuestHome` qui la remplace) pour ne pas la masquer.
      style={{ bottom: bottomBarHeight + STACK_ITEM_GAP, top: "auto" }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert ${alertClass[toast.type]} cursor-pointer shadow-lg transition-all ease-in ${
            toast.hiding ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          style={{ transitionDuration: `${TOAST_HIDE_DURATION}ms` }}
          onClick={() => removeToast(toast.id)}
        >
          <span className="text-white">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
