"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, isSameDay } from "date-fns";
import { ChevronRight, CircleAlert, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import MapContainer from "@/components/shared/map";
import PageTitleHeader from "@/components/shared/page-title-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bookingPickupDetails } from "@/lib/validations";
import useFormStore from "@/store/sample-submission";

const ConfirmPickUpAddress = () => {
  const [isPending, startTransition] = useTransition();

  const { formData, updateFormData } = useFormStore();
  const router = useRouter();
  if (!formData.sampleID) {
    router.push("/dashboard/sample-submission");
  }
  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(
    formData.pickupDetails?.pickupDate || addDays(new Date(), 3)
  ); // Initialize with today
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    formData.pickupDetails?.pickupTIme || ""
  );

  // Define time slots for the next 6 days with varying availability
  const timeSlotsByDay = React.useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const day = addDays(new Date(), i);

      // Example of predefined slots (customize as needed)
      const predefinedSlots: Record<string, string[]> = {
        "0": ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM"], // Day 0
        "1": [
          "09:00 AM - 10:00 AM",
          "11:00 AM - 12:00 PM",
          "01:00 PM - 02:00 PM",
        ], // Day 1
        "2": ["10:00 AM - 11:00 AM", "12:00 PM - 01:00 PM"], // Day 2
        "3": [
          "09:00 AM - 10:00 AM",
          "10:00 AM - 11:00 AM",
          "11:00 AM - 12:00 PM",
          "01:00 PM - 02:00 PM",
        ], // Day 3
        "4": ["02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM"], // Day 4
        "5": ["09:00 AM - 10:00 AM"], // Day 5
      };

      // Ensure a minimum of 3 slots
      const slots = predefinedSlots[i.toString()] || [];
      while (slots.length < 3) {
        slots.push(`${slots.length + 1}:00 PM - ${slots.length + 2}:00 PM`);
      }

      return { day, slots };
    });
  }, []);

  // const nextFiveDays = timeSlotsByDay.map(({ day }) => day);
  // Get available times for the selected day
  const availableTimes =
    timeSlotsByDay.find(({ day }) => isSameDay(day, selectedDay || new Date()))
      ?.slots || [];

  const form = useForm<z.infer<typeof bookingPickupDetails>>({
    resolver: zodResolver(bookingPickupDetails),
    defaultValues: {
      pickupAddress: formData.pickupDetails?.pickupAddress || "",
      pickupDate: formData.pickupDetails?.pickupDate
        ? new Date(formData.pickupDetails.pickupDate)
        : addDays(new Date(), 3), // Fallback to the current date or any default date || addDays(new Date(), 3),
      pickupTIme: formData.pickupDetails?.pickupTIme || "",
      consent: formData.pickupDetails?.consent || false,
      additionalInstructions:
        formData.pickupDetails?.additionalInstructions || "",
    },
  });

  console.log(form.watch());
  const handleSubmit = (values: z.infer<typeof bookingPickupDetails>) => {
    startTransition(() => {
      if (updateFormData) {
        updateFormData("pickupDetails", values);
        router.push(
          "/dashboard/sample-submission/submission-process/instructions/address-confirmation/order-review"
        );
      }
    });
  };
  return (
    <>
      <PageTitleHeader page="Confirm Pick Off Address" />
      <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
        <div className="col-span-12 space-y-8 lg:col-span-7">
          <div className="flex flex-col gap-4 space-y-6 rounded-[8px] bg-white p-4 md:p-6 lg:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  name="pickupAddress"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel className="font-poppins text-sm font-medium">
                        Pickup Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="5 Kwaji Close, Maitama Abuja"
                          type="text"
                          {...field}
                          className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2 rounded-md bg-[#E9C46A1A] p-3">
                  <CircleAlert className="size-4 text-primary" />
                  <p className="text-xs font-normal text-primary md:text-sm">
                    Using your current default address on your profile
                    <br />
                    <Link href="#" className="underline">
                      Change default address
                    </Link>
                  </p>
                </div>
                <div className="space-y-2 md:space-y-4">
                  <h2 className="text-base font-semibold md:text-lg">
                    Available time slots
                  </h2>
                  <p className="text-xs text-gray-600 md:text-sm">
                    Select a convenient date and time for your sample pickup.
                    Please ensure you’ll be available at your chosen location
                    during this window.
                  </p>

                  {/* Date selection */}
                  <div className="flex flex-wrap gap-4 pb-[20px]">
                    {timeSlotsByDay.map(({ day, slots }) => {
                      const isToday = isSameDay(day, new Date());
                      const dayOfWeek = format(day, "EEE"); // e.g., "Tue"
                      const dayOfMonth = format(day, "dd"); // e.g., "05"

                      return (
                        <button
                          disabled={isPending}
                          key={day.toString()}
                          type="button"
                          onClick={() => {
                            setSelectedDay(day);
                            form.setValue("pickupDate", day);
                          }}
                          className={`flex h-[92px] w-[80px] flex-col items-center justify-center rounded-lg border px-3 py-2 text-sm ${
                            selectedDay && isSameDay(day, selectedDay)
                              ? "border-[#8BB0D9] bg-[#083D771A] font-semibold text-black"
                              : "border-gray-300 bg-[#F6F6F6CC] text-gray-700"
                          }`}
                        >
                          <span className="font-medium">
                            {isToday ? "Today" : dayOfWeek}
                          </span>
                          <span className="text-xs">{dayOfMonth}</span>
                          <div
                            className={`mt-3 rounded-md bg-[#083D771A] px-[8px] py-px text-[10px] font-medium ${
                              selectedDay && isSameDay(day, selectedDay)
                                ? "font-medium text-primary"
                                : "text-primary"
                            }`}
                          >
                            {slots.length} slots
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Time slot selection */}
                  {selectedDay && (
                    <div className="border-t border-[#E5E5EA] pb-[20px] pt-[28px]">
                      <h3 className="text-md mb-2 font-medium">
                        Available Times
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {availableTimes.map((time) => (
                          <button
                            disabled={isPending}
                            key={time}
                            type="button"
                            onClick={() => {
                              setSelectedTime(time);
                              form.setValue("pickupTIme", time);
                            }}
                            className={`rounded-md border px-3 py-2 text-xs md:text-sm ${
                              selectedTime === time
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-gray-300 bg-gray-100 text-gray-700"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4 border-t border-[#E5E5EA] pb-[20px] pt-[28px]">
                  <FormField
                    name="additionalInstructions"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-3 ">
                        <FormLabel className="font-poppins text-sm font-medium">
                          Additional Instructions (optional){" "}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={isPending}
                            placeholder="Provide any additional details we should know e.g  special instructions for sample collection, preferences, etc"
                            {...field}
                            rows={6}
                            className="no-focus  rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
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
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormLabel className="!m-0 text-xs font-normal text-[#767676] md:text-sm">
                          I hereby consent to DNA testing for the purpose of
                          determining paternity. I understand that the results
                          of this test will be handled confidentially and used
                          solely for the specified purpose.
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2 rounded-md bg-[#E9C46A1A] p-3">
                    <CircleAlert className="size-4 text-primary" />
                    <p className="text-xs font-normal text-primary md:text-sm">
                      By checking the box, you have consented to sample
                      collections
                    </p>
                  </div>
                </div>
                <div className="flex items-center border-t pt-7">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex h-[52px] items-center rounded-md text-white"
                  >
                    {isPending && (
                      <Loader2 className="me-2 size-4 animate-spin" />
                    )}
                    Proceed <ChevronRight className="ms-2 size-4" />
                  </Button>
                  <Button variant={"link"}>Cancel</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="flex flex-col gap-4 space-y-6 rounded-[8px] bg-white p-4 md:p-6 lg:p-8">
            <MapContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmPickUpAddress;
