import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { getServiceAccounts } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/accounts-columns";
import { AccountForm } from "@/components/forms/account-form";

export function AccountsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["service-accounts"],
    queryFn: getServiceAccounts,
  });

  const handleSuccess = () => {
    setIsDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["service-accounts"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Service Accounts</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>
      
      <div className="rounded-lg border bg-white">
        <DataTable columns={columns} data={accounts || []} isLoading={isLoading} />
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Add Service Account"
      >
        <AccountForm onSuccess={handleSuccess} />
      </Dialog>
    </div>
  );
}