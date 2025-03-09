"use client";
import { formatDate } from "date-fns";
import { CircleAlert, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import PageTitleHeader from "@/components/shared/page-title-header";
import { Button } from "@/components/ui/button";
import { sampleTypes, testTypes } from "@/constants";
import { formatDateUtil } from "@/lib/utils";
import useFormStore from "@/store/sample-submission";
import { SamplesDatum } from "@/types";

type Props = {
  sample: SamplesDatum;
};

const SampleDetailsPage = (props: Props) => {
  const { formData, updateFormData } = useFormStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const continueSubmission = async () => {
    setIsLoading(true);
    if (updateFormData) {
      updateFormData("sampleID", props.sample.sampleId);
      updateFormData("testType", props.sample.test_performed);
      updateFormData("submissionProcess", props.sample.sample_process);
      updateFormData(
        "instructionsAccepted",
        props.sample.instruction_accepted === "yes"
      );
      if (props.sample.test_performed === "genetid-test") {
        updateFormData("testForm", {
          ...formData.testForm,
          purposeOfTesting: props.sample.purpose_of_test,
          predisposingCondition: props.sample.has_predisposing,
          predisposingConditionDetails: props.sample.predisposing_condition,
          // typeOfGeneticTest: z.string(),
          testFocusArea: props.sample.test_focus_area,
        });
      }
      router.push("/dashboard/sample-submission/submission-process");
    }
    setIsLoading(false);
  };
  return (
    <>
      <PageTitleHeader page="Sample Details" />
      <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
        <div className="col-span-12 space-y-8 lg:col-span-5">
          <div className="flex flex-col gap-4 space-y-6 rounded-[8px] bg-white p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <h4 className="font-poppins text-lg font-semibold text-[#222] lg:text-xl xl:text-2xl">
                Order Details
              </h4>
              {props.sample.status === "draft" && (
                <Button
                  disabled={isLoading}
                  onClick={continueSubmission}
                  className="flex items-center"
                >
                  {isLoading && (
                    <Loader2 className="me-2 size-4 animate-spin" />
                  )}
                  Continue Submission
                </Button>
              )}
            </div>
            <div className="space-y-3">
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample ID
                </span>
                <span className="text-sm text-[#222] underline">
                  {props.sample.sampleId}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Type of Test
                </span>
                <span className="text-sm text-[#222] underline">
                  {
                    testTypes.find(
                      (test) => test.value === props.sample.test_performed
                    )?.name
                  }
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample submission type{" "}
                </span>
                <span className="text-sm capitalize text-[#222] underline">
                  {props.sample.sample_process}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample Type{" "}
                </span>
                <span className="text-sm text-[#222] underline">
                  {
                    sampleTypes.find(
                      (sample) => sample.value === props.sample.sample_type
                    )?.name
                  }
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample Collection Date{" "}
                </span>
                <span className="text-sm text-[#222] underline">
                  {formatDateUtil(props.sample.collection_date || new Date())}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample Collection Time{" "}
                </span>
                <span className="text-sm text-[#222] underline">
                  {props.sample.collection_time}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Chain of Custody Started{" "}
                </span>
                <span className="text-sm text-[#222] underline">Yes</span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Relationship to donor{" "}
                </span>
                <span className="text-sm capitalize text-[#222] underline">
                  {props.sample.relationship_donor}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Drop Off Address{" "}
                </span>
                <span className="text-right text-sm text-[#222] underline">
                  {props.sample.dropoff_address}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Drop Off Time slot{" "}
                </span>
                <span className="text-right text-sm text-[#222] underline">
                  {formatDate(
                    props.sample.pickup_date || new Date(),
                    "MMMM d, yyyy"
                  )}{" "}
                  between {props.sample.pickup_time}
                  {/* Wednesday, 25 2024 between 10:00 - 11:00 AM */}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample handling instructions{" "}
                </span>
                <span className="text-sm text-[#222] underline">
                  {props.sample.instruction_accepted
                    ? "Accepted"
                    : "Not Accepted"}{" "}
                </span>
              </span>
              {props.sample.test_performed === "genetic-test" && (
                <div className="space-y-3">
                  <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                    <span className="text-sm font-medium uppercase text-[#777]">
                      Purpose of Testing{" "}
                    </span>
                    <span className="flex flex-wrap justify-end space-x-3">
                      {props.sample.purpose_of_test &&
                        JSON.parse(props.sample.purpose_of_test)?.map(
                          (purpose: string) => (
                            <span
                              key={purpose}
                              className="text-sm text-[#222] underline"
                            >
                              {purpose}
                            </span>
                          )
                        )}
                    </span>
                  </span>
                  <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                    <span className="text-sm font-medium uppercase text-[#777]">
                      Predisposing Condition
                    </span>
                    <span className="text-right text-sm text-[#222] underline">
                      {props.sample.has_predisposing}
                    </span>
                  </span>
                  <div className="space-y-3">
                    {props.sample.has_predisposing === "yes" && (
                      <div className="space-y-3">
                        <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                          <span className="text-sm font-medium uppercase text-[#777]">
                            Type of Genetic Test
                          </span>
                          <span className="text-right text-sm text-[#222] underline">
                            {props.sample.predisposing_condition}
                          </span>
                        </span>
                        {/* <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                          <span className="text-sm font-medium uppercase text-[#777]">
                            Test Focus Area
                          </span>
                          <span className="text-right text-sm text-[#222] underline">
                            {props.sample.testForm?.testFocusArea}
                          </span>
                        </span> */}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Processing Time
                </span>
                <span className="text-right text-sm text-[#222] underline">
                  {props.sample.dropOffDetails?.processingTime}
                </span>
              </span>
            </div> */}
              {props.sample.instruction_accepted && (
                <div className="flex items-center gap-2 rounded-md bg-[#E9C46A1A] p-3">
                  <CircleAlert className="size-4 text-primary" />
                  <p className="text-sm font-normal text-primary">
                    You accepted our sample handling instructions{" "}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SampleDetailsPage;
