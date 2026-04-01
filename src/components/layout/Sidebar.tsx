'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { NAV_ITEMS } from '@/lib/constants/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="flex w-[250px] flex-shrink-0 flex-col overflow-hidden bg-gradient-to-b from-violet-500 to-violet-400">
      <div className="px-6 pb-4 pt-6">
        <span className="text-lg font-bold tracking-wide text-white drop-shadow-sm">
          HR System
        </span>
      </div>

      <nav className="mt-1 flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-white/25 font-medium text-white shadow-sm backdrop-blur-sm'
                  : 'text-white/70 hover:bg-white/15 hover:text-white'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white/30 shadow-sm'
                    : 'bg-white/10'
                }`}
              >
                <Icon className="h-[16px] w-[16px]" />
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/60 transition-all duration-200 hover:bg-white/15 hover:text-white"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <LogOut className="h-[16px] w-[16px]" />
          </div>
          Logout
        </button>
      </div>
    </aside>
  );
}
