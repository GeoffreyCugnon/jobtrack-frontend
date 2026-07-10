// Header.tsx
import { Link } from "react-router";
import { useState } from "react";
import Sidebar from "./SideMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="flex justify-between items-center p-5 bg-bg-main border-b border-bg-card">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg border border-bg-card px-4 py-2 text-txt-body hover:bg-bg-card transition-colors"
        >
          ☰ Menu
        </button>

        <Link to="/profil">
          <button className="rounded-full border border-bg-card px-4 py-2 text-txt-body hover:bg-bg-card transition-colors">
            Profil
          </button>
        </Link>
      </nav>

      <Sidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}