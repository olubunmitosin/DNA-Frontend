"use client";

// import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleStatuses, testTypes } from "@/constants";

import { DataTableFacetedFilter } from "../_components/data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  inputPlaceholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  inputPlaceholder,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {inputPlaceholder && (
          <Input
            placeholder="Filter tasks..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={sampleStatuses}
          />
        )}
        {table.getColumn("testType") && (
          <DataTableFacetedFilter
            column={table.getColumn("testType")}
            title="Type"
            options={testTypes}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
