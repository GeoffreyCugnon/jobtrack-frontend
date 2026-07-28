import { Search } from 'lucide-react';

type Props = { value: string; onChange: (value: string) => void };

export function RelationsSearchInput({ value, onChange }: Props) {
  return (
    <>
      <label className="input input-bordered flex items-center gap-2 mb-4 w-full">
        <Search size={16} className="opacity-50" />
        <input
          type="text"
          className="grow"
          placeholder="Filtrer par nom..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </>
  );
}