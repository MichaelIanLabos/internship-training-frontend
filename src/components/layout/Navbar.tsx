'use client';

import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Internship Training
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {user && (
              <>
                <span className="hidden text-sm text-slate-700 sm:inline">
                  {user.first_name} {user.last_name}
                </span>
                <Button
                  variant="secondary"
                  onClick={logout}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
