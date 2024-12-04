import type { ColumnDef } from "@tanstack/react-table";
import type { ActivityLog } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "userId",
    header: "User",
  },
  {
    accessorKey: "serviceAccountId",
    header: "Service",
  },
  {
    accessorKey: "deviceId",
    header: "Device",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => formatDate(row.getValue("timestamp")),
  },
];