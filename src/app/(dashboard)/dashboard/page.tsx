'use client';

import { useAuth } from '@/lib/auth/context';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  const { user } = useAuth();
  const memberSince = user?.date_joined
    ? new Date(user.date_joined).toLocaleDateString()
    : 'N/A';

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
          Dashboard
        </p>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
          Welcome back, {user?.first_name} {user?.last_name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">
          Stay focused on your weekly learning goals and keep momentum across
          practical engineering modules.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border border-slate-200 bg-white/90">
          <p className="text-sm text-slate-500">Current Track</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Frontend</p>
        </Card>
        <Card className="rounded-xl border border-slate-200 bg-white/90">
          <p className="text-sm text-slate-500">Progress</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">67%</p>
        </Card>
        <Card className="rounded-xl border border-slate-200 bg-white/90">
          <p className="text-sm text-slate-500">Completed Modules</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">2 / 3</p>
        </Card>
        <Card className="rounded-xl border border-slate-200 bg-white/90">
          <p className="text-sm text-slate-500">Member Since</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {memberSince}
          </p>
        </Card>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-xl border border-slate-200 bg-white/90">
          <h3 className="text-lg font-semibold text-slate-900">
            Your Information
          </h3>
          <div className="mt-4 space-y-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-sm font-medium text-slate-900">{user?.email}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-sm text-slate-500">Full Name</p>
              <p className="text-sm font-medium text-slate-900">
                {user?.first_name} {user?.last_name}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-sm text-slate-500">Member Since</p>
              <p className="text-sm font-medium text-slate-900">{memberSince}</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white/90">
          <h3 className="text-lg font-semibold text-slate-900">Learning Path</h3>
          <p className="mt-2 text-sm text-slate-600">
            Start your journey with our structured training modules.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-center rounded-md bg-emerald-50 p-2 text-emerald-700">
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200 text-xs font-bold">
                OK
              </span>
              Git Workflow
            </li>
            <li className="flex items-center rounded-md bg-emerald-50 p-2 text-emerald-700">
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200 text-xs font-bold">
                OK
              </span>
              API Integration
            </li>
            <li className="flex items-center rounded-md bg-amber-50 p-2 text-amber-700">
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold">
                ...
              </span>
              Testing & CI/CD
            </li>
          </ul>
          <div className="mt-5">
            <div className="h-2 w-full rounded-full bg-slate-200">
              <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
            </div>
          </div>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white/90">
          <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
          <div className="mt-4 space-y-2">
            <button className="w-full rounded-lg bg-primary-100 px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-200">
              View Profile
            </button>
            <button className="w-full rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300">
              Settings
            </button>
            <button className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Continue Learning
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
