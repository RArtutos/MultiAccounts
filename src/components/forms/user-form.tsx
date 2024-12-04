import { useForm } from "react-hook-form";
import { createUser } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function UserForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to create user:", error);
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
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register("email")}
          type="email"
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
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          {...register("role")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <Button type="submit">Create User</Button>
    </form>
  );
}