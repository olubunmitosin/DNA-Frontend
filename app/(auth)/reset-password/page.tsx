import React, { Suspense } from "react";

import { NewPasswordForm } from "@/components/forms/new-password-form";
import SignUpCarousel from "@/components/shared/sliders/sign-up-carousel";

export default function NewPasswordComp() {
  return (
    <div className="grid h-screen w-full  gap-10 p-6 lg:grid-cols-2 lg:p-10">
      <div className="flex flex-col items-start justify-center space-y-[30px] py-10 lg:space-y-[56px]">
        {/* <Image
          src="/assets/images/logo.png"
          width={278}
          height={100}
          alt="logo"
          className="h-[100px] w-[278px] object-contain "
        /> */}
        <div className="w-full space-y-4 lg:space-y-8">
          <div className="space-y-2 lg:space-y-4">
            <h2 className="text-xl font-semibold text-[#3b3b3b] lg:text-3xl">
              New Password
            </h2>
            <p className="text-sm font-normal text-[#636363] lg:text-base">
              Setup your new password{" "}
            </p>
          </div>
          <Suspense>
            <NewPasswordForm />
          </Suspense>{" "}
        </div>
      </div>
      <div className="hidden h-full lg:flex">
        <SignUpCarousel />
      </div>
    </div>
  );
}
