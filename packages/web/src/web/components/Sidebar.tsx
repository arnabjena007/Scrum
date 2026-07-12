import { Link, useLocation } from "wouter";
import { LayoutDashboard, Columns3, Clock, Plus, PanelLeftClose, PanelLeftOpen, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

const nav = [
  { href: "/app",          icon: LayoutDashboard, label: "Dashboard" },
  { href: "/app/board",    icon: Columns3,        label: "Board"     },
  { href: "/app/timeline", icon: Clock,           label: "Timeline"  },
];

interface Props {
  onNewTask?: () => void;
  collapsed: boolean;
  onToggle: () => void;
  darkMode: boolean;
  onThemeToggle: () => void;
}

export default function Sidebar({ onNewTask, collapsed, onToggle, darkMode, onThemeToggle }: Props) {
  const [location] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const avatar = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? "";
  const name   = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "User";
  const email  = user?.email ?? "";
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <aside
      className={cn(
        "app-sidebar relative flex flex-col h-screen flex-shrink-0 bg-[#fafaf8] border-r border-zinc-200 transition-all duration-200",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      <button
        onClick={onToggle}
        className="sidebar-edge-toggle absolute top-5 -right-4 z-50 flex h-8 w-8 items-center justify-center border border-zinc-200 bg-white text-zinc-500 shadow-sm hover:text-black hover:border-zinc-400 transition-colors"
        title={collapsed ? "Open sidebar" : "Close sidebar"}
        aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* Wordmark / toggle row */}
      <div className={cn(
        "flex items-center border-b border-zinc-200 flex-shrink-0",
        collapsed ? "justify-center px-0 pt-4 pb-4" : "justify-start px-3 pt-4 pb-3"
      )}>
        {!collapsed && (
          <Link href="/app" className="flex items-center" style={{ gap: "1px" }} aria-label="Go to dashboard">
            {["S", "C", "R", "U", "M"].map((l) => (
              <img key={l} src={`/logo/${l}.png?v=9`} className="h-7 w-auto" alt={l} />
            ))}
          </Link>
        )}
        {collapsed && (
          <Link href="/app" className="font-nav text-lg" aria-label="Go to dashboard">
            S
          </Link>
        )}
      </div>

      {/* New Task */}
      <div className={cn("py-3", collapsed ? "px-2" : "px-4")}>
        {collapsed ? (
          <button
            onClick={onNewTask}
            className="w-full flex items-center justify-center p-2 bg-black text-white hover:bg-zinc-800 transition-colors"
            title="New Task"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        ) : (
          <Button onClick={onNewTask} size="sm" className="w-full gap-1.5">
            <Plus size={13} strokeWidth={2.5} />
            New Task
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 space-y-0.5", collapsed ? "px-2" : "px-3")}>
        {nav.map(({ href, icon: Icon, label }) => {
          const active = location === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center cursor-pointer transition-colors",
                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2",
                "font-nav",
                active
                  ? "bg-black text-white"
                  : "text-zinc-500 hover:text-black hover:bg-zinc-100"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={14} strokeWidth={active ? 2.5 : 1.75} />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Profile avatar + dropdown */}
      <div
        ref={dropdownRef}
        className={cn("border-t border-zinc-200 relative", collapsed ? "px-2 py-3 flex flex-col items-center gap-2" : "px-3 py-3")}
      >
        {/* Dropdown */}
        {open && (
          <div className={cn(
            "absolute bottom-full mb-2 bg-white border border-zinc-200 shadow-lg z-50",
            collapsed ? "left-12 w-52" : "left-4 right-4"
          )}>
            {/* User info */}
            <div className="px-4 py-3 border-b border-zinc-100">
              <p className="font-nav text-[13px] text-zinc-900 truncate">{name}</p>
              <p className="text-xs text-zinc-400 truncate mt-0.5">{email}</p>
            </div>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 font-nav text-[13px] text-zinc-600 hover:text-black hover:bg-zinc-50 transition-colors"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        )}

        <div className={cn("profile-controls flex items-center gap-2", collapsed && "flex-col")}>
          <button
            onClick={() => setOpen(v => !v)}
            className={cn(
              "profile-button flex items-center gap-2.5 min-w-0 flex-1 group px-2 py-2",
              collapsed && "justify-center p-1.5"
            )}
            title={collapsed ? name : undefined}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-zinc-200">
              {avatar
                ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">{initials}</span>
                  </div>
              }
            </div>
            {!collapsed && (
              <p className="font-nav text-base text-zinc-700 truncate group-hover:text-black transition-colors">{name}</p>
            )}
          </button>

          <button
            onClick={onThemeToggle}
            className="theme-toggle flex h-10 w-10 flex-shrink-0 items-center justify-center border border-zinc-200 text-zinc-500 hover:text-black hover:border-zinc-400 transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
