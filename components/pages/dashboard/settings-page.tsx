"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckCheck,
  CircleAlert,
  Loader2,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { OnboardUser, sendOTP } from "@/app/actions/auth.actions";
import { InitiatePayment } from "@/app/actions/wallet.actions";
import ChangePasswordModal from "@/components/dialog/change-password-modal";
import {
  ImageUploadDialog,
  UploadedFile,
} from "@/components/dialog/image-upload-dialog";
import { VerifyPhoneNumber } from "@/components/dialog/verify-phone-number-dialog";
import PageTitleHeader from "@/components/shared/page-title-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  cn,
  extractFileExtension,
  formatDateToYMD,
  parseDateAndTime,
  toCurrency,
} from "@/lib/utils";
import {
  buyUnitsSchema,
  updategeneralHealthInformationSchema,
  updatePersonalAddressSchema,
  updatePersonalInformationSchema,
} from "@/lib/validations";
import { User } from "@/types/main";

type Props = {
  user: User;
};

export const SettingsPageComp = (props: Props) => {
  const [isPending, startTransition] = React.useTransition();
  const [secondsRemaining, setSecondsRemaining] = useState(120); // 2 minutes (120 seconds)
  const [resendEnabled, setResendEnabled] = React.useState(false); // Manage resend button state
  const [isLoading, setIsLoading] = useState(false);
  const [openOTPModal, setOpenOTPModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");
  const [thumbnail, setThumbail] = React.useState<UploadedFile>();
  // const [loadingImageUrl, setLoadingImageUrl] = useState(false);
  const [image, setImage] = useState<File>();

  const router = useRouter();
  const personalInfoForm = useForm<
    z.infer<typeof updatePersonalInformationSchema>
  >({
    resolver: zodResolver(updatePersonalInformationSchema),
    defaultValues: {
      name: props.user.first_name,
      dob: parseDateAndTime(props.user.dob, "2:30 PM"),
      gender: props.user.gender,
      phoneNumber: props.user.phone,
      email: props.user.email,
    },
  });
  const billingForm = useForm<z.infer<typeof buyUnitsSchema>>({
    resolver: zodResolver(updatePersonalInformationSchema),
    defaultValues: {
      amount: "",
    },
  });
  const personalAddressForm = useForm<
    z.infer<typeof updatePersonalAddressSchema>
  >({
    resolver: zodResolver(updatePersonalAddressSchema),
    defaultValues: {
      address: props.user.address,
      country: props.user.country,
      state: props.user.state,
      zipCode: props.user.postal_code,
    },
  });
  const generalInfoForm = useForm<
    z.infer<typeof updategeneralHealthInformationSchema>
  >({
    resolver: zodResolver(updategeneralHealthInformationSchema),
    defaultValues: {
      bloodGroup: props.user.blood_group,
      familyMedicalHistory: props.user.family_history,
      genotype: props.user.genotype,
      medications: props.user.medication,
    },
  });

  const handleSubmitPersonal = (
    values: z.infer<typeof updatePersonalInformationSchema>
  ) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", values.email);
      if (values.photo) {
        formData.append("image", values.photo);
      }
      formData.append("phone", values.phoneNumber);
      formData.append("state", props.user.state);
      formData.append("address", props.user.address);

      formData.append("country", props.user.country);
      formData.append("postal_code", props.user.postal_code);
      formData.append("dob", formatDateToYMD(values.dob));
      formData.append("gender", values.gender);
      formData.append("blood_group", props.user.blood_group);
      formData.append("genotype", props.user.genotype);
      formData.append("medication", props.user.medication);
      formData.append("family_history", props.user.family_history);

      // formData.append("medication", props.user.medication);

      await OnboardUser(formData, "/dashboard/settings").then((data) => {
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
          personalInfoForm.reset();
          toast("Personal Information Updated");
        }
      });
    });
  };
  const handleSubmitAddress = (
    values: z.infer<typeof updatePersonalAddressSchema>
  ) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", props.user.email);
      formData.append("phone", props.user.phone);
      formData.append("address", values.address || props.user.address);
      if (image) {
        formData.append("image", image);
      }
      formData.append("state", values.state || props.user.state);
      formData.append("country", values.country || props.user.country);
      formData.append("postal_code", values.zipCode || props.user.postal_code);
      formData.append("dob", props.user.dob);
      formData.append("gender", props.user.gender);
      formData.append("blood_group", props.user.blood_group);
      formData.append("genotype", props.user.genotype);
      formData.append("medication", props.user.medication);
      formData.append("family_history", props.user.family_history);

      // formData.append("medication", props.user.medication);
      await OnboardUser(formData, "/dashboard/settings").then((data) => {
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
          personalInfoForm.reset();
          toast("Address Updated");
        }
      });
    });
  };

  const handleSubmitHealth = (
    values: z.infer<typeof updategeneralHealthInformationSchema>
  ) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", props.user.email);
      formData.append("address", props.user.address);
      if (image) {
        formData.append("image", image);
      }

      formData.append("phone", props.user.phone);
      formData.append("state", props.user.state);
      formData.append("country", props.user.country);
      formData.append("postal_code", props.user.postal_code);
      formData.append("dob", props.user.dob);
      formData.append("gender", props.user.gender);
      formData.append(
        "blood_group",
        values.bloodGroup || props.user.blood_group
      );
      formData.append("genotype", values.genotype || props.user.gender);
      formData.append(
        "medication",
        values.medications || props.user.medication
      );
      formData.append(
        "family_history",
        values.familyMedicalHistory || props.user.family_history
      );

      // formData.append("medication", props.user.medication);
      await OnboardUser(formData, "/dashboard/settings").then((data) => {
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
          personalInfoForm.reset();
          toast("Health Information Updated");
        }
      });
    });
  };

  const initiatePayment = async () => {
    startTransition(async () => {
      const formData = new FormData();
      const newAm = Number(billingForm.getValues("amount")) * 1278 + 7000;

      formData.append("amount", String(newAm));
      await InitiatePayment(formData, "/dashboard/settings").then((data) => {
        if (data?.error) {
          toast(data.error);
        }

        if (data?.success) {
          toast(data.success);
          router.push(data.url);
          billingForm.reset();

          // router.push(data.redirect);
        }
      });
    });
  };

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (secondsRemaining > 0) {
      intervalId = setInterval(() => {
        setSecondsRemaining((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      // Countdown finished -  Handle resend action here (e.g., enable a "Resend OTP" button)
      // Example:
      // setResendOtpEnabled(true); // If you're managing a resend button's state
      setResendEnabled(true);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [secondsRemaining]);

  const handleResendClick = () => {
    handleSendOTP(props.user.email);
    // Call the function to resend the OTP here
    setSecondsRemaining(120); // Restart the timer
    setResendEnabled(false); // Disable the button again
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`; // If you want MM:SS format
    // return seconds < 60 ? `${seconds}s` : `${minutes}m ${remainingSeconds}s`;
  };

  const handleSendOTP = async (phone: string) => {
    setIsLoading(true);
    try {
      await sendOTP(phone).then((data) => {
        if (data?.error) {
          toast(data.error);
          setIsLoading(false);
        }
        if (data?.success) {
          toast(data.success);
          setOtpSent(true);
          setIsLoading(false);
        }
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const photoied = personalInfoForm.watch("photo");
  useEffect(() => {
    if (photoied) {
      const updatedFile = {
        file: photoied,
        preview: URL.createObjectURL(photoied),
        size: photoied.size,
        name: photoied.name,
        date: new Date(),
      };

      setThumbail(updatedFile);
    }
  }, [photoied]);

  const ImageCallbackFile = useCallback(async () => {
    if (
      typeof props.user?.image === "string" &&
      props.user.image.trim() !== ""
    ) {
      // setLoadingImageUrl(true);
      try {
        startTransition(async () => {
          const response = await fetch(
            `/api/image?url=${encodeURIComponent(props.user?.image)}`
          );
          if (!response.ok) {
            throw new Error(
              `Error fetching image: ${response.status} ${response.statusText}`
            );
          }

          const blob = await response.blob();
          const contentType = response.headers.get("content-type");

          if (!contentType) {
            throw new Error("Could not determine image format.");
          }

          const extension = extractFileExtension(contentType);
          const filename = `${props.user.first_name.replace(
            /[^a-zA-Z0-9]/g,
            "_"
          )}.${extension}`; // Sanitize filename
          const file = new File([blob], filename, { type: contentType });

          setImage(file);
          const updatedFile = {
            file,
            preview: URL.createObjectURL(file),
            size: file.size,
            name: file.name,
            date: new Date(),
          };

          setThumbail(updatedFile);
          personalInfoForm.setValue("photo", file);
        });
      } catch (error) {
        console.error("Error fetching image:", error);
        // ... Handle the error (e.g., display a message to the user, use a fallback image)
      }
    }
  }, [props.user?.image, props.user.first_name, personalInfoForm]);

  useEffect(() => {
    ImageCallbackFile();
    // if (dbValues?.image) {
    //   form.setValue("coverImage", dbValues.image);
    // }
  }, [ImageCallbackFile]);

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

  return (
    <>
      <PageTitleHeader page="User Profile" />
      <Tabs defaultValue="bio-data" className="">
        <TabsList className="!h-[60px] w-full !justify-start rounded-md bg-white p-[20px]">
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
            value="bio-data"
          >
            Bio - Data
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
            value="fund-wallet"
          >
            Fund Wallet
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
            value="security"
          >
            Security
          </TabsTrigger>
        </TabsList>
        <TabsContent value="bio-data" className="mt-10 space-y-[40px]">
          <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
            <div className="col-span-12 flex flex-col  gap-5 rounded-md border border-[#e9e9e9e] bg-white p-[20px] lg:col-span-7">
              <div className="flex items-center justify-between">
                <ImageUploadDialog
                  name="photo"
                  dialogTitle="Upload Image"
                  trigger={
                    <div className="flex items-center gap-2">
                      <div className="flex size-[50px] items-center justify-center rounded-full border border-[#e5e5ea] md:size-[75px] xl:size-[100px]">
                        {thumbnail ? (
                          <Image
                            src={thumbnail.preview}
                            alt={thumbnail.name}
                            className="size-[35px] rounded-full object-cover object-top xl:size-[77px]"
                            quality={100}
                            width={60}
                            height={60}
                          />
                        ) : (
                          <UserRound className="size-[35px] text-gray-400 md:size-[50px] xl:size-[77px]" />
                        )}
                      </div>
                      <Button
                        disabled={isPending}
                        variant={"link"}
                        className="bg-transparent !p-0"
                      >
                        Upload Photo
                      </Button>
                    </div>
                  }
                  form={personalInfoForm}
                  // user={props.user}
                  pathname="/dashboard/settings"
                />
                <div className="gap-2">
                  <p className="text-xs font-normal text-[#909090]">USER ID</p>
                  <h3 className="text-sm font-semibold text-[#514e4e] lg:text-base">
                    EN-712534-NG
                  </h3>
                </div>
              </div>

              <div className="space-y-[10px]">
                <h2 className=" font-poppins text-base font-medium text-black lg:text-lg xl:text-xl 2xl:text-2xl">
                  Personal Information
                </h2>
                <Form {...personalInfoForm}>
                  <form
                    onSubmit={personalInfoForm.handleSubmit(
                      handleSubmitPersonal
                    )}
                    className="space-y-[18px] 2xl:space-y-[23px]"
                  >
                    <FormField
                      name="name"
                      control={personalInfoForm.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1 lg:space-y-3">
                          <FormLabel className="font-poppins text-xs font-medium md:text-base">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="First Name"
                              type="text"
                              {...field}
                              className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-x-[10px] gap-y-[18px] lg:grid-cols-2 xl:gap-y-[23px]">
                      <FormField
                        name="dob"
                        control={personalInfoForm.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1 lg:gap-3">
                            <FormLabel className="font-poppins text-xs font-medium lg:text-sm">
                              Date of birth *
                            </FormLabel>
                            <Popover>
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
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
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
                        control={personalInfoForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1 lg:gap-3">
                            <FormLabel className="font-poppins text-xs font-medium lg:text-sm">
                              Gender *
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
                                    placeholder="Gender"
                                    className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="phoneNumber"
                        control={personalInfoForm.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1 lg:gap-3">
                            <FormLabel className="font-poppins text-xs font-medium lg:text-sm">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isPending}
                                placeholder="Enter Phone Number"
                                type="number"
                                {...field}
                                className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="email"
                        control={personalInfoForm.control}
                        render={({ field }) => (
                          <FormItem className="space-y-1 lg:space-y-3">
                            <FormLabel className="font-poppins text-xs font-medium lg:text-sm">
                              Email Address *
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isPending}
                                placeholder="Enter email"
                                type="email"
                                {...field}
                                className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      disabled={isPending}
                      className="flex h-[52px] w-full items-center"
                    >
                      {isPending && (
                        <Loader2 className="me-2 size-4 animate-spin" />
                      )}
                      Update Profile
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
            <div className="col-span-12 flex flex-col  gap-5 rounded-md border border-[#e9e9e9e] bg-white p-[20px] lg:col-span-5">
              <div className="space-y-[10px]">
                <h2 className=" font-poppins text-base font-medium text-black lg:text-lg xl:text-xl 2xl:text-2xl">
                  Address
                </h2>
                <Form {...personalAddressForm}>
                  <form
                    onSubmit={personalAddressForm.handleSubmit(
                      handleSubmitAddress
                    )}
                    className="space-y-[18px] xl:space-y-[23px]"
                  >
                    <FormField
                      name="address"
                      control={personalAddressForm.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1 lg:space-y-3">
                          <FormLabel className="font-poppins text-xs font-medium md:text-base">
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
                      control={personalAddressForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1 lg:gap-3">
                          <FormLabel className="font-poppins text-xs font-medium lg:text-sm">
                            City/State
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
                                  placeholder="Select State"
                                  className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="abuja">Abuja</SelectItem>
                              <SelectItem value="lagos">Lagos</SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="country"
                      control={personalAddressForm.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1 lg:space-y-3">
                          <FormLabel className="font-poppins text-xs font-medium md:text-base">
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
                      control={personalAddressForm.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1 lg:space-y-3">
                          <FormLabel className="font-poppins text-xs font-medium md:text-base">
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
                    <Button
                      disabled={isPending}
                      className="flex h-[52px] w-full items-center"
                    >
                      {" "}
                      {isPending && (
                        <Loader2 className="me-2 size-4 animate-spin" />
                      )}
                      Update Address
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
          <div className="flex  flex-col gap-5 rounded-md border border-[#e9e9e9e] bg-white p-[20px]">
            <div className="space-y-[10px]">
              <h2 className=" font-poppins text-base font-medium text-black lg:text-lg xl:text-xl 2xl:text-2xl">
                General Health Information
              </h2>
              <Form {...personalInfoForm}>
                <form
                  onSubmit={generalInfoForm.handleSubmit(handleSubmitHealth)}
                  className="space-y-[18px] lg:space-y-[23px]"
                >
                  <div className="grid gap-x-[10px] gap-y-3 pt-[15px] lg:grid-cols-2 lg:gap-y-6">
                    <FormField
                      control={generalInfoForm.control}
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
                                disabled={true}
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
                              <SelectItem
                                className="cursor-pointer"
                                value="AB+"
                              >
                                AB+
                              </SelectItem>
                              <SelectItem
                                className="cursor-pointer"
                                value="AB-"
                              >
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
                      control={generalInfoForm.control}
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
                                disabled={true}
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
                      control={generalInfoForm.control}
                      name="medications"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-3">
                          <FormLabel className="font-poppins text-sm font-medium">
                            Medications (current prescriptions or OTC
                            medications)
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className="h-[52px]"
                                disabled={true}
                              >
                                <SelectValue
                                  placeholder="Medications"
                                  className="no-focus w-full rounded-[6px] border border-black/20 font-poppins text-base shadow-none"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem
                                className="cursor-pointer"
                                value="none"
                              >
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
                              <SelectItem
                                className="cursor-pointer"
                                value="insulin"
                              >
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
                              <SelectItem
                                className="cursor-pointer"
                                value="aspirin"
                              >
                                Aspirin
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalInfoForm.control}
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
                                disabled={true}
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
                    {props.user.bio_data_confirmed === 0 && (
                      <div className="flex h-[48px] items-center justify-between rounded-md bg-[#E9C46A1A] p-[12px]">
                        <div className="flex items-center">
                          <CircleAlert className="me-2 size-4 text-primary" />
                          <span className="text-sm font-normal text-primary">
                            Please verify your Blood Group & Genotype
                          </span>
                        </div>
                        <ImageUploadDialog
                          name="photo"
                          dialogTitle="Upload Test Results"
                          showAction
                          trigger={
                            <div className="flex items-center gap-2">
                              <Button
                                variant={"link"}
                                disabled={isPending}
                                className="bg-transparent text-base font-medium text-primary underline dark:bg-transparent"
                              >
                                Verify Now
                              </Button>
                            </div>
                          }
                          form={personalInfoForm}
                          // user={props.user}
                          pathname="/dashboard/settings"
                        />
                      </div>
                    )}
                  </div>
                  {/* <Button
                    disabled={isPending}
                    className="flex h-[52px] w-fit items-center"
                  >
                    {" "}
                    {isPending && (
                      <Loader2 className="me-2 size-4 animate-spin" />
                    )}
                    Update Profile
                  </Button> */}
                </form>
              </Form>
            </div>
          </div>{" "}
        </TabsContent>
        <TabsContent value="fund-wallet" className="mt-10">
          <Form {...billingForm}>
            <form
              // onSubmit={billingForm.handleSubmit(handleSubmitUnits)}
              className=" space-y-[23px]"
            >
              <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
                <div className="col-span-12 flex flex-col  gap-5 rounded-md border border-[#e9e9e9e] bg-white p-[20px] lg:col-span-7">
                  <div className="space-y-[16px]">
                    <h2 className=" font-poppins text-base font-semibold text-black md:text-lg xl:text-2xl">
                      Buy Units
                    </h2>
                    <FormField
                      name="amount"
                      control={billingForm.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1 lg:space-y-3">
                          <FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="155"
                              type="number"
                              {...field}
                              className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                            />
                          </FormControl>
                          <FormDescription className="text-[#0BA434 text-xs font-semibold">
                            {billingForm.getValues("amount") &&
                              toCurrency(
                                Number(billingForm.getValues("amount")) * 1278
                              )}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    {billingForm.watch("amount") && (
                      <div className="mt-6 space-y-4">
                        <span className="flex flex-col items-start justify-between gap-2 border-b border-[#EAEAEA] pb-4 lg:flex-row lg:items-center">
                          <span className="text-sm font-medium uppercase text-[#777]">
                            subtotal
                          </span>
                          <span className="text-sm font-semibold text-[#222] underline">
                            {billingForm.watch("amount") &&
                              toCurrency(
                                Number(billingForm.watch("amount")) * 1278
                              )}
                          </span>
                        </span>
                        {/* <span className="flex flex-col items-start justify-between gap-2 border-b border-[#EAEAEA] pb-4 lg:flex-row lg:items-center">
                          <span className="text-sm font-medium uppercase text-[#777]">
                            Estimated Taxes
                          </span>
                          <span className="text-sm font-semibold text-[#222] underline">
                            {billingForm.watch("amount") && toCurrency(7000)}
                          </span>
                        </span> */}
                        <span className="flex flex-col items-start justify-between gap-2 border-b border-[#EAEAEA] pb-4 lg:flex-row lg:items-center">
                          <span className="text-sm font-medium uppercase text-[#777]">
                            Estimated Total
                          </span>
                          <span className="text-sm font-semibold text-[#222] underline">
                            {billingForm.getValues("amount") &&
                              toCurrency(
                                Number(billingForm.getValues("amount")) * 1227
                              )}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-12 flex flex-col  gap-5 rounded-md border border-[#e9e9e9e] bg-white p-[20px] lg:col-span-5">
                  <div className="flex flex-col justify-between gap-5">
                    <h2 className=" font-poppins text-base font-semibold text-black md:text-lg xl:text-2xl">
                      Add a billing method
                    </h2>
                    <FormField
                      control={billingForm.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-1 lg:space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-5"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="payment_card" />
                                </FormControl>
                                <div className="flex items-center gap-2">
                                  <h6 className="text-base font-normal text-[#4E4E4E]">
                                    Payment Card
                                  </h6>
                                  <Image
                                    src="/assets/images/payment_method.png"
                                    alt="payment_method"
                                    width={109}
                                    height={20}
                                    className="object-contain"
                                  />
                                </div>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="bank_transfer" />
                                </FormControl>
                                <div className="flex items-center gap-2">
                                  <h6 className="text-base font-normal text-[#4E4E4E]">
                                    Bank Transfer
                                  </h6>
                                </div>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center gap-2 rounded-md bg-[#E9C46A1A] p-3">
                      <CircleAlert className="size-4 text-primary" />
                      <p className="text-xs font-normal text-primary md:text-sm">
                        You will be redirected to payment interface{" "}
                      </p>
                    </div>
                    {billingForm.watch("amount") && (
                      <Button
                        disabled={isPending}
                        onClick={initiatePayment}
                        type="submit"
                        className="mt-auto flex h-[52px] w-full"
                      >
                        {isPending && (
                          <Loader2 className="me-2 size-4 animate-spin" />
                        )}
                        Pay{" "}
                        {billingForm.watch("amount") &&
                          toCurrency(
                            Number(billingForm.watch("amount")) * 1278 + 7000
                          )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="security" className="mt-10">
          <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
            <div className="col-span-12 flex flex-col  gap-5 rounded-md border border-[#e9e9e9e] bg-white p-[20px] lg:col-span-8">
              <div className="space-y-[16px]">
                <h2 className=" font-poppins text-base font-semibold text-black md:text-lg xl:text-2xl">
                  Security & Privacy
                </h2>
                <div className="mt-6 space-y-4">
                  <span className="flex flex-col items-start justify-between gap-2 border-b border-[#EAEAEA] pb-4 lg:flex-row lg:items-center">
                    <span className="flex flex-col gap-2 text-sm font-medium text-[#202020]">
                      Email
                      <span className="flex flex-col items-start gap-2 text-base font-medium text-[#8c8c8c] lg:flex-row lg:items-center">
                        {props.user.email}
                        {props.user.email_verified_at ? (
                          <Badge className="rounded-full bg-green-900 px-[8px] py-[3px] text-xs lg:ms-3">
                            Verified <CheckCheck className="ms-2 size-3" />
                          </Badge>
                        ) : (
                          <Badge className="rounded-full bg-[#BABABA] px-[8px] py-[3px] text-xs lg:ms-3">
                            Unverified <CheckCheck className="ms-2 size-3" />
                          </Badge>
                        )}
                      </span>
                    </span>
                    {!props.user.email_verified_at && (
                      <Dialog
                        open={openOTPModal}
                        onOpenChange={setOpenOTPModal}
                      >
                        <DialogTrigger className="flex items-start justify-start">
                          <Button
                            variant={"link"}
                            className="h-fit p-0 text-sm font-semibold text-primary underline hover:bg-transparent"
                          >
                            Verify Now
                          </Button>
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
                                  Enter the OTP you recieved in your mail
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
                                    disabled={true}
                                    // onClick={() =>
                                    //   handleConfirmOTP(props.user.email, OTP)
                                    // }
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
                                        resendEnabled
                                          ? ""
                                          : "cursor-default opacity-50"
                                      }`} // Style disabled state
                                      onClick={
                                        resendEnabled
                                          ? handleResendClick
                                          : undefined
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
                                  The email you will recieve OTP
                                </DialogDescription>

                                <div className="mt-2 space-y-3">
                                  <div className="flex flex-col gap-1">
                                    <label className="font-poppins text-sm font-medium">
                                      Email
                                    </label>
                                    <Input
                                      disabled={true}
                                      placeholder="Enter email"
                                      type="text"
                                      value={props.user.email}
                                      className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                                    />
                                  </div>
                                  <Button
                                    disabled={true}
                                    // onClick={() =>
                                    //   handleSendOTP(form.watch("phoneNumber"))
                                    // }
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
                      </Dialog>
                    )}
                  </span>
                  <span className="flex flex-col items-start justify-between gap-2 border-b border-[#EAEAEA] pb-4 lg:flex-row lg:items-center">
                    <span className="flex flex-col gap-2 text-sm font-medium text-[#202020]">
                      Phone Number
                      <span className="flex flex-col items-start gap-2 text-base font-medium text-[#8c8c8c] lg:flex-row lg:items-center">
                        +2348129023087{" "}
                        {props.user.has_confirmed_phone_number === "done" ? (
                          <Badge className="rounded-full bg-green-900 px-[8px] py-[3px] text-xs lg:ms-3">
                            Verified <CheckCheck className="ms-2 size-3" />
                          </Badge>
                        ) : (
                          <Badge className="rounded-full bg-[#BABABA] px-[8px] py-[3px] text-xs lg:ms-3">
                            Unverified <CheckCheck className="ms-2 size-3" />
                          </Badge>
                        )}
                      </span>
                    </span>
                    {props.user.has_confirmed_phone_number !== "done" && (
                      <VerifyPhoneNumber
                        disabledPhone={true}
                        disabled={true}
                        trigger={
                          <Button
                            className="size-fit p-0 text-sm font-semibold text-primary underline"
                            variant={"link"}
                          >
                            Verify Now
                          </Button>
                        }
                        number={props.user.phone}
                      />
                    )}
                  </span>
                  <span className="flex flex-col items-start justify-between gap-2 border-b border-[#EAEAEA] pb-4 lg:flex-row lg:items-center">
                    <span className="flex flex-col gap-2 text-sm font-medium text-[#202020]">
                      Password Management
                    </span>
                    <ChangePasswordModal
                      trigger={
                        <Button
                          variant={"link"}
                          className="size-fit p-0 text-sm font-semibold text-primary underline hover:bg-transparent"
                        >
                          Change Password
                        </Button>
                      }
                      user={props.user}
                    />
                  </span>
                  <span className="flex flex-col items-start justify-between gap-2 border-b border-[#EAEAEA] pb-4 lg:flex-row lg:items-center">
                    <span className="flex flex-col gap-2 text-sm font-medium text-[#202020]">
                      Two-step verification
                      <span className="text-xs font-normal text-[#8c8c8c]">
                        Add an extra layer of security by requiring a second
                        form of authentication{" "}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-primary underline">
                      Enable Now
                    </span>
                  </span>
                  <span className="flex flex-col items-start justify-between gap-2 border-b border-[#EAEAEA] pb-4 lg:flex-row lg:items-center">
                    <span className="flex flex-col gap-2 text-sm font-medium text-[#202020]">
                      Data Privacy{" "}
                      <span className="text-xs font-normal text-[#8c8c8c]">
                        Specify how the platform uses and shares user data
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-primary underline">
                      Read our privacy
                    </span>
                  </span>
                  <span className="flex flex-col items-start justify-between gap-2 border-b border-[#EAEAEA] pb-4 lg:flex-row lg:items-center">
                    <span className="flex flex-col gap-2 text-sm font-medium text-[#202020]">
                      Audit logs
                      <span className="text-xs font-normal text-[#8c8c8c]">
                        Audit logs allow you to monitor usage and detect
                        suspicious activities
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-primary underline">
                      View log
                    </span>
                  </span>
                  <span className="flex flex-col items-start justify-between gap-2 border-b border-[#EAEAEA] pb-4 lg:flex-row lg:items-center">
                    <span className="flex flex-col gap-2 text-sm font-medium text-[#202020]">
                      Export/Archive Data
                      <span className="text-xs font-normal text-[#8c8c8c]">
                        Export or archive of all your personal information and
                        account data.
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-primary underline">
                      Export data
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-12 flex flex-col  gap-5 p-[20px]  lg:col-span-4 "></div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
