// import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { UpdateUserRole } from "@/app/actions/auth.actions";
import { cn } from "@/lib/utils";
import { onboardingStepOneSchema } from "@/lib/validations";
import { TimelineItemType } from "@/types";
import { User } from "@/types/main";

import OnboardingPersonalForm from "../forms/onboarding-personal-info-form";
import SignUpCarousel from "../shared/sliders/sign-up-carousel";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Timeline,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineTitle,
} from "../ui/timeline";

const timelineData: TimelineItemType[] = [
  {
    id: 1,
    title: "Collect & Upload Data",
    description:
      "Capture DNA evidence with a few taps, using our guided collection process to minimize errors and maintain chain of custody",
    // time: 'May, 2020',
  },
  {
    id: 2,
    title: "Data Analysis & Matching",
    description:
      "Our advanced tools give you deep insights into DNA profiles. Start by uploading your sample, and we’ll take care of the rest.",
    // time: 'January, 2023',
  },
  {
    id: 3,
    title: "Collaborative Case Management",
    description:
      "Stay updated on case progress and evidence from your team and partner agencies, all in one place.",
    // time: 'November, 2024',
  },
];

type Props = {
  user: User;
};

export default function OnboardingStepOne(props: Props) {
  const stage = props.user.user_type !== null ? 2 : 1;
  const [formStage, setFormStage] = React.useState(stage); // 1: PROVIDER
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof onboardingStepOneSchema>>({
    resolver: zodResolver(onboardingStepOneSchema),
  });
  const handleBack = () => {
    setFormStage(formStage - 1);
  };

  const handleNext = () => {
    setFormStage(formStage + 1);
  };

  const handleSubmitRole = async (
    values: z.infer<typeof onboardingStepOneSchema>
  ) => {
    startTransition(() => {
      UpdateUserRole(values).then((data) => {
        if (data?.error) {
          toast(data.error);
        }

        if (data?.success) {
          toast(data.success);
          setFormStage((prevStep) => prevStep + 1);

          form.reset();
        }
      });
    });
  };
  const renderStage = () => {
    if (formStage === 1) {
      return (
        <>
          <div className="flex flex-col items-start justify-center space-y-[30px] py-10 lg:space-y-[56px]">
            <Image
              src="/assets/images/DNA.png"
              width={278}
              height={100}
              alt="logo"
              className="h-[168px] w-[373px] object-contain "
            />
            <div className="w-full space-y-4 lg:space-y-8">
              <div className="space-y-2 lg:space-y-4">
                <h2 className="text-xl font-semibold text-[#3b3b3b] lg:text-3xl">
                  Let’s personalize your experience!
                </h2>
                <p className="text-sm font-normal text-[#636363] lg:text-base">
                  What role best describes you?{" "}
                </p>
              </div>
              <div>
                <Form {...form}>
                  <form
                    className="space-y-8"
                    onSubmit={form.handleSubmit(handleSubmitRole)}
                  >
                    <FormField
                      name="role"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                              disabled={isPending}
                            >
                              <FormItem className="flex items-center justify-between space-x-3 space-y-0 rounded-[6px] border border-[#E5E5E5] bg-[#FCFCFC] p-[24px] shadow-md data-[state=checked]:border-primary">
                                <FormLabel className=" text-base font-medium text-[#3b3b3b]">
                                  Patient
                                </FormLabel>
                                <FormControl>
                                  <RadioGroupItem
                                    className="size-6"
                                    value="patient"
                                  />
                                </FormControl>
                              </FormItem>
                              <FormItem className="flex items-center justify-between space-x-3 space-y-0 rounded-[6px] border border-[#E5E5E5] bg-[#FCFCFC] p-[24px] shadow-md">
                                <FormLabel className=" text-base font-medium text-[#3b3b3b]">
                                  Admin
                                </FormLabel>
                                <FormControl>
                                  <RadioGroupItem
                                    className="size-6"
                                    value="admin"
                                  />
                                </FormControl>
                              </FormItem>
                              <FormItem className="flex items-center justify-between space-x-3 space-y-0 rounded-[6px] border border-[#E5E5E5] bg-[#FCFCFC] p-[24px] shadow-md">
                                <FormLabel className=" text-base font-medium text-[#3b3b3b]">
                                  Analyst
                                </FormLabel>
                                <FormControl>
                                  <RadioGroupItem
                                    className="size-6"
                                    value="analyst"
                                  />
                                </FormControl>
                              </FormItem>
                              <FormItem className="flex items-center justify-between space-x-3 space-y-0 rounded-[6px] border border-[#E5E5E5] bg-[#FCFCFC] p-[24px] shadow-md">
                                <FormLabel className=" text-base font-medium text-[#3b3b3b]">
                                  Other
                                </FormLabel>
                                <FormControl>
                                  <RadioGroupItem
                                    className="size-6"
                                    value="other"
                                  />
                                </FormControl>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="flex h-[52px] w-full items-center"
                      disabled={isPending}
                    >
                      {isPending && (
                        <Loader2 className="me-2 size-4 animate-spin" />
                      )}
                      Continue
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
          <div className="hidden h-full lg:flex">
            <SignUpCarousel />
          </div>
        </>
      );
    } else if (formStage === 2) {
      return (
        <>
          <div className="flex flex-col items-start justify-center space-y-[30px] py-10 lg:space-y-[56px] lg:px-[100px]">
            <Image
              src="/assets/images/how_it_works.png"
              width={278}
              height={100}
              alt="logo"
              className="h-[168px] w-[373px] object-contain object-left"
            />
            <div className="w-full space-y-4 lg:space-y-8">
              <div className="space-y-2 lg:space-y-4">
                <h2 className="text-xl font-semibold text-[#3b3b3b] lg:text-3xl">
                  Let’s show you how it works!{" "}
                </h2>
              </div>
              <div>
                {/* <div>
                  {timelineData.map((item) => (
                    <div key={item.id} className=" relative group pl-6">
                      <div className=" mb-1 flex flex-col items-start before:absolute before:left-2 before:h-full before:-translate-x-1/2 before:translate-y-3 before:self-start before:bg-slate-300 before:px-px after:absolute after:left-2 after:box-content after:h-2 after:w-2 after:-translate-x-1/2 after:translate-y-1.5 after:rounded-full after:border-4 after:border-primary-foreground/95 after:bg-foreground group-last:before:hidden sm:flex-row ">
                        <h4 className="text-xl font-bold text-primary">
                          {item.title}
                        </h4>
                      </div>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div> */}
                <Timeline className="">
                  {timelineData.map((item) => (
                    <TimelineItem key={item.id} className="pb-8 pl-8 sm:!pl-6">
                      <TimelineHeader className="sm:before:left-0 sm:before:ml-0 sm:after:left-0 sm:after:ml-0">
                        <TimelineTitle className="font-poppins text-base text-[#3b3b3b]">
                          {item.title}
                        </TimelineTitle>
                      </TimelineHeader>
                      <TimelineDescription className="max-w-[420px] font-poppins text-sm font-normal text-[#636363]">
                        {item.description}
                      </TimelineDescription>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
            </div>
            <div className="flex w-full items-center justify-between border-t pt-[30px]">
              <Button variant={"link"} type="button" onClick={handleBack}>
                Back
              </Button>
              <Button variant={"link"} type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>
          <div className="hidden h-full lg:flex">
            <SignUpCarousel />
          </div>
        </>
      );
    } else if (formStage === 3) {
      return (
        <>
          <div className="flex flex-col items-start justify-center space-y-[30px] py-10 lg:space-y-[56px] lg:px-[100px]">
            <Image
              src="/assets/images/mobile_encrypt.png"
              width={278}
              height={100}
              alt="logo"
              className="h-[168px] w-[373px] object-contain object-left "
            />
            <div className="w-full space-y-4 lg:space-y-8">
              <div className="space-y-2 lg:space-y-4">
                <h2 className="text-xl font-semibold text-[#3b3b3b] lg:text-3xl">
                  Data Privacy & Security{" "}
                </h2>
                <p className="text-sm font-normal text-[#636363] lg:text-base">
                  Your data security is our priority. All information is
                  encrypted and stored according to forensic industry standards.{" "}
                </p>
              </div>
            </div>
            <div className="flex w-full items-center justify-between border-t pt-[30px]">
              <Button variant={"link"} type="button" onClick={handleBack}>
                Back
              </Button>
              <Button variant={"link"} type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>
          <div className="hidden h-full lg:flex">
            <SignUpCarousel />
          </div>
        </>
      );
    } else if (formStage === 4) {
      return (
        <>
          <div className="col-span-12 mr-6 h-full space-y-5 rounded-[12px] bg-primary p-10 text-white lg:col-span-3 lg:mr-0">
            <h3 className="text-xl font-semibold lg:text-2xl xl:text-3xl">
              Personal Details
            </h3>
            <p className="text-xs font-normal md:text-sm lg:text-base">
              We need some basic information to personalize your experience and
              ensure we provide accurate and secure services. Your data is
              protected and will only be used in accordance with our privacy
              policy. By providing this information, you agree to our data usage
              practices. For more details, please review our Privacy Policy.
            </p>
          </div>
          <div className="col-span-12 mr-6 pb-8 lg:col-span-9 lg:mr-0">
            <OnboardingPersonalForm email={props.user.email} />
          </div>
        </>
      );
    }
  };
  return (
    <div
      className={cn(
        "grid h-screen w-full  gap-10 p-6  lg:p-10",
        formStage < 4 ? "lg:grid-cols-2" : "grid-cols-12"
      )}
    >
      {renderStage()}
    </div>
  );
}
