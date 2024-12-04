import { useForm } from "react-hook-form";
import { createServiceAccount } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function AccountForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await createServiceAccount({
        name: data.name,
        type: data.type,
        credentials: {
          username: data.username,
          password: data.password,
        },
        logo: data.logo,
        maxDevices: parseInt(data.maxDevices, 10),
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to create account:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          {...register("name")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          {...register("type")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="netflix">Netflix</option>
          <option value="youtube">YouTube</option>
          <option value="spotify">Spotify</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          {...register("username")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          {...register("password")}
          type="password"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Logo URL</label>
        <input
          {...register("logo")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Max Devices</label>
        <input
          {...register("maxDevices")}
          type="number"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <Button type="submit">Create Account</Button>
    </form>
  );
}