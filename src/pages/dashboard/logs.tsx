import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/logs-columns";

export function LogsPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: getActivityLogs,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
      
      <div className="rounded-lg border bg-white">
        <DataTable columns={columns} data={logs || []} isLoading={isLoading} />
      </div>
    </div>
  );
}