"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, formatDate, isSameDay } from "date-fns";
import { CircleAlert, CalendarIcon, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { getUserDetails } from "@/app/actions/auth.actions";
import { VerifyPersonalInfoDialog } from "@/components/dialog/verify-personal-information-dialog";
import PageTitleHeader from "@/components/shared/page-title-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimpleTimePicker } from "@/components/ui/simple-time-picker";
import { testTypes, sampleTypes, processingTime } from "@/constants";
import { cn } from "@/lib/utils";
import { bookingDropOffDetails } from "@/lib/validations";
import useFormStore from "@/store/sample-submission";
import { User } from "@/types/main";
const BookingDetailsPage = () => {
  const [loggedInUser, setLoggedInUser] = React.useState<User>();
  const router = useRouter();
  const pathname = usePathname();
  const { formData, updateFormData } = useFormStore();
  const [tokenCost, setTokenCost] = React.useState<number>(0);
  const [isPending, startTransition] = React.useTransition();
  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(
    formData.dropOffDetails?.pickUpDate || addDays(new Date(), 3)
  ); // Initialize with today
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    formData.dropOffDetails?.pickUpTime || ""
  );

  if (!formData.sampleID) {
    router.push("/dashboard/sample-submission");
  }
  const nextFiveDays = Array.from({ length: 6 }, (_, i) =>
    addDays(new Date(), i)
  );

  const getUserCallback = React.useCallback(async () => {
    const user = await getUserDetails();

    if (user.success) {
      setLoggedInUser(user.userDetails);
    }
  }, []);

  React.useEffect(() => {
    getUserCallback();
  }, [getUserCallback]);

  const form = useForm<z.infer<typeof bookingDropOffDetails>>({
    resolver: zodResolver(bookingDropOffDetails),
    defaultValues: {
      sampleCollectionTime: formData.dropOffDetails?.sampleCollectionTime
        ? new Date(formData.dropOffDetails.sampleCollectionTime)
        : new Date(), // Fallback to the current date or any default date
      sampleType: formData.dropOffDetails?.sampleType || "",
      sampleCollectionDate: formData.dropOffDetails?.sampleCollectionDate
        ? new Date(formData.dropOffDetails.sampleCollectionDate)
        : new Date(), // Fallback to the current date or any default date
      chaninOfCustody: formData.dropOffDetails?.chaninOfCustody || "",
      relationShipToDonor: formData.dropOffDetails?.relationShipToDonor || "",
      address: formData.dropOffDetails?.address || "",
      pickUpDate: formData.dropOffDetails?.pickUpDate
        ? new Date(formData.dropOffDetails.pickUpDate)
        : addDays(new Date(), 3), // Fallback to the current date or any default date || addDays(new Date(), 3),
      pickUpTime: formData.dropOffDetails?.pickUpTime || "",
      processingTime: formData.dropOffDetails?.processingTime || "",
      consent: formData.dropOffDetails?.consent || false,
    },
  });
  const availableTimes = selectedDay
    ? [
        "09:00 AM - 10:00 AM",
        "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM",
        "12:00 PM - 01:00 PM",
        "01:00 PM - 02:00 PM",
        "02:00 PM - 03:00 PM",
      ]
    : []; // Only show times if a day is selected

  console.log(form.watch());
  const handleSubmit = (values: z.infer<typeof bookingDropOffDetails>) => {
    console.log(values);

    startTransition(() => {
      if (updateFormData) {
        updateFormData("dropOffDetails", values);
        router.push(
          "/dashboard/sample-submission/submission-process/instructions/booking-details/address-confirmation"
        );
      }
    });
  };
  return (
    <>
      <PageTitleHeader page="Booking Details" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
            <div className="col-span-12 space-y-8 lg:col-span-7">
              <div className="flex flex-col gap-4 space-y-3 rounded-[8px] bg-white p-4 md:space-y-6 md:p-6 lg:p-8">
                <h4 className="font-poppins text-lg font-semibold text-[#222] lg:text-xl xl:text-2xl">
                  Sample Information
                </h4>
                <div className="space-y-[18px] lg:space-y-[23px]">
                  <div className="grid gap-[18px] lg:grid-cols-2  2xl:gap-[23px]">
                    <FormField
                      control={form.control}
                      name="sampleType"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1 md:gap-3">
                          <FormLabel className="font-poppins text-sm font-medium">
                            Sample Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className="h-[52px]"
                                disabled={isPending}
                              >
                                <SelectValue
                                  placeholder="Select Sample Type"
                                  className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sampleTypes.map((sample) => (
                                <SelectItem
                                  key={sample.value}
                                  value={sample.value}
                                >
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
                        <FormItem className="flex flex-col gap-1 md:gap-3">
                          <FormLabel className="font-poppins text-sm font-medium">
                            Sample Collection Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  disabled={isPending}
                                  type="button"
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                    <FormField
                      name="sampleCollectionTime"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1 md:gap-3">
                          <FormLabel className="font-poppins text-sm font-medium">
                            Sample Collection Time
                          </FormLabel>
                          <SimpleTimePicker
                            disabled={isPending}
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
                        <FormItem className="flex flex-col gap-1 md:gap-3">
                          <FormLabel className="font-poppins text-sm font-medium">
                            Chain of Custody Started{" "}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className="h-[52px]"
                                disabled={isPending}
                              >
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
                      <FormItem className="flex flex-col gap-1 md:gap-3">
                        <FormLabel className="font-poppins text-sm font-medium">
                          Relationship to donor
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="h-[52px]"
                              disabled={isPending}
                            >
                              <SelectValue
                                placeholder="Select preferred option"
                                className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["father", "child", "mother", "other"].map(
                              (sample) => (
                                <SelectItem
                                  key={sample}
                                  value={sample}
                                  className="capitalize"
                                >
                                  {sample}
                                </SelectItem>
                              )
                            )}
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
                      <FormItem className="flex flex-col gap-1 md:gap-3">
                        <FormLabel className="font-poppins text-sm font-medium">
                          Address
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
                  <div className="space-y-4">
                    <h4 className="font-poppins text-lg font-semibold text-[#222] lg:text-xl xl:text-2xl">
                      Select pick-up date
                    </h4>

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
                            disabled={isPending}
                            onClick={() => {
                              setSelectedDay(day);
                              form.setValue("pickUpDate", day);
                            }}
                            className={`h-[72px] w-[80px] rounded-md border border-gray-300 bg-[#F6F6F6CC] px-3 py-2 text-xs md:text-sm ${
                              selectedDay && isSameDay(day, selectedDay)
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                          >
                            {isToday ? (
                              "Today"
                            ) : (
                              <span className="flex flex-col gap-2">
                                <span>{dayOfWeek}</span>{" "}
                                <span>{dayOfMonth}</span>
                              </span>
                            )}
                          </Button>
                        );
                      })}
                    </div>

                    {selectedDay && (
                      <div>
                        {/* <h3 className="text-md mb-2 font-medium">Morning</h3> */}
                        <div className="flex flex-wrap gap-2">
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              disabled={isPending}
                              type="button"
                              variant={"outline"}
                              onClick={() => {
                                setSelectedTime(time);
                                form.setValue("pickUpTime", time);
                              }}
                              className={`rounded-md border border-gray-300 px-3 py-2 text-xs lg:text-sm ${
                                selectedTime === time
                                  ? "bg-blue-500 text-white"
                                  : ""
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
                        You selected: {formatDate(selectedDay, "MMMM d, yyyy")}{" "}
                        at {selectedTime}
                      </p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-poppins text-lg font-semibold text-[#222] lg:text-xl xl:text-2xl">
                      Select Processing Time
                    </h4>
                    <FormField
                      control={form.control}
                      name="processingTime"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={(e) => {
                                field.onChange(e);
                                setTokenCost(
                                  processingTime.find(
                                    (time) => time.value === e
                                  )?.units || 0
                                );
                              }}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {processingTime.map((process) => (
                                <FormItem
                                  className="flex items-center space-x-2 space-y-0"
                                  key={process.value}
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={process.value}
                                      className="size-4"
                                    />
                                  </FormControl>
                                  <FormLabel className="w-full font-normal">
                                    <div className="flex w-full items-center justify-between text-sm font-normal text-[#767676]">
                                      <h6 className="">
                                        {process.name}
                                        <span className="ms-2">
                                          ({process.time})
                                        </span>
                                      </h6>
                                      <p className="underline">
                                        {process.units} units
                                      </p>
                                    </div>
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>{" "}
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
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <div className="flex flex-col gap-4 space-y-6 rounded-[8px] bg-white p-4 md:p-6 lg:p-8">
                <h4 className="font-poppins text-lg font-semibold text-[#222] lg:text-xl xl:text-2xl">
                  Order Summary
                </h4>
                <div className="space-y-3">
                  <span className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium uppercase text-[#777]">
                      Sample ID
                    </span>
                    <span className="text-sm text-[#222] underline">
                      {formData.sampleID}
                    </span>
                  </span>
                  <span className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium uppercase text-[#777]">
                      Type of Test
                    </span>
                    <span className="text-sm text-[#222] underline">
                      {
                        testTypes.find(
                          (test) => test.value === formData.testType
                        )?.name
                      }
                    </span>
                  </span>
                  <span className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium uppercase text-[#777]">
                      Token Cost
                    </span>
                    <span className="text-sm text-[#222] underline">
                      {tokenCost} {tokenCost > 1 ? "Units" : "Unit"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-[#E9C46A1A] p-3">
                  <CircleAlert className="size-4 text-primary" />
                  <p className="text-xs font-normal text-primary md:text-sm">
                    You need to verify your personal information before
                    proceeding <br />
                    <VerifyPersonalInfoDialog
                      trigger={
                        <Button
                          variant={"link"}
                          className="mt-2 h-fit p-0 underline"
                        >
                          Verify personal information
                        </Button>
                      }
                      user={loggedInUser!}
                      pathname={pathname}
                    />
                  </p>
                </div>
                <Button
                  disabled={isPending}
                  className="flex h-[52px] items-center rounded-md text-white"
                  type="submit"
                >
                  {isPending && (
                    <Loader2 className="me-2 size-4 animate-spin" />
                  )}
                  Select drop off address
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default BookingDetailsPage;
