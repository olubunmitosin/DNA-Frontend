"use client";
import { ChevronRight, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

import { getSampleByID, SaveSampleType } from "@/app/actions/samples.actions";
import PageTitleHeader from "@/components/shared/page-title-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { testTypes } from "@/constants";
import useFormStore from "@/store/sample-submission";

const SampleSubmissionPage = () => {
  const { updateFormData, formData } = useFormStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTranstion] = useTransition();
  const [testType, setTestType] = useState<string>(formData.testType);

  const handleSampleType = async () => {
    startTranstion(async () => {
      const mainData = new FormData();
      mainData.append("test_performed", testType);

      if (formData.sampleID) {
        const anData = new FormData();
        anData.append("sampleId", formData.sampleID);
        const sampleExists = await getSampleByID(anData);
        if (sampleExists?.success) {
          if (updateFormData) {
            updateFormData("testType", testType);
          }
          router.push("/dashboard/sample-submission/submission-process");
        }
      } else {
        await SaveSampleType(mainData, pathname).then((data) => {
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
              updateFormData("testType", testType);
              updateFormData("sampleID", data.data.sampleId);
            }
            router.push("/dashboard/sample-submission/submission-process");
          }
        });
      }
    });
  };
  return (
    <>
      <PageTitleHeader page="Sample Submission" />
      <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
        <div className="col-span-12 space-y-8 lg:col-span-8">
          <div className="flex flex-col gap-4 rounded-[8px] bg-white p-6 lg:p-8">
            <div className="space-y-1">
              <h6 className="text-base font-medium text-[#323232] lg:text-lg">
                Sample 01
              </h6>
              <p className="text-xs font-normal text-[#4E4E4E]">
                What test do you want to perform?
              </p>
            </div>
            <Select
              onValueChange={(value) => setTestType(value)}
              defaultValue={testType}
            >
              <SelectTrigger
                className="w-fit lg:w-[371px]"
                disabled={isPending}
              >
                <SelectValue
                  placeholder="Select Submission"
                  className="w-[371px]"
                />
              </SelectTrigger>
              <SelectContent>
                {testTypes.map((test) => (
                  <SelectItem
                    className="cursor-pointer"
                    key={test.value}
                    value={test.value}
                  >
                    {test.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center">
              <Button
                className="relative flex items-center"
                disabled={isPending}
                onClick={handleSampleType}
              >
                {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
                Proceed <ChevronRight />
              </Button>
              <Button className="" variant={"link"}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4"></div>
      </div>
    </>
  );
};

export default SampleSubmissionPage;
