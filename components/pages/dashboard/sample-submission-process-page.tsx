"use client";
import { ArrowRight, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

import { SaveSampleProcess } from "@/app/actions/samples.actions";
import PageTitleHeader from "@/components/shared/page-title-header";
import CrownIcon from "@/icons/crown-icon";
import { cn } from "@/lib/utils";
import useFormStore from "@/store/sample-submission";

const SampleSubmissionProcessPage = () => {
  const [isPending, startTransition] = useTransition();
  const { updateFormData, formData } = useFormStore();
  const pathname = usePathname();
  const router = useRouter();
  const [submissionProcess, setSubmissionProcess] = useState<string>(
    formData.submissionProcess
  );

  if (!formData.sampleID) {
    router.push("/dashboard/sample-submission");
  }
  const handlePickUpSubmit = async () => {
    startTransition(async () => {
      setSubmissionProcess("pickup");
      const mainFormData = new FormData();
      mainFormData.append("sample_process", "pickup");
      mainFormData.append("sampleId", formData.sampleID);
      await SaveSampleProcess(mainFormData, pathname).then((data) => {
        if (data?.error) {
          toast(data.error);
        }
        if (data?.message) {
          toast(data.message);
        }
        if (data?.invalid) {
          data.invalid.forEach((err) => toast(err));
        }
        if (data?.success) {
          if (updateFormData) {
            updateFormData("submissionProcess", "pickup");
            router.push(
              "/dashboard/sample-submission/submission-process/instructions"
            );
          }
          toast(data.success);
        }
      });
    });
  };
  const handleDropOffSubmit = async () => {
    startTransition(async () => {
      setSubmissionProcess("dropoff");
      const mainFormData = new FormData();
      mainFormData.append("sample_process", "dropoff");
      mainFormData.append("sampleId", formData.sampleID);
      await SaveSampleProcess(mainFormData, pathname).then((data) => {
        if (data?.error) {
          toast(data.error);
        }
        if (data?.message) {
          toast(data.message);
        }
        if (data?.invalid) {
          data.invalid.forEach((err) => toast(err));
        }
        if (data?.success) {
          if (updateFormData) {
            updateFormData("submissionProcess", "dropoff");
            router.push(
              "/dashboard/sample-submission/submission-process/instructions"
            );
          }
          toast(data.success);
        }
      });
    });
  };

  console.log(submissionProcess);
  return (
    <>
      <PageTitleHeader page="Submission Process" />
      <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
        <div className="col-span-12 space-y-8 lg:col-span-8">
          <div className="flex flex-col gap-4 rounded-[8px] bg-white p-6 lg:p-8">
            <div className="space-y-1">
              <h6 className="text-base font-medium text-[#323232] lg:text-lg">
                Select sample submission process
              </h6>
              <p className="text-xs font-normal text-[#4E4E4E]">
                Choose your sample collection preference{" "}
              </p>
            </div>
            <div className="grid items-center gap-6 lg:grid-cols-2">
              <div
                className={cn(
                  "flex h-[314px] relative cursor-pointer flex-col justify-between rounded-[8px] border border-[#EFEFEF] p-6 hover:bg-accent",
                  formData.submissionProcess === "pickup" && "bg-accent"
                )}
                onClick={handlePickUpSubmit}
              >
                {/* {isPending && (
                  <div className="bg-black-20 left-0 top-0 flex size-full items-center justify-center">
                    <Loader2 className="size-5 animate-spin text-primary" />
                  </div>
                )} */}
                <div className="space-y-3">
                  <span className="flex items-center text-xs font-medium uppercase">
                    <CrownIcon className="me-2" />
                    VIP
                  </span>
                  <div>
                    <h5 className="text-2xl font-bold text-[#222222] ">
                      Pick Up
                    </h5>
                    <p className="text-xs font-normal text-[#797979]">
                      A professional will come and extract the sample
                    </p>
                  </div>
                </div>
                {isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ArrowRight className="mt-auto flex text-sm font-bold text-primary" />
                )}{" "}
              </div>
              <div
                className={cn(
                  "flex h-[314px] relative cursor-pointer flex-col justify-between rounded-[8px] border border-[#EFEFEF] p-6 hover:bg-accent",
                  formData.submissionProcess === "dropoff" && "bg-accent"
                )}
                onClick={handleDropOffSubmit}
              >
                {/* {isPending && (
                  <div className="bg-black-20 left-0 top-0 flex size-full items-center justify-center">
                    <Loader2 className="size-5 animate-spin text-primary" />
                  </div>
                )} */}
                <div className="space-y-3">
                  <span className="flex items-center text-xs font-medium uppercase">
                    REGULAR
                  </span>
                  <div>
                    <h5 className="text-2xl font-bold text-[#222222] ">
                      Drop Off{" "}
                    </h5>
                    <p className="text-xs font-normal text-[#797979]">
                      You will be provided with a drop off location{" "}
                    </p>
                  </div>
                </div>
                {isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ArrowRight className="mt-auto flex text-sm font-bold text-primary" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4"></div>
      </div>
    </>
  );
};

export default SampleSubmissionProcessPage;
