import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

const SampleSucessPage = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="mt-10 flex h-[400px] w-full flex-col items-center justify-center gap-4 rounded-md border-[#E9E9E9] bg-white lg:h-[700px]">
        <div className="flex size-[136px] items-center justify-center rounded-full bg-[#35BA5226]">
          <div className="flex size-[106px] items-center justify-center rounded-full bg-[#35ba52]">
            <Check className="size-12 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-3xl font-medium text-[#222]">
            Your Sample order is successful
          </h4>
          <p className="text-sm font-normal text-[#222]">
            We&apos;ve sent an email and also informed your drop off Lab of your
            sample
          </p>
        </div>
        <div className="flex w-full max-w-screen-sm flex-col gap-3">
          <Button className="relative h-[50px] rounded-md bg-primary text-white">
            <Link
              className="absolute left-0 top-0 size-full"
              href="/dashboard/sample-management"
            />
            View order details
          </Button>
          <Button className="relative h-[50px] rounded-md bg-[#F3F3F3] text-black hover:text-white">
            <Link
              className="absolute left-0 top-0 size-full"
              href="/dashboard/sample-submission"
            />
            Submit another sample
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SampleSucessPage;
