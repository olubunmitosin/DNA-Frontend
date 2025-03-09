import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

import { SampleDetailsSheet } from "@/components/sheets/sample-details-sheet";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { sampleStatuses } from "@/constants";
import { cn, formatDateUtil } from "@/lib/utils";
import { SamplesDatum } from "@/types";
import { StatusType, TestType } from "@/types/data.types";

import { DataTableColumnHeader } from "../_components/data-table-column-header";
export type SampleManagementColumn = {
  id: number;
  sampleId: string;
  testType: TestType;
  status: StatusType;
  pickup_date: Date;
  pickup_time: string;
};

export type SubmittedSamplesColumnType = {
  id: number;
  sampleId: string;
  testType: TestType;
  status: StatusType;
};

export const SubmittedSamplesColumn: ColumnDef<SamplesDatum>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="-ml-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:border-light-400 xl:ml-0"
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select All"
      />
    ),
    enableResizing: true,
    // size: 200,
    // minSize: 50,
    cell: ({ row }) => (
      <div className="">
        <Checkbox
          className="-ml-2 mr-4 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:border-light-400 xl:mx-0"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sampleId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample ID" />
    ),
    enableResizing: true,
    cell: ({ row }) => {
      const sample = row.original;

      return (
        <p className="text-sm font-normal text-[#56636A]">{sample.sampleId}</p>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "testType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type of Test" />
    ),
    enableResizing: true,
    cell: ({ row }) => {
      const sample = row.original;

      return (
        <p className="text-sm font-normal capitalize text-[#56636A]">
          {sample.test_performed}
        </p>
      );
    },
    enableSorting: true,
    enableHiding: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    enableResizing: true,
    cell: ({ row }) => {
      const status = sampleStatuses.find(
        (status) => status.name === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <span
          className={cn(
            "border text-xs font-normal font-poppins border-[#EDE8EF] dark:light-border-2 rounded-[24px] py-1 px-[9px]",
            status.value === "Active" && "bg-[#53BD9033] text-[#53BD90]",
            status.value === "Processing" && "bg-[#3A88C026] text-[#262D31]"
          )}
        >
          {status.name}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    id: "actions",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: ({ row }) => {
      // const sample = row.original;
      return <EllipsisVertical className="size-4 text-sm text-[#56636A]" />;
    },
  },
];
export const SamplesManagementColumn: ColumnDef<SamplesDatum>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="-ml-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:border-light-400 xl:ml-0"
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select All"
      />
    ),
    enableResizing: true,
    // size: 200,
    // minSize: 50,
    cell: ({ row }) => (
      <div className="">
        <Checkbox
          className="-ml-2 mr-4 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:border-light-400 xl:mx-0"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sampleId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample ID" />
    ),
    enableResizing: true,
    cell: ({ row }) => {
      const sample = row.original;

      return (
        <p className="text-sm font-normal text-[#56636A]">{sample.sampleId}</p>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "testType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type of Test" />
    ),
    enableResizing: true,
    cell: ({ row }) => {
      const sample = row.original;

      return (
        <p className="text-sm font-normal capitalize text-[#56636A]">
          {sample.test_performed}
        </p>
      );
    },
    enableSorting: true,
    enableHiding: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "timeSlot",
    header: "Time Slot",
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <Badge className="font-poppin flex  w-[120px] items-center gap-2 border-none bg-transparent p-0 text-xs font-normal text-[#2A0C31] shadow-none outline-none hover:bg-transparent dark:bg-transparent dark:text-light-400 dark:hover:bg-transparent">
          {formatDateUtil(new Date(transaction.pickup_date!))}-
          {transaction.pickup_time}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    enableResizing: true,
    cell: ({ row }) => {
      const status = sampleStatuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <span
          className={cn(
            "border text-xs font-normal font-poppins border-[#EDE8EF] dark:light-border-2 rounded-[24px] py-1 px-[9px]",
            status.value === "Active" && "bg-[#53BD9033] text-[#53BD90]",
            status.value === "Processing" && "bg-[#3A88C026] text-[#262D31]",
            status.value === "draft" && "bg-red-200 text-red-800",
            status.value === "pending" && "bg-yellow-200 text-yellow-800"
          )}
        >
          {status.name}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Action",

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: ({ row }) => {
      const sample = row.original;
      return sample.status === "draft" ? (
        <Link
          className="text-xs underline"
          href={`/dashboard/sample-management/${sample.sampleId}`}
        >
          Continue Submission
        </Link>
      ) : (
        <SampleDetailsSheet
          sample={sample}
          sheetTrigger={<p className="text-xs underline">View details</p>}
        />
      );
      // <Link
      //   href={`/dashboard/sample-management/${sample.sampleId}`}
      //   className="text-xs underline"
      // >
      //   View details
      // </Link>
    },
  },
];
