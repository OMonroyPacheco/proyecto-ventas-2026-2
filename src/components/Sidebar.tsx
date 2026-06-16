"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "🏠",
  },
  {
    name: "Clientes",
    href: "/clientes",
    icon: "👥",
  },
  {
    name: "Productos",
    href: "/productos",
    icon: "📦",
  },
  {
    name: "Ventas",
    href: "/ventas",
    icon: "💰",
  },
  {
    name: "Reportes",
    href: "/reportes",
    icon: "📊",
  },
  {
    name: "Portales",
    href: "/portales",
    icon: "🌐",
  },
  {
    name: "SAP",
    href: "/sap",
    icon: "🖥️",
  },
  {
    name: "Configuración",
    href: "/configuracion",
    icon: "⚙",
  },
  {
    name: "Usuarios",
    href: "/usuarios",
    icon: "👤",
    adminOnly: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [user, setUser] = useState<{
    name?: string | null;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }

    loadUser();
  }, []);

  return (
    <aside className="w-72 h-screen bg-[#0f172a] border-r border-slate-800 flex flex-col">

      {/* LOGO */}
      <div className="p-6 border-b border-slate-800 flex flex-col items-center">

        <Image
          src="/images/logo.png"
          alt="Tecnosocks"
          width={180}
          height={180}
          priority
          className="rounded-lg mb-4"
        />

        <h1 className="text-2xl font-bold text-white text-center">
          VENTAS
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Sistema ERP
        </p>

      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-2">

        {menuItems.map((item) => {
          const isAdminOnly = item.adminOnly;
          const isVisible = !isAdminOnly || user?.role === "admin";

          if (!isVisible) return null;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }
              `}
            >
              <span className="text-xl">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* USER */}
      <div className="p-4 border-t border-slate-800">

        <div className="bg-slate-800 rounded-xl p-3">

          <p className="text-white font-medium">
            {user?.name || "Usuario"}
          </p>

          <p className="text-slate-400 text-sm">
            {user?.role === "admin"
              ? "Administrador"
              : "Usuario"}
          </p>

        </div>

      </div>

    </aside>
  );
}