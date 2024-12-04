import { useQuery } from "@tanstack/react-query";
import { Activity, Users, Monitor } from "lucide-react";
import { fetchDashboardStats } from "@/lib/api";

export function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <Users className="h-6 w-6 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats?.totalUsers ?? 0}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <Monitor className="h-6 w-6 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Active Devices</p>
              <p className="text-2xl font-bold">{stats?.activeDevices ?? 0}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <Activity className="h-6 w-6 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Active Subscriptions</p>
              <p className="text-2xl font-bold">{stats?.activeSubscriptions ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}