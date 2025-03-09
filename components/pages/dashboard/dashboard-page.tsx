"use client";
import { Check, ChevronRight, Headset, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import PageTitleHeader from "@/components/shared/page-title-header";
import { SubmittedSamplesColumn } from "@/components/tables/columns/sample.columns";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { allRoutes } from "@/constants/routes";
import { generateSlug } from "@/lib/utils";
import { ArticlesDatum, SamplesDatum } from "@/types";

type Props = {
  submission: number;
  articles: ArticlesDatum[] | undefined;
  columnData: SamplesDatum[];
};

const DashboardPageComp = (props: Props) => {
  const currentStep = 1;
  // Initialize fallback states for all articles
  const router = useRouter();
  const [images, setImages] = useState(
    props.articles?.map(
      (article) => article.image || "/assets/images/sign-up-one.jpeg"
    )
  );

  const handleImageError = (index: number) => {
    // Update the specific image fallback
    setImages((prev) =>
      prev?.map((src, i) =>
        i === index ? "/assets/images/sign-up-one.jpeg" : src
      )
    );
  };
  return (
    <>
      <PageTitleHeader
        page="Dashboard"
        secondBtn={
          <Button onClick={() => router.push("/dashboard/sample-submission")}>
            <Plus /> New Submission
          </Button>
        }
      />
      <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
        <div className="col-span-12 flex flex-col justify-between space-y-8 lg:col-span-8">
          <div className="flex flex-col gap-2 rounded-[4px] border border-[#E9E9E9] bg-white p-4 lg:p-6 xl:p-8">
            <h6 className="text-base font-medium text-[#323232] lg:text-lg">
              Active Sample Submission
            </h6>
            <h3 className="font-poppins text-6xl font-semibold text-light-100">
              {props.submission}
            </h3>
            <Link
              className="mt-2 flex items-center text-sm font-medium text-primary underline"
              href={allRoutes.Sample.url}
            >
              View all submissions <ChevronRight className=" size-4" />
            </Link>
          </div>
          <div className="flex flex-col gap-4 rounded-[4px] border border-[#E9E9E9] bg-white p-4 lg:gap-8 lg:p-6 xl:p-8">
            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
              <h6 className="text-sm font-medium text-[#323232] md:text-base lg:text-lg">
                Track sample submission
              </h6>
              <Select>
                <SelectTrigger className="w-fit">
                  <SelectValue
                    placeholder="Select Submission"
                    className="text-xs md:text-sm"
                  />
                </SelectTrigger>
                <SelectContent side="bottom" align="end">
                  {props.columnData.map((sample) => (
                    <SelectItem
                      key={sample.sampleId}
                      value={sample.sampleId}
                      className="cursor-pointer text-xs lg:text-base"
                    >
                      {sample.sampleId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative my-4 flex items-center justify-between">
              {/** Timeline Lines */}
              <Separator className="absolute inset-x-[8%]  top-1/4 z-10 w-[86%] -translate-y-1/2 border border-black bg-transparent shadow-none md:inset-x-[5%] md:w-[90%]  lg:inset-x-[8%] lg:w-[87%] xl:inset-x-[5%] xl:w-[92%] " />

              {/** Steps */}
              {[
                "Submit Order",
                "Waiting for Delivery",
                "Received by Lab",
                "Result Out",
              ].map((step, index) => {
                const isCompleted = index + 1 <= currentStep; // Assuming props.currentStep tracks progress
                return (
                  <div key={index} className="z-20 flex flex-col items-center">
                    {/* Circle */}
                    <div
                      className={`flex size-6 items-center justify-center rounded-full ${
                        isCompleted
                          ? "bg-black text-white"
                          : "bg-white text-gray-500"
                      } border-2 border-black`}
                    >
                      {isCompleted ? (
                        <Check className="size-4" />
                      ) : (
                        <Check className="size-4 " />
                      )}
                    </div>
                    {/* Step Label */}
                    <span className="mt-2 text-center text-xs font-medium text-[#323232] lg:text-sm">
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:gap-10">
              <Link
                href="#"
                className="flex items-center text-xs font-medium text-primary underline underline-offset-2 md:text-sm lg:text-base"
              >
                Expand tracker <ChevronRight className="ms-1 size-4" />
              </Link>
              <Link
                href="#"
                className="flex items-center text-xs font-medium text-primary underline underline-offset-2 md:text-sm lg:text-base"
              >
                Contact Support <Headset className="ms-1 size-4" />
              </Link>
              <Link
                href="#"
                className="flex items-center text-xs font-medium text-primary underline underline-offset-2 md:text-sm lg:text-base"
              >
                Cancel Order <X className="ms-1 size-4" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6 rounded-[4px] border border-[#E9E9E9] bg-white p-4 lg:p-6 xl:p-8">
            <h6 className="text-base font-medium text-[#323232] lg:text-lg">
              Latest Updates
            </h6>
            <DataTable
              data={props.columnData}
              columns={SubmittedSamplesColumn}
              tableClassname="border border-[#E7EBED]"
              bodyCellClassname="border border-[#E7EBED]"
              headerCellClassName="border border-[#E7EBED]"
            />
            <Link
              href="#"
              className="mt-2 flex items-center text-sm font-medium text-primary underline"
            >
              View all updates <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="flex flex-col gap-6 rounded-[4px] border border-[#E9E9E9] bg-white p-4 lg:p-6 xl:p-8">
            <h6 className="text-base font-medium text-[#323232] lg:text-lg">
              Updates and news
            </h6>
            {props.articles &&
              images &&
              props.articles.map((article, i) => (
                <div
                  key={article.id}
                  className="flex h-[105px] w-full items-center gap-4"
                >
                  <div className="relative h-full w-[86px]">
                    <Image
                      src={images[i]}
                      alt={`article ${i}`}
                      fill
                      onError={() => handleImageError(i)}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-start gap-4">
                    <Link
                      href={`/dashboard/updates-and-news/${generateSlug(
                        article.title
                      )}`}
                      className="max-w-[238px] font-poppins text-sm font-medium text-[#323232] lg:text-base"
                    >
                      {article.title}
                    </Link>
                    <Button
                      className="flex h-fit items-center justify-start p-0 text-left"
                      variant={"link"}
                    >
                      Read more <ChevronRight />
                    </Button>
                  </div>
                </div>
              ))}

            <Button
              className="h-[40px]"
              onClick={() => router.push("/dashboard/updates-and-news")}
            >
              View all Articles
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPageComp;
