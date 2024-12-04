import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { getSubscriptions } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/subscriptions-columns";
import { SubscriptionForm } from "@/components/forms/subscription-form";

export function SubscriptionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  const handleSuccess = () => {
    setIsDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>
      
      <div className="rounded-lg border bg-white">
        <DataTable columns={columns} data={subscriptions || []} isLoading={isLoading} />
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Add Subscription"
      >
        <SubscriptionForm onSuccess={handleSuccess} />
      </Dialog>
    </div>
  );
}