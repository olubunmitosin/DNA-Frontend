"use client";
import { ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";

import MapContainer from "@/components/shared/map";
import PageTitleHeader from "@/components/shared/page-title-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { dropOffAddress } from "@/constants";
import { cn } from "@/lib/utils";
import useFormStore from "@/store/sample-submission";

const ConfirmDropOffAddress = () => {
  const [isPending, startTransition] = useTransition();
  const { formData, updateFormData } = useFormStore();
  const reV = dropOffAddress.find(
    (address) => address.name === formData.dropOffDetails?.dropOffAddress
  );
  const [selectedValue, setSelectedValue] = useState<string>(reV?.value || "");
  const router = useRouter();
  if (!formData.sampleID) {
    router.push("/dashboard/sample-submission");
  }
  const handleProceed = () => {
    startTransition(() => {
      router.push(
        "/dashboard/sample-submission/submission-process/instructions/booking-details/address-confirmation/order-review"
      );
    });
  };
  return (
    <>
      <PageTitleHeader page="Confirm Drop Off Address" />
      <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
        <div className="col-span-12 space-y-8 lg:col-span-5">
          <div className="flex flex-col gap-4 space-y-6 rounded-[8px] bg-white p-4 md:p-6 lg:p-8">
            <RadioGroup
              defaultValue={selectedValue}
              disabled={isPending}
              className="space-y-4"
              onValueChange={(value) => {
                setSelectedValue(value);
                const reV = dropOffAddress.find(
                  (address) => address.value === value
                )?.name;
                if (updateFormData) {
                  updateFormData("dropOffDetails", {
                    ...formData.dropOffDetails,
                    dropOffAddress: reV,
                  });
                }
              }}
            >
              {dropOffAddress.map((address) => (
                <div
                  key={address.value}
                  className={`flex items-center space-x-4 rounded-md border p-6 ${
                    selectedValue === address.value
                      ? "bg-primary text-white"
                      : "bg-white"
                  }`}
                >
                  <RadioGroupItem
                    value={address.value}
                    disabled={isPending}
                    id={address.value}
                    className={cn(
                      "",
                      selectedValue === address.value &&
                        "[&_.filled-dot]:bg-white"
                    )}
                  />
                  <div>
                    <Label
                      htmlFor={address.value}
                      className={cn(
                        "text-base lg:text-lg font-semibold text-[#222]",
                        selectedValue === address.value && "text-white"
                      )}
                    >
                      {address.name}
                    </Label>
                    <p
                      className={cn(
                        "text-sm font-normal text-[#8C8C8C]",
                        selectedValue === address.value && "text-white/60"
                      )}
                    >
                      {" "}
                      {address.desc}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
            <div className="flex items-center border-t pt-7">
              <Button
                disabled={isPending || selectedValue === ""}
                onClick={handleProceed}
                className="flex items-center"
              >
                {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
                Proceed <ChevronRight className="ms-2 size-4" />
              </Button>
              <Button variant={"link"}>Cancel</Button>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="flex flex-col gap-4 space-y-6 rounded-[8px] bg-white p-4 md:p-6 lg:p-8">
            <MapContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDropOffAddress;
