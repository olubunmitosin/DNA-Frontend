"use client";
import { formatDate } from "date-fns";
import { CircleAlert, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

import { SaveSamplePickUp } from "@/app/actions/samples.actions";
import PackingSlipDownload from "@/components/shared/packing-slip";
import PageTitleHeader from "@/components/shared/page-title-header";
import { Button } from "@/components/ui/button";
import { testTypes } from "@/constants";
import { formatDateToYMD, formatDateUtil } from "@/lib/utils";
import useFormStore from "@/store/sample-submission";

const OrderReviewPickup = () => {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const { formData, resetForm } = useFormStore();

  const router = useRouter();
  // if (!formData.sampleID) {
  //   router.push("/dashboard/sample-submission");
  // }

  const handlePickUp = async () => {
    startTransition(async () => {
      const mainFormData = new FormData();

      mainFormData.append("sampleId", formData.sampleID);
      mainFormData.append(
        "additional_information",
        formData.pickupDetails?.additionalInstructions || ""
      );

      mainFormData.append("status", "Processing");
      mainFormData.append(
        "pickup_date",
        formatDateToYMD(formData.pickupDetails?.pickupDate || new Date())
      );
      mainFormData.append(
        "pickup_time",
        formData.pickupDetails?.pickupTIme || ""
      );
      mainFormData.append(
        "pickup_address",
        formData.pickupDetails?.pickupAddress || ""
      );
      await SaveSamplePickUp(mainFormData, pathname).then((data) => {
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
    });
  };
  return (
    <>
      <PageTitleHeader page="Review Order" />
      <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
        <div className="col-span-12 space-y-8 lg:col-span-8">
          <div className="flex flex-col gap-4 space-y-6 rounded-[8px] bg-white p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <h4 className="font-poppins text-lg font-semibold text-[#222] lg:text-xl xl:text-2xl">
                Order Details
              </h4>
              <PackingSlipDownload formData={formData} />
            </div>
            <div className="space-y-3">
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-medium uppercase text-[#777] md:text-sm">
                  Sample ID
                </span>
                <span className="text-xs text-[#222] underline md:text-sm">
                  {formData.sampleID}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-medium uppercase text-[#777] md:text-sm">
                  Type of Test
                </span>
                <span className="text-xs text-[#222] underline md:text-sm">
                  {
                    testTypes.find((test) => test.value === formData.testType)
                      ?.name
                  }
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-medium uppercase text-[#777] md:text-sm">
                  Sample submission type{" "}
                </span>
                <span className="text-sm capitalize text-[#222] underline">
                  {formData.submissionProcess}
                </span>
              </span>

              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-medium uppercase text-[#777] md:text-sm">
                  Sample Collection Date{" "}
                </span>
                <span className="text-xs text-[#222] underline md:text-sm">
                  {formatDateUtil(
                    formData.pickupDetails?.pickupDate || new Date()
                  )}
                </span>
              </span>

              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-medium uppercase text-[#777] md:text-sm">
                  Chain of Custody Started{" "}
                </span>
                <span className="text-xs text-[#222] underline md:text-sm">
                  Yes
                </span>
              </span>
              {/* <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-medium uppercase text-[#777] md:text-sm">
                  Relationship to donor{" "}
                </span>
                <span className="text-sm capitalize text-[#222] underline">
                  {formData.dropOffDetails?.relationShipToDonor}
                </span>
              </span> */}
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-medium uppercase text-[#777] md:text-sm">
                  Pickup Address{" "}
                </span>
                <span className="text-right text-xs text-[#222] underline md:text-sm">
                  St. Mar&apos;s Hospital & Maternity
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-medium uppercase text-[#777] md:text-sm">
                  Pick Up Time slot{" "}
                </span>
                <span className="text-right text-xs text-[#222] underline md:text-sm">
                  {formatDate(
                    formData.pickupDetails?.pickupDate || new Date(),
                    "MMMM d, yyyy"
                  )}{" "}
                  between {formData.pickupDetails?.pickupTIme}
                  {/* Wednesday, 25 2024 between 10:00 - 11:00 AM */}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-medium uppercase text-[#777] md:text-sm">
                  Sample handling instructions{" "}
                </span>
                <span className="text-xs text-[#222] underline md:text-sm">
                  {formData.instructionsAccepted ? "Accepted" : "Not Accepted"}{" "}
                </span>
              </span>
            </div>
            {formData.instructionsAccepted && (
              <div className="flex items-center gap-2 rounded-md bg-[#E9C46A1A] p-3">
                <CircleAlert className="size-4 text-primary" />
                <p className="text-xs font-normal text-primary md:text-sm">
                  You accepted our sample handling instructions{" "}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="flex flex-col gap-4 space-y-6 rounded-[8px] bg-white p-4 md:p-6 lg:p-8">
            <h4 className="font-poppins text-lg font-semibold text-[#222] lg:text-xl xl:text-2xl">
              Order Summary
            </h4>
            <div className="space-y-3">
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-medium uppercase text-[#777] md:text-sm">
                  Token Cost
                </span>
                <span className="text-xs text-[#222] underline md:text-sm">
                  10 Units
                </span>
              </span>

              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-medium uppercase text-[#777] md:text-sm">
                  Personal infpormation{" "}
                </span>
                <span className="text-xs text-[#222] underline md:text-sm">
                  Verified
                </span>
              </span>
            </div>

            <Button
              className="flex h-[52px] items-center rounded-md text-white"
              disabled={isPending}
              onClick={handlePickUp}
            >
              {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderReviewPickup;
