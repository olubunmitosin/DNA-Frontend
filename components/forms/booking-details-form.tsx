/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, formatDate, isSameDay } from "date-fns";
import { CalendarIcon, CircleAlert } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { sampleTypes } from "@/constants";
import { cn } from "@/lib/utils";
import { bookingDropOffDetails } from "@/lib/validations";
import useFormStore from "@/store/sample-submission";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SimpleTimePicker } from "../ui/simple-time-picker";

export const BookingPickupDetailsForm = () => {
  const { formData, updateFormData } = useFormStore();

  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(
    formData.dropOffDetails?.pickUpDate || addDays(new Date(), 3)
  ); // Initialize with today
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    formData.dropOffDetails?.pickUpTime || ""
  );
  const nextFiveDays = Array.from({ length: 6 }, (_, i) =>
    addDays(new Date(), i)
  );
  const form = useForm<z.infer<typeof bookingDropOffDetails>>({
    resolver: zodResolver(bookingDropOffDetails),
    defaultValues: {
      sampleCollectionTime:
        new Date() || formData.dropOffDetails?.sampleCollectionTime,
      sampleType: formData.dropOffDetails?.sampleType || "",
      sampleCollectionDate:
        formData.dropOffDetails?.sampleCollectionDate || new Date(),
      chaninOfCustody: formData.dropOffDetails?.chaninOfCustody || "",
      relationShipToDonor: formData.dropOffDetails?.relationShipToDonor || "",
      address: formData.dropOffDetails?.address || "",
      pickUpDate: formData.dropOffDetails?.pickUpDate || addDays(new Date(), 3),
      pickUpTime: formData.dropOffDetails?.pickUpTime || "",
      consent: formData.dropOffDetails?.consent || false,
    },
  });
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setSelectedTime(undefined);
    form.setValue("pickUpDate", selectedDay || new Date());
  };

  const handleTimeChange = (time: string | undefined) => {
    setSelectedTime(time);
    form.setValue("pickUpTime", selectedTime || "");
  };

  const availableTimes = selectedDay
    ? [
        "09:00 - 10:00 AM",
        "10:00 - 11:00 AM",
        "11:00 - 12:00 PM",
        "12:00 - 01:00 PM",
        "01:00 - 02:00 PM",
        "02:00 - 03:00 PM",
      ]
    : []; // Only show times if a day is selected

  console.log(form.watch());
  const handleSubmit = (values: z.infer<typeof bookingDropOffDetails>) => {
    console.log(values);
    if (updateFormData) {
      updateFormData("dropOffDetails", values);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-[23px]"
      >
        <div className="grid gap-[23px] lg:grid-cols-2">
          <FormField
            control={form.control}
            name="sampleType"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel className="font-poppins text-sm font-medium">
                  Sample Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-[52px]">
                      <SelectValue
                        placeholder="Select Sample Type"
                        className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sampleTypes.map((sample) => (
                      <SelectItem key={sample.value} value={sample.value}>
                        {sample.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="sampleCollectionDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel className="font-poppins text-sm font-medium">
                  Sample Collection Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            name="datePicker"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel className="font-poppins text-sm font-medium">
                  Sample Collection Date
                </FormLabel>
                <FormControl>
                  <CalendarDatePicker
                    date={field.value}
                    onDateSelect={({ from, to }) => {
                      form.setValue("datePicker", { from, to });
                    }}
                    variant="outline"
                    numberOfMonths={1}
                    className="h-[52px] min-w-[250px] justify-start shadow-none"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            name="sampleCollectionTime"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel className="font-poppins text-sm font-medium">
                  Sample Collection Time
                </FormLabel>
                <SimpleTimePicker
                  // use12HourFormat={true}
                  value={field.value}
                  onChange={field.onChange}
                />

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chaninOfCustody"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel className="font-poppins text-sm font-medium">
                  Chain of Custody Started{" "}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-[52px]">
                      <SelectValue
                        placeholder="Select preferred option"
                        className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["yes", "no"].map((sample) => (
                      <SelectItem
                        key={sample}
                        value={sample}
                        className="capitalize"
                      >
                        {sample}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="relationShipToDonor"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel className="font-poppins text-sm font-medium">
                Relationship to donor
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-[52px]">
                    <SelectValue
                      placeholder="Select preferred option"
                      className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["father", "child", "mother", "other"].map((sample) => (
                    <SelectItem
                      key={sample}
                      value={sample}
                      className="capitalize"
                    >
                      {sample}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="address"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel className="font-poppins text-sm font-medium">
                Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="5 Kwaji Close, Maitama Abuja"
                  type="text"
                  {...field}
                  className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Select pick-up date</h2>

          <div className="flex flex-wrap gap-2">
            {/* ... (rest of the component) */}
            {nextFiveDays.map((day) => {
              const isToday = isSameDay(day, new Date());
              const dayOfWeek = format(day, "EEE"); // Get day of week (e.g., "Tue")
              const dayOfMonth = format(day, "dd"); // Get day of month (e.g., "05")

              return (
                <Button
                  type="button"
                  variant={"outline"}
                  key={day.toString()}
                  onClick={() => handleDayClick(day)}
                  className={`h-[72px] w-[80px] rounded-md border border-gray-300 bg-[#F6F6F6CC] px-3 py-2 text-sm ${
                    selectedDay && isSameDay(day, selectedDay)
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                >
                  {isToday ? (
                    "Today"
                  ) : (
                    <span className="flex flex-col gap-2">
                      <span>{dayOfWeek}</span> <span>{dayOfMonth}</span>
                    </span>
                  )}
                </Button>
              );
            })}
          </div>

          {selectedDay && (
            <div>
              <h3 className="text-md mb-2 font-medium">Morning</h3>
              <div className="flex flex-wrap gap-2">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={"outline"}
                    onClick={() => handleTimeChange(time)}
                    className={`rounded-md border border-gray-300 px-3 py-2 text-sm ${
                      selectedTime === time ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedDay && selectedTime && (
            <p className="text-green-500">
              You selected: {formatDate(selectedDay, "MMMM d, yyyy")} at{" "}
              {selectedTime}
            </p>
          )}
        </div>
        <FormField
          name="consent"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl className="!m-0">
                <Checkbox
                  className="!m-0"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!m-0 text-sm font-normal text-[#767676]">
                I hereby consent to DNA testing for the purpose of determining
                paternity. I understand that the results of this test will be
                handled confidentially and used solely for the specified
                purpose.
              </FormLabel>
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2 rounded-md bg-[#E9C46A1A] p-3">
          <CircleAlert className="size-4 text-primary" />
          <p className="text-sm font-normal text-primary">
            By checking the box, you have consented to sample collections
          </p>
        </div>
      </form>
    </Form>
  );
};
