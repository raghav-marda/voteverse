import { NavLink } from "react-router-dom";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/simulation", label: "Simulation" },
  { to: "/timeline", label: "Timeline" },
  { to: "/myths", label: "Myths" },
  { to: "/ai-assistant", label: "AI Assistant" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      id="main-nav"
      className="sticky top-0 z-50 bg-surface-secondary/80 backdrop-blur border-b border-white/5"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <NavLink to="/" className="text-lg font-bold tracking-tight" onClick={() => setMenuOpen(false)}>
          <span className="text-accent">Vote</span>Verse
        </NavLink>

        {/* Desktop Links */}
        <ul className="hidden sm:flex gap-6 text-sm font-medium">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "text-accent"
                    : "text-muted hover:text-gray-100 transition-colors duration-200"
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/5 bg-surface-secondary/95 backdrop-blur">
          <ul className="flex flex-col px-6 py-3 gap-1">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2.5 text-sm font-medium transition-colors duration-200 ${
                      isActive ? "text-accent" : "text-muted hover:text-gray-100"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
