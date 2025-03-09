"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Camera, Loader2 } from "lucide-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { OnboardUser } from "@/app/actions/auth.actions";
import { meansOfIdentification } from "@/constants";
import { cn, formatDateToYMD, parseDateAndTime } from "@/lib/utils";
import { updatePersonalInfoSchema } from "@/lib/validations";
import { User } from "@/types/main";

import { ImageUploadDialog } from "../dialog/image-upload-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  user: User;
  setOpenDialog: (open: boolean) => void;
  pathname: string;
};
const VerifyPersonalInfoForm = (props: Props) => {
  const [openDateCalendar, setOpenDateCalendar] = React.useState(false);
  const [isPending, startTranstion] = useTransition();

  const form = useForm<z.infer<typeof updatePersonalInfoSchema>>({
    resolver: zodResolver(updatePersonalInfoSchema),
    defaultValues: {
      email: props.user.email || "",
      dob: parseDateAndTime(props.user.dob, "2:30 PM"),
      // dob: new Date(parseYMDToDate(props.user.dob)) || new Date(),
      gender: props.user.gender || "",
      phoneNumber: props.user.phone || "",
      address: props.user.address || "",
      name: props.user.first_name || "",
    },
  });

  console.log(form.watch());

  const handleSubmit = (values: z.infer<typeof updatePersonalInfoSchema>) => {
    console.log(values);
    startTranstion(async () => {
      const formData = new FormData();
      formData.append("first_name", "Abayomi");
      // formData.append("last_name", values.email);
      // formData.append("state", values.email);
      // formData.append("country", values.email);
      // formData.append("postal_code", values.email);
      formData.append("email", values.email);
      formData.append("phone", values.phoneNumber);
      formData.append("address", values.address);
      formData.append("dob", formatDateToYMD(values.dob));
      formData.append("gender", values.gender);
      formData.append("means_of_identification", values.meansOfIdentification);
      formData.append("upload_meanns", values.identificationDoc);

      await OnboardUser(formData, props.pathname).then((data) => {
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
          toast(data.success);
          props.setOpenDialog(false);
        }
      });
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="  ">
        <div className="">
          {isPending && (
            <div className="absolute left-0 top-0 flex size-full items-center justify-center rounded-md bg-black/20">
              <Loader2 className="size-5 animate-spin" />
            </div>
          )}
          <div className="space-y-3">
            <h2 className="border-b pb-[13px] font-poppins text-2xl font-medium text-black">
              Personal Information
            </h2>
            <div className="flex flex-col gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-poppins text-sm font-medium">
                      Fullname
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Name"
                        type="text"
                        disabled={isPending}
                        {...field}
                        className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid gap-x-[10px] gap-y-4 pt-[15px] lg:grid-cols-2">
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
              </div>
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
                name="meansOfIdentification"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Choose means of identification</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          disabled={isPending}
                          className="!no-focus dark:light-border-2 h-[50px] rounded-[10px] border-none bg-[#F7F7F7] shadow-none dark:bg-dark-400 dark:text-light-300"
                        >
                          <SelectValue
                            placeholder="Select document type"
                            className="!no-focus"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage className="text-left" />

                      <SelectContent className="">
                        {meansOfIdentification &&
                          meansOfIdentification.map((provider) => (
                            <SelectItem
                              key={provider.value}
                              value={String(provider.value)}
                              className="mb-3 flex cursor-pointer py-3 hover:!bg-accent focus:!bg-accent"
                            >
                              <div className="flex flex-row items-center gap-2">
                                <span>{provider.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <ImageUploadDialog
                dialogTitle="Upload Document"
                trigger={
                  <Button
                    type="button"
                    className="flex items-center justify-center gap-2 border-none bg-[#0F64851A] font-poppins text-sm font-normal text-primary shadow-none outline-none"
                  >
                    <Camera className="size-4" />
                    <span>Upload document</span>
                  </Button>
                }
                form={updatePersonalInfoSchema}
                name="identificationDoc"
                // user={props.user}
                pathname={props.pathname}
              />
            </div>
          </div>

          <div className="mt-10 flex w-full items-center justify-between border-t pt-[30px]">
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
        </div>
      </form>
    </Form>
  );
};

export default VerifyPersonalInfoForm;
