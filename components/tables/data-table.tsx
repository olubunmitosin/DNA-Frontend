/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeDirection,
  ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DataTablePagination } from "./_components/pagination-comp";
import { DataTableToolbar } from "./toolbars/transaction-table-toolbar";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  name?: string;
  inputPlaceholder?: string;
  tableClassname?: string;
  bodyRowClassname?: string;
  bodyCellClassname?: string;
  headerCellClassName?: string;
  // filterName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  inputPlaceholder,
  name,
  tableClassname,
  bodyCellClassname,
  headerCellClassName,
  bodyRowClassname,
}: DataTableProps<TData, TValue>) {
  //   const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>("onChange");
  const [columnResizeDirection, setColumnResizeDirection] =
    useState<ColumnResizeDirection>("ltr");

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    columnResizeMode,
    columnResizeDirection,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    onGlobalFilterChange: setGlobalFilter,
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    state: {
      columnFilters,
      rowSelection,
      sorting,
      columnVisibility,
    },

    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="space-y-4 ">
      <div>
        {inputPlaceholder ? (
          <DataTableToolbar inputPlaceholder={inputPlaceholder} table={table} />
        ) : (
          <DataTableToolbar table={table} />
        )}
      </div>
      <div className="custom-scrollbar">
        <Table
          className={cn("custom-scrollbar", tableClassname)}
          // style={{ width: table.getCenterTotalSize() }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn("px-6 py-3 border", headerCellClassName)}
                      colSpan={header.colSpan}
                      // style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn("cursor-pointer group", bodyRowClassname)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "text-xs md:text-sm lg:text-base py-4 px-6",
                        bodyCellClassname
                      )}
                      // style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
