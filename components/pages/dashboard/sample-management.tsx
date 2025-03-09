"use client";
import { SelectContent } from "@radix-ui/react-select";
import { addDays, format } from "date-fns";
import { CalendarIcon, ChevronRight, Upload } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

import PageTitleHeader from "@/components/shared/page-title-header";
import { SamplesManagementColumn } from "@/components/tables/columns/sample.columns";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roles } from "@/constants";
import { cn } from "@/lib/utils";
import { SamplesDatum } from "@/types";

type Props = {
  columnData: SamplesDatum[];
};

const SampleManagementPage = (props: Props) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5),
  });
  const [openDateCalendar, setOpenDateCalendar] = useState(false);
  return (
    <>
      <PageTitleHeader
        page="Sample Management"
        secondBtn={
          <Button>
            <Upload /> Export Data
          </Button>
        }
      />
      <div className="flex flex-col justify-between gap-5 rounded-sm border border-[#E9E9E9E9] bg-white p-4 mmd:flex-row mmd:items-end lg:p-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-2">
            <Label>Transaction Date</Label>
            <Popover open={openDateCalendar} onOpenChange={setOpenDateCalendar}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  id="date"
                  variant={"ghost"}
                  className={cn(
                    "!bg-transparent border border-[#C7C7CC] rounded-[6px] h-[40px] flex items-center px-2 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-left text-sm text-[#262D31] font-mont font-normal"
                  )}
                >
                  <CalendarIcon className="size-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      <>{format(date.from, "LLL dd, y")}</>
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="my-4 w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  // onSelect={setDate}
                  onSelect={(dat) => {
                    setDate({
                      from: dat?.from,
                      to: dat?.to,
                    });
                  }}
                  disabled={(date) => date < new Date()}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select>
              <SelectTrigger className="h-[40px]">
                <SelectValue
                  placeholder="Select Role"
                  className="no-focus w-full rounded-[6px] border border-[#C7C7CC] font-poppins !text-sm text-[#262D31] shadow-none outline-none"
                />
              </SelectTrigger>
              <SelectContent className="rounded-[6px] bg-white">
                {roles.map((sample) => (
                  <SelectItem key={sample.value} value={sample.value}>
                    {sample.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Admin Name</Label>
            <Select>
              <SelectTrigger className="h-[40px]">
                <SelectValue
                  placeholder="Select Admin"
                  className="no-focus w-full rounded-[6px] border border-[#C7C7CC] font-poppins text-sm text-[#262D31] shadow-none outline-none"
                />
              </SelectTrigger>
              <SelectContent className="rounded-[6px] bg-white">
                {roles.map((sample) => (
                  <SelectItem key={sample.value} value={sample.value}>
                    {sample.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="h-[40px] w-[200px] border border-[#C7C7CC] bg-white text-sm font-normal text-[#262D31] shadow-none">
          Reset
        </Button>
      </div>
      <div className="mt-4 flex flex-col gap-6 rounded-[4px] border border-[#E9E9E9] bg-white p-4 lg:p-6 xl:p-8">
        <h6 className="text-base font-medium text-[#323232] lg:text-lg">
          Reports
        </h6>
        <DataTable
          data={props.columnData}
          columns={SamplesManagementColumn}
          tableClassname="border border-[#E7EBED]"
          bodyCellClassname="border border-[#E7EBED]"
          headerCellClassName="border border-[#E7EBED]"
        />
        <div className="flex items-center justify-end">
          <Link
            href="#"
            className="mt-2 flex items-center text-right text-sm font-medium text-primary underline"
          >
            View all updates <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default SampleManagementPage;
