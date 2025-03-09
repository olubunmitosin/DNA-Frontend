"use client";
import { formatDate } from "date-fns";
import { CircleAlert, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

import {
  getSampleByID,
  SaveSampleDroffOff,
  UpdateSampleDroffOff,
} from "@/app/actions/samples.actions";
// import { VerifyPersonalInfoDialog } from "@/components/dialog/verify-personal-information-dialog";
import PackingSlipDownload from "@/components/shared/packing-slip";
import PageTitleHeader from "@/components/shared/page-title-header";
import { Button } from "@/components/ui/button";
import { sampleTypes, testTypes } from "@/constants";
import { formatDateToYMD, formatDateUtil, getCurrentTime } from "@/lib/utils";
import useFormStore from "@/store/sample-submission";
import { User } from "@/types/main";

type Props = {
  user: User;
};

const OrderReviewComp = (props: Props) => {
  const [isPending, startTransition] = useTransition();
  // const [sampleExists, setSampleExists] = useState(second)
  const { formData, resetForm } = useFormStore();
  // const pathname = usePathname();
  const router = useRouter();

  // if (!formData.sampleID) {
  //   router.push("/dashboard/sample-submission");
  // }

  const handleDropOff = async () => {
    startTransition(async () => {
      const mainFormData = new FormData();
      const anData = new FormData();
      anData.append("sampleId", formData.sampleID);
      const sampleExists = await getSampleByID(anData);

      mainFormData.append("sampleId", formData.sampleID);

      if (sampleExists) {
        mainFormData.append("sample_process", formData.submissionProcess);
        mainFormData.append("test_performed", formData.testType);
      }
      mainFormData.append(
        "sample_type",
        formData.dropOffDetails?.sampleType || ""
      );
      mainFormData.append(
        "collection_date",
        formatDateToYMD(
          formData.dropOffDetails?.sampleCollectionDate || new Date()
        )
      );
      mainFormData.append(
        "collection_time",
        getCurrentTime(
          formData.dropOffDetails?.sampleCollectionTime || new Date()
        )
      );
      mainFormData.append(
        "custody_started",
        formData.dropOffDetails?.chaninOfCustody || ""
      );
      mainFormData.append(
        "relationship_donor",
        formData.dropOffDetails?.relationShipToDonor || ""
      );
      mainFormData.append("address", formData.dropOffDetails?.address || "");
      mainFormData.append("status", "Pending");
      if (formData.testForm?.purposeOfTesting) {
        formData.testForm?.purposeOfTesting.forEach((test, index) =>
          mainFormData.append(`purpose_of_test[${index}]`, test)
        );
      } else {
        mainFormData.append(`purpose_of_test`, "");
      }
      mainFormData.append(
        "has_predisposing",
        formData.testForm?.predisposingCondition || "no"
      );
      mainFormData.append(
        "test_focus_area",
        formData.testForm?.testFocusArea || ""
      );
      mainFormData.append(
        "processing-time",
        formData.dropOffDetails?.processingTime || ""
      );

      mainFormData.append(
        "predisposing_condition",
        formData.testForm?.predisposingConditionDetails || ""
      );
      // mainFormData.append(
      //   "purpose_of_test",
      //   formData.testForm?.purposeOfTesting || ""
      // );
      mainFormData.append(
        "processing-time",
        formData.dropOffDetails?.processingTime || ""
      );
      mainFormData.append(
        "instruction_accepted",
        formData.instructionsAccepted === true ? "yes" : "no"
      );
      mainFormData.append(
        "pickup_date",
        formatDateToYMD(formData.dropOffDetails?.pickUpDate || new Date())
      );
      mainFormData.append(
        "pickup_time",
        formData.dropOffDetails?.pickUpTime || ""
      );
      mainFormData.append(
        "dropoff_address",
        formData.dropOffDetails?.dropOffAddress || ""
      );

      if (sampleExists?.success) {
        await UpdateSampleDroffOff(
          mainFormData,
          "/dashboard/sample-management"
        ).then((data) => {
          if (data?.error) {
            toast(data.error);
          }
          if (data?.invalid) {
            data.invalid.forEach((err) => toast(err));
          }

          if (data?.message) {
            toast(data.message);
          }
          if (data?.success) {
            toast(data.success);
            router.push("/dashboard/sample-submission/order-complete");
            if (resetForm) {
              resetForm();
            }
          }
        });
      } else {
        await SaveSampleDroffOff(mainFormData, "/dashboard").then((data) => {
          if (data?.error) {
            toast(data.error);
          }
          if (data?.invalid) {
            data.invalid.forEach((err) => toast(err));
          }

          if (data?.message) {
            toast(data.message);
          }
          if (data?.success) {
            toast(data.success);
            router.push("/dashboard/sample-submission/order-complete");
            if (resetForm) {
              resetForm();
            }
          }
        });
      }
    });
  };

  return (
    <>
      <PageTitleHeader page="Review Order" />
      <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
        <div className="col-span-12 space-y-8 lg:col-span-5">
          <div className="flex flex-col gap-4 space-y-6 rounded-[8px] bg-white p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <h4 className="font-poppins text-lg font-semibold text-[#222] lg:text-xl xl:text-2xl">
                Order Details
              </h4>
              <PackingSlipDownload formData={formData} />
            </div>
            <div className="space-y-3">
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample ID
                </span>
                <span className="text-sm text-[#222] underline">
                  {formData.sampleID}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Type of Test
                </span>
                <span className="text-sm text-[#222] underline">
                  {
                    testTypes.find((test) => test.value === formData.testType)
                      ?.name
                  }
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample submission type{" "}
                </span>
                <span className="text-sm capitalize text-[#222] underline">
                  {formData.submissionProcess}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample Type{" "}
                </span>
                <span className="text-sm text-[#222] underline">
                  {
                    sampleTypes.find(
                      (sample) =>
                        sample.value === formData.dropOffDetails?.sampleType
                    )?.name
                  }
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample Collection Date{" "}
                </span>
                <span className="text-sm text-[#222] underline">
                  {formatDateUtil(
                    formData.dropOffDetails?.sampleCollectionDate || new Date()
                  )}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample Collection Time{" "}
                </span>
                <span className="text-sm text-[#222] underline">
                  {getCurrentTime(
                    formData.dropOffDetails?.sampleCollectionTime || new Date()
                  )}
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
                  {formData.dropOffDetails?.relationShipToDonor}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Drop Off Address{" "}
                </span>
                <span className="text-right text-sm text-[#222] underline">
                  {formData.dropOffDetails?.dropOffAddress}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Drop Off Time slot{" "}
                </span>
                <span className="text-right text-sm text-[#222] underline">
                  {formatDate(
                    formData.dropOffDetails?.pickUpDate || new Date(),
                    "MMMM d, yyyy"
                  )}{" "}
                  between {formData.dropOffDetails?.pickUpTime}
                  {/* Wednesday, 25 2024 between 10:00 - 11:00 AM */}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Sample handling instructions{" "}
                </span>
                <span className="text-sm text-[#222] underline">
                  {formData.instructionsAccepted ? "Accepted" : "Not Accepted"}{" "}
                </span>
              </span>
              {formData.testType === "genetic-test" && (
                <div className="space-y-3">
                  <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                    <span className="text-sm font-medium uppercase text-[#777]">
                      Purpose of Testing{" "}
                    </span>
                    <span className="flex flex-wrap justify-end space-x-3">
                      {formData.testForm?.purposeOfTesting.map((purpose) => (
                        <span
                          key={purpose}
                          className="text-sm text-[#222] underline"
                        >
                          {purpose}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                    <span className="text-sm font-medium uppercase text-[#777]">
                      Predisposing Condition
                    </span>
                    <span className="text-right text-sm text-[#222] underline">
                      {formData.testForm?.predisposingCondition}
                    </span>
                  </span>
                  <div className="space-y-3">
                    {formData.testForm?.predisposingCondition === "yes" && (
                      <div className="space-y-3">
                        <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                          <span className="text-sm font-medium uppercase text-[#777]">
                            Type of Genetic Test
                          </span>
                          <span className="text-right text-sm text-[#222] underline">
                            {formData.testForm?.typeOfGeneticTest}
                          </span>
                        </span>
                        <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                          <span className="text-sm font-medium uppercase text-[#777]">
                            Test Focus Area
                          </span>
                          <span className="text-right text-sm text-[#222] underline">
                            {formData.testForm?.testFocusArea}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Processing Time
                </span>
                <span className="text-right text-sm text-[#222] underline">
                  {formData.dropOffDetails?.processingTime}
                </span>
              </span>
            </div>
            {formData.instructionsAccepted && (
              <div className="flex items-center gap-2 rounded-md bg-[#E9C46A1A] p-3">
                <CircleAlert className="size-4 text-primary" />
                <p className="text-sm font-normal text-primary">
                  You accepted our sample handling instructions{" "}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="flex flex-col gap-4 space-y-6 rounded-[8px] bg-white p-4 md:p-6 lg:p-8">
            <h4 className="font-poppins text-lg font-semibold text-[#222] lg:text-xl xl:text-2xl">
              Order Summary
            </h4>
            <div className="space-y-3">
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Token Cost
                </span>
                <span className="text-sm text-[#222] underline">10 Units</span>
              </span>

              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-sm font-medium uppercase text-[#777]">
                  Personal infpormation{" "}
                </span>
                <span className="text-sm text-green-900 underline">
                  {props.user.profile_verified === 1
                    ? "verified"
                    : "not-verified"}
                </span>
              </span>
              {/* <div className="flex items-center gap-2 rounded-md bg-[#E9C46A1A] p-3">
                <CircleAlert className="size-4 text-primary" />
                <p className="text-xs font-normal text-primary md:text-sm">
                  You need to verify your personal information before proceeding{" "}
                  <br />
                  <VerifyPersonalInfoDialog
                    trigger={
                      <Button
                        variant={"link"}
                        className="mt-2 h-fit p-0 underline"
                      >
                        Verify personal information
                      </Button>
                    }
                    user={props.user}
                    pathname={pathname}
                  />
                </p>
              </div> */}
            </div>

            <Button
              type="button"
              className="flex h-[52px] items-center rounded-md text-white"
              disabled={isPending || props.user.profile_verified === 1}
              onClick={handleDropOff}
            >
              {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
              {props.user.profile_verified === 1
                ? "Verify Personal Information"
                : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderReviewComp;
