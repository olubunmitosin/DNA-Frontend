"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { OnboardUser } from "@/app/actions/auth.actions";
import { cn, formatDateToYMD } from "@/lib/utils";
import { onboardingPersonalInfoSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
// import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  email: string;
};
const OnboardingPersonalForm = (props: Props) => {
  // const [OTP, setOTP] = useState("");
  const [openDateCalendar, setOpenDateCalendar] = React.useState(false);
  const [isPending, startTranstion] = useTransition();
  // const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  // const [openOTPModal, setOpenOTPModal] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [resendEnabled, setResendEnabled] = React.useState(false); // Manage resend button state
  // const [secondsRemaining, setSecondsRemaining] = useState(120); // 2 minutes (120 seconds)
  const form = useForm<z.infer<typeof onboardingPersonalInfoSchema>>({
    resolver: zodResolver(onboardingPersonalInfoSchema),
    defaultValues: {
      email: props.email,
    },
  });

  // React.useEffect(() => {
  //   let intervalId: NodeJS.Timeout | undefined;
  //   if (secondsRemaining > 0) {
  //     intervalId = setInterval(() => {
  //       setSecondsRemaining((prevSeconds) => prevSeconds - 1);
  //     }, 1000);
  //   } else {
  //     // Countdown finished -  Handle resend action here (e.g., enable a "Resend OTP" button)
  //     // Example:
  //     // setResendOtpEnabled(true); // If you're managing a resend button's state
  //     setResendEnabled(true);
  //   }

  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, [secondsRemaining]);

  // const handleResendClick = () => {
  //   handleSendOTP(form.getValues("phoneNumber"));
  //   // Call the function to resend the OTP here
  //   setSecondsRemaining(120); // Restart the timer
  //   setResendEnabled(false); // Disable the button again
  // };

  // const formatTime = (seconds: number): string => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  //   const formattedSeconds =
  //     remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  //   return `${formattedMinutes}:${formattedSeconds}`; // If you want MM:SS format
  //   // return seconds < 60 ? `${seconds}s` : `${minutes}m ${remainingSeconds}s`;
  // };

  // const handleSendOTP = async (phone: string) => {
  //   setIsLoading(true);
  //   try {
  //     await sendOTP(phone).then((data) => {
  //       if (data?.error) {
  //         toast(data.error);
  //         setIsLoading(false);
  //       }
  //       if (data?.success) {
  //         toast(data.success);
  //         setOtpSent(true);
  //         setIsLoading(false);
  //       }
  //     });
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //   }
  // };

  // const handleConfirmOTP = async (phone: string, otp: string) => {
  //   try {
  //     setIsLoading(true);
  //     await confirmOTP(phone, otp).then((data) => {
  //       if (data?.error) {
  //         toast(data.error);
  //         setIsLoading(false);
  //       }

  //       if (data?.success) {
  //         toast(data.success);
  //         setIsLoading(false);
  //         setOtpSent(false);
  //         setOpenOTPModal(false);
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSubmit = (
    values: z.infer<typeof onboardingPersonalInfoSchema>
  ) => {
    console.log(values);
    startTranstion(async () => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("phone", values.phoneNumber);
      formData.append("address", values.address);
      formData.append("state", values.state);
      formData.append("country", values.country);
      formData.append("postal_code", values.zipCode);
      formData.append("dob", formatDateToYMD(values.dob));
      formData.append("gender", values.gender);
      formData.append("blood_group", values.bloodGroup);
      formData.append("genotype", values.genotype);
      formData.append("medication", values.medications);
      formData.append("family_history", values.familyMedicalHistory || "");

      await OnboardUser(formData, "/onboarding").then((data) => {
        if (data?.error) {
          toast(data.error);
        }
        if (data?.invalid) {
          data.invalid.forEach((error) => toast(error));
        }

        if (data?.message) {
          toast(data.message);
        }

        if (data?.success) {
          router.push("/onboarding/success");
          toast(data.success);
        }
      });
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="  ">
        <ScrollArea className="custom-scrollbar relative !flex h-full !flex-col !gap-[50px] lg:h-[90vh]">
          {isPending && (
            <div className="absolute left-0 top-0 flex size-full items-center justify-center rounded-md bg-black/20">
              <Loader2 className="size-5 animate-spin" />
            </div>
          )}
          <div>
            <h2 className="border-b pb-[13px] font-poppins text-2xl font-medium text-black">
              Contact Information
            </h2>
            <div className="grid gap-x-[10px] gap-y-6 pt-[15px] lg:grid-cols-2">
              <FormField
                name="dob"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel className="font-poppins text-sm font-medium">
                      Date of birth *
                    </FormLabel>
                    <Popover
                      open={openDateCalendar}
                      onOpenChange={setOpenDateCalendar}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isPending}
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
                          captionLayout={"dropdown-buttons"}
                          fromYear={1960}
                          toYear={2012}
                          // fromMonth={new Date(1960, 2)}
                          // toMonth={new Date(2012, 12)}
                          selected={field.value}
                          onSelect={(e) => {
                            field.onChange(e);
                            setOpenDateCalendar(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel className="font-poppins text-sm font-medium">
                      Gender *
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
                            placeholder="Gender"
                            className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="male">
                          Male
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="female">
                          Female
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2">
                    <FormLabel className="text-left font-poppins text-sm font-medium">
                      Phone Number <span className="text-orange-800">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Phone Number"
                        type="number"
                        {...field}
                        disabled={isPending}
                        className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* <Dialog open={openOTPModal} onOpenChange={setOpenOTPModal}>
                <DialogTrigger className="flex items-start justify-start">
                  <FormField
                    name="phoneNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col gap-2">
                        <FormLabel className="text-left font-poppins text-sm font-medium">
                          Phone Number{" "}
                          <span className="text-orange-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Phone Number"
                            type="number"
                            {...field}
                            disabled={isLoading || isPending}
                            className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </DialogTrigger>
                <DialogContent
                  onInteractOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  // hideCLose
                >
                  {otpSent ? (
                    <div>
                      <DialogHeader>
                        <DialogTitle>OTP Verification</DialogTitle>
                        <DialogDescription>
                          Enter the OTP you recieved on your phone
                        </DialogDescription>

                        <div className="mt-2 space-y-3">
                          <div className="flex flex-col gap-1">
                            <Label className="font-poppins text-sm font-medium">
                              OTP
                            </Label>

                            <Input
                              disabled={isLoading}
                              placeholder="Enter OTP"
                              value={OTP}
                              onChange={(e) => {
                                e.preventDefault();
                                setOTP(e.target.value);
                              }}
                              type="number"
                              className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                            />
                          </div>
                          <Button
                            disabled={isLoading}
                            onClick={() =>
                              handleConfirmOTP(form.watch("phoneNumber"), OTP)
                            }
                            type="button"
                            className="flex h-[48px] w-full items-center"
                          >
                            {isLoading && (
                              <Loader2 className="me-2 size-4 animate-spin" />
                            )}
                            Confirm OTP
                          </Button>
                          {secondsRemaining > 0 ? (
                            <span className="flex items-center justify-center gap-1 text-center text-xs font-normal dark:text-black">
                              Resending in{" "}
                              <span className="text-center font-semibold text-primary dark:text-black">
                                {formatTime(secondsRemaining)}
                              </span>
                            </span>
                          ) : (
                            <span
                              className={`flex cursor-pointer items-center justify-center text-center text-sm font-semibold text-primary dark:text-black ${
                                resendEnabled ? "" : "cursor-default opacity-50"
                              }`} // Style disabled state
                              onClick={
                                resendEnabled ? handleResendClick : undefined
                              } // Conditionally call resend
                            >
                              Resend OTP
                            </span>
                          )}
                        </div>
                      </DialogHeader>
                    </div>
                  ) : (
                    <div>
                      <DialogHeader>
                        <DialogTitle>OTP Verification</DialogTitle>
                        <DialogDescription>
                          Enter phone number to recieve OTP
                        </DialogDescription>

                        <div className="mt-2 space-y-3">
                          <FormField
                            name="phoneNumber"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem className="flex flex-col gap-1">
                                <FormLabel className="font-poppins text-sm font-medium">
                                  Phone Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    placeholder="Enter Phone Number"
                                    type="number"
                                    {...field}
                                    className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            disabled={isLoading}
                            onClick={() =>
                              handleSendOTP(form.watch("phoneNumber"))
                            }
                            type="button"
                            className="flex h-[48px] w-full items-center"
                          >
                            {isLoading && (
                              <Loader2 className="me-2 size-4 animate-spin" />
                            )}
                            Send OTP
                          </Button>
                        </div>
                      </DialogHeader>
                    </div>
                  )}
                </DialogContent>
              </Dialog> */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-poppins text-sm font-medium">
                      Email Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email"
                        type="email"
                        disabled={isPending}
                        {...field}
                        className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-poppins text-base font-medium">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="5 Kwaji Close,"
                        type="text"
                        {...field}
                        className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel className="font-poppins text-sm font-medium">
                      City/State
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
                            placeholder="Select State"
                            className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="abuja">
                          Abuja
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="lagos">
                          Lagos
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="country"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-poppins text-base font-medium">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Nigeria"
                        type="text"
                        {...field}
                        className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="zipCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-poppins text-base font-medium">
                      Postal Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="2259012"
                        type="text"
                        {...field}
                        className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-10">
            <h2 className="border-b pb-[13px] font-poppins text-2xl font-medium text-black">
              Biodata
            </h2>
            <div className="grid gap-x-[10px] gap-y-6 pt-[15px] lg:grid-cols-2">
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel className="font-poppins text-sm font-medium">
                      Blood Group
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
                            placeholder="Blood Group"
                            className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="A+">
                          A+
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="A-">
                          A-
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="B+">
                          B+
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="B-">
                          B-
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="AB+">
                          AB+
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="AB-">
                          AB-
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="O+">
                          O+
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="O-">
                          O-
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genotype"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel className="font-poppins text-sm font-medium">
                      Genotype
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
                            placeholder="Genotype"
                            className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="AA">
                          AA
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="AS">
                          AS
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="SS">
                          SS
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="AC">
                          AC
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="SC">
                          SC
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel className="font-poppins text-sm font-medium">
                      Medications (current prescriptions or OTC medications)
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
                            placeholder="Medications"
                            className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="none">
                          None
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="paracetamol"
                        >
                          Paracetamol
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="ibuprofen"
                        >
                          Ibuprofen
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="amoxicillin"
                        >
                          Amoxicillin
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="metformin"
                        >
                          Metformin
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="atorvastatin"
                        >
                          Atorvastatin
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="omeprazole"
                        >
                          Omeprazole
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="insulin">
                          Insulin
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="antihistamine"
                        >
                          Antihistamine
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="vitamin-d"
                        >
                          Vitamin D
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="aspirin">
                          Aspirin
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="familyMedicalHistory"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 lg:gap-3">
                    <FormLabel className="font-poppins text-xs font-medium lg:text-sm">
                      Family Medical History (e.g., genetic disorders,
                      cardiovascular diseases)
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          disabled={isPending}
                          className="h-[52px]"
                        >
                          <SelectValue
                            placeholder="Medical History"
                            className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="genetic_disorder">
                          Genetic Disorder
                        </SelectItem>
                        <SelectItem value="cardio-disease">
                          Cardiovascular Disease
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-10 flex w-full items-center justify-between border-t pt-[30px]">
            <Button
              onClick={() => router.push("/dashboard")}
              variant={"link"}
              type="button"
              disabled={isPending}
            >
              Skip
            </Button>
            <Button
              variant={"link"}
              type="submit"
              disabled={isPending}
              className="flex items-center"
            >
              {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
              Submit
            </Button>
          </div>
          <ScrollBar orientation="vertical" className="custom-scrollbar" />
        </ScrollArea>
      </form>
    </Form>
  );
};

export default OnboardingPersonalForm;
