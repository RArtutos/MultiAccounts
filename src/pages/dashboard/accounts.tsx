import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServiceAccounts } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/accounts-columns";

export function AccountsPage() {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["service-accounts"],
    queryFn: getServiceAccounts,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Service Accounts</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>
      
      <div className="rounded-lg border bg-white">
        <DataTable columns={columns} data={accounts || []} isLoading={isLoading} />
      </div>
    </div>
  );
}