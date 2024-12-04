import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Subscription } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "userId",
    header: "User",
  },
  {
    accessorKey: "serviceAccountId",
    header: "Service",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.getValue("startDate")),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => formatDate(row.getValue("endDate")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
          row.getValue("status") === "active"
            ? "bg-green-100 text-green-800"
            : row.getValue("status") === "expired"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {row.getValue("status")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];