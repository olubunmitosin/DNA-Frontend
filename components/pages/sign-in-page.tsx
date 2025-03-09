// import Image from "next/image";
import React from "react";

import { SignInForm } from "../forms/sign-in-form";
import SignUpCarousel from "../shared/sliders/sign-up-carousel";

export default function SignInPageComp() {
  return (
    <div className="grid size-full gap-10 p-6 lg:grid-cols-2 lg:p-10">
      <div className="flex flex-col items-start justify-center space-y-[30px] py-10 lg:space-y-[56px]">
        <div className="w-full space-y-4 lg:space-y-8">
          <div className="space-y-2 lg:space-y-4">
            <h2 className="text-xl font-semibold text-[#3b3b3b] lg:text-3xl">
              Welcome
            </h2>
            <p className="text-sm font-normal text-[#636363] lg:text-base">
              Empowering Forensic Investigations with DNA Intelligence.
            </p>
          </div>
          <React.Suspense>
            <SignInForm />
          </React.Suspense>
        </div>
      </div>
      <div className="hidden w-full lg:flex">
        <SignUpCarousel />
      </div>
    </div>
  );
}
