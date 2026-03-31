'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { Sidebar } from '@/components/layout/Sidebar';

function getBreadcrumb(pathname: string): { section: string; page: string } {
  if (pathname === '/employees') return { section: 'Employees', page: 'Management' };
  if (pathname === '/employee-list') return { section: 'Movement', page: 'Requests' };
  if (pathname.startsWith('/employee-list/')) return { section: 'Movement', page: 'Request Details' };
  return { section: '', page: '' };
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();

  const initials = user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
    : '';

  const breadcrumb = getBreadcrumb(pathname);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between bg-gray-50 px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{breadcrumb.section}</span>
            <span>/</span>
            <span className="font-medium text-gray-800">{breadcrumb.page}</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
            {initials}
          </div>
        </header>
        <main className="flex-1 bg-gray-50 p-8">{children}</main>
      </div>
    </div>
  );
}
