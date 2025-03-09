// @flow
import { formatDate } from "date-fns";
import * as React from "react";

import { sampleTypes, testTypes } from "@/constants";
import { formatDateUtil } from "@/lib/utils";
import { SamplesDatum } from "@/types";

import PackingSlipDownloadTwo from "../shared/packing-slip-two";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
type Props = {
  sample: SamplesDatum;
  sheetTrigger: React.ReactNode;
};
export const SampleDetailsSheet = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger>{props.sheetTrigger}</SheetTrigger>
      <SheetContent side="right" className="sm:!max-w-xl">
        <SheetHeader>
          <SheetTitle>Sample Details</SheetTitle>
          <PackingSlipDownloadTwo formData={props.sample} />

          <div className="space-y-3">
            <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
              <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
                Status
              </span>
              <span className="rounded-[12px] bg-[#3A88C026] px-[12px] py-[5px] text-xs text-[#222]">
                {props.sample.status}
              </span>
            </span>

            <div className="space-y-3">
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
                  Sample ID
                </span>
                <span className="text-sm text-[#222] underline">
                  {props.sample.sampleId}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
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
                <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
                  Sample submission type{" "}
                </span>
                <span className="text-sm capitalize text-[#222] underline">
                  {props.sample.sample_process}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
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
                <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
                  Sample Collection Date{" "}
                </span>
                <span className="text-sm text-[#222] underline">
                  {formatDateUtil(props.sample.collection_date || new Date())}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
                  Sample Collection Time{" "}
                </span>
                <span className="text-sm text-[#222] underline">
                  {props.sample.collection_time}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
                  Chain of Custody Started{" "}
                </span>
                <span className="text-sm text-[#222] underline">Yes</span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
                  Relationship to donor{" "}
                </span>
                <span className="text-sm capitalize text-[#222] underline">
                  {props.sample.relationship_donor}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
                  Drop Off Address{" "}
                </span>
                <span className="text-right text-sm text-[#222] underline">
                  {props.sample.dropoff_address}
                </span>
              </span>
              <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
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
                <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
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
                    <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
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
                    <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
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
                          <span className="text-left text-xs font-medium uppercase text-[#777] md:text-sm">
                            Type of Genetic Test
                          </span>
                          <span className="text-right text-sm text-[#222] underline">
                            {props.sample.predisposing_condition}
                          </span>
                        </span>
                        {/* <span className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                                     <span className="text-xs text-left md:text-sm font-medium uppercase text-[#777]">
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
                           <span className="text-xs text-left md:text-sm font-medium uppercase text-[#777]">
                             Processing Time
                           </span>
                           <span className="text-right text-sm text-[#222] underline">
                             {props.sample.dropOffDetails?.processingTime}
                           </span>
                         </span> */}
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
