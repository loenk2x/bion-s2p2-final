// Shell for every page behind the login wall: header with the primary nav,
// the routed page content, the mobile bottom tab bar, and the floating "add
// entry" button. AddEntryModal is mounted here so both entry points — the
// header button and the FAB — open the very same instance.

import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@shared/AuthProvider";
import Icon from "./Icon";
import InitialsAvatar from "./InitialsAvatar";
import AddEntryModal from "./AddEntryModal";

const NAV_ITEMS = [
  { to: "/beranda", label: "Beranda", tabLabel: "Beranda", icon: "home" },
  { to: "/favorit", label: "Favorit", tabLabel: "Favorit", icon: "bookmark" },
  { to: "/catatan", label: "Catatan Harian", tabLabel: "Catatan", icon: "notes" },
  { to: "/profil", label: "Profil", tabLabel: "Profil", icon: "profile" }
];

const linkClass = ({ isActive }) => (isActive ? "on" : undefined);

export default function AppShell() {
  const { user } = useAuth();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div>
      <header className="app-head">
        <div className="wadah">
          <div className="logo">
            <i><Icon name="leaf" size={18} /></i> Healthy Life
          </div>
          <nav className="app-menu">
            {NAV_ITEMS.slice(0, 3).map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="aksi">
            <button type="button" className="tombol t-primer t-kecil" onClick={() => setAddOpen(true)}>
              <Icon name="add" size={16} /> Tambah catatan
            </button>
            <NavLink to="/favorit" className="ikon-bulat" aria-label="Favorit">
              <Icon name="bookmark" size={20} />
            </NavLink>
            <NavLink to="/profil" aria-label="Profil">
              <InitialsAvatar name={user?.name} size={40} />
            </NavLink>
          </div>
        </div>
      </header>

      <main className="app-isi">
        <div className="wadah">
          <Outlet />
        </div>
      </main>

      <nav className="tab-bawah">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <Icon name={item.icon} size={24} />
            {item.tabLabel}
          </NavLink>
        ))}
      </nav>

      <div className="fab-tempel">
        <button type="button" className="fab" aria-label="Tambah catatan" onClick={() => setAddOpen(true)}>
          <Icon name="add" size={26} />
        </button>
      </div>

      {addOpen && (
        <AddEntryModal onClose={() => setAddOpen(false)} onSaved={() => setAddOpen(false)} />
      )}
    </div>
  );
}
