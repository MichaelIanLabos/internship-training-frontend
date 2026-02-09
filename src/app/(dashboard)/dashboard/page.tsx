'use client';

import { useAuth } from '@/lib/auth/context';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.first_name} {user?.last_name}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
          <div className="mt-4 space-y-2">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="text-sm font-medium text-gray-900">
                {user?.date_joined
                  ? new Date(user.date_joined).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900">Learning Path</h3>
          <p className="mt-2 text-sm text-gray-600">
            Start your journey with our structured training modules.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="mr-2">✓</span> Git Workflow
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> API Integration
            </li>
            <li className="flex items-center text-gray-400">
              <span className="mr-2">○</span> Testing & CI/CD
            </li>
          </ul>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="mt-4 space-y-2">
            <button className="w-full rounded-md bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-200">
              View Profile
            </button>
            <button className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
              Settings
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
