// src/components/SideMenu.tsx
export function SideMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div className="w-64 h-full bg-white p-6" onClick={e => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-4">Menu</h3>
        <button onClick={onClose} className="text-sm text-red-500">Fermer</button>
      </div>
    </div>
  );
}