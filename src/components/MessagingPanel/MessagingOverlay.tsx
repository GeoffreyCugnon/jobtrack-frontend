interface MessagingOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function MessagingOverlay({ open, onClose }: MessagingOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={onClose}
    />
  );
}
