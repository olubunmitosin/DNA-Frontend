"use client";
import { ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

import PageTitleHeader from "@/components/shared/page-title-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useFormStore from "@/store/sample-submission";

const InstructionsPage = () => {
  const { updateFormData, formData } = useFormStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isGeneticTest = formData.testType === "genetic-test";
  const submissionProcess = formData.submissionProcess;

  if (!formData.sampleID) {
    router.push("/dashboard/sample-submission");
  }

  const handleIns = () => {
    startTransition(() => {
      router.push(
        submissionProcess === "dropoff"
          ? isGeneticTest
            ? "/dashboard/sample-submission/submission-process/instructions/test-form"
            : "/dashboard/sample-submission/submission-process/instructions/booking-details"
          : "/dashboard/sample-submission/submission-process/instructions/address-confirmation"
      );
    });
  };
  return (
    <>
      <PageTitleHeader page="Sample Instructions" />
      <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
        <div className="col-span-12 space-y-8 lg:col-span-8">
          <div className="flex flex-col gap-4 bg-white">
            <div className="grid grid-cols-12">
              <div className="col-span-12 flex flex-col  gap-5 bg-[#FDF9F0] p-4 lg:col-span-7">
                <Badge className="w-fit rounded-[4px] bg-[#CA0404] px-[12px] py-[4px] font-poppins text-sm font-medium text-white">
                  Instructions
                </Badge>
                <div className="flex items-center gap-2">
                  {/* <span className="text-5xl text-left font-normal text-primary">
                    1
                  </span> */}
                  <div className="flex items-center justify-center rounded-full bg-primary/20 p-1">
                    <div className="size-2 rounded-full bg-primary" />
                  </div>
                  <span className="font-poppins text-xs font-normal text-primary">
                    {submissionProcess === "pickup"
                      ? "Make sure to have your order ID and a form of identification ready. This will help the lab technician confirm your appointment and verify your identity"
                      : "Ensure your sample is sealed and labeled correctly with your name and order ID."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <span className="text-5xl text-left font-normal text-primary">
                    2
                  </span> */}
                  <div className="flex items-center justify-center rounded-full bg-primary/20 p-1">
                    <div className="size-2 rounded-full bg-primary" />
                  </div>
                  <span className="font-poppins text-xs font-normal text-primary">
                    {submissionProcess === "pickup"
                      ? "Do not eat, drink (except water), smoke, or chew gum at least 30 minutes before the collection."
                      : "Bring your sample to the selected drop-off location at the scheduled time and day."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <span className="text-5xl text-left font-normal text-primary">
                    3
                  </span> */}
                  <div className="flex items-center justify-center rounded-full bg-primary/20 p-1">
                    <div className="size-2 rounded-full bg-primary" />
                  </div>
                  <span className="font-poppins text-xs font-normal text-primary">
                    {submissionProcess === "pickup"
                      ? "If you have unique needs, medical conditions, or mobility challenges, let the technician or service provider know in advance"
                      : "Let the staff know you&apos;re there to submit a DNA sample. Some locations may ask you to provide identification or fill out a brief form."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <span className="text-5xl text-left font-normal text-primary">
                    4
                  </span> */}
                  <div className="flex items-center justify-center rounded-full bg-primary/20 p-1">
                    <div className="size-2 rounded-full bg-primary" />
                  </div>
                  <span className="font-poppins text-xs font-normal text-primary">
                    {submissionProcess === "pickup"
                      ? "Ensure your environment is ready for the sample extraction by clearing a clean and quiet space for the process."
                      : "Request a receipt or have the staff confirm receipt in your app to track your sample’s progress."}
                  </span>
                </div>
              </div>
              <div className="relative col-span-12 size-full lg:col-span-5">
                <Image
                  fill
                  src={
                    submissionProcess === "pickup"
                      ? "/assets/images/instructions-pickup.png"
                      : "/assets/images/instructions.png"
                  }
                  alt="sample instruction"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 px-4 py-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.instructionsAccepted}
                  disabled={isPending}
                  onCheckedChange={(value) => {
                    if (updateFormData) {
                      updateFormData("instructionsAccepted", value);
                    }
                  }}
                />
                <Label className="!m-0 text-sm font-normal text-[#767676]">
                  I have read and understood the instruction above{" "}
                </Label>
              </div>
              <div className="flex items-center">
                <Button
                  disabled={isPending}
                  className="flex items-center"
                  onClick={handleIns}
                >
                  {isPending && (
                    <Loader2 className="me-2 size-4 animate-spin" />
                  )}
                  Proceed <ChevronRight className="size-4" />
                </Button>
                <Button variant={"link"}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4"></div>
      </div>
    </>
  );
};

export default InstructionsPage;
