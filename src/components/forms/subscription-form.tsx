import { useForm } from "react-hook-form";
import { createSubscription } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function SubscriptionForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await createSubscription({
        userId: data.userId,
        serviceAccountId: data.serviceAccountId,
        startDate: data.startDate,
        endDate: data.endDate,
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to create subscription:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">User ID</label>
        <input
          {...register("userId")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Service Account ID</label>
        <input
          {...register("serviceAccountId")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          {...register("startDate")}
          type="date"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          {...register("endDate")}
          type="date"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <Button type="submit">Create Subscription</Button>
    </form>
  );
}