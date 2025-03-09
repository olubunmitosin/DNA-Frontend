"use client";
import Image from "next/image";
import React, { useState } from "react";

import { User } from "@/types/main";

import OnboardingStepOne from "./onboarding-step-one";
import { Button } from "../ui/button";

type Props = {
  user: User;
};

const OnboardingPageComp = (props: Props) => {
  const [startedOnboarding, setStartedOnboarding] = useState(false);
  return startedOnboarding ? (
    <OnboardingStepOne user={props.user} />
  ) : (
    <div className="relative flex h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center p-4">
        <Image
          src="/assets/images/stars_rafiki.png"
          alt="start_onboarding"
          width={320}
          height={320}
          className="object-cover"
        />

        <div className="flex w-full max-w-[600px] flex-col items-center justify-center space-y-5">
          <h2 className="text-center font-poppins text-2xl font-semibold text-[#3b3b3b]">
            Welcome to DNALC - Empowering Forensic Investigations with DNA
            Intelligence.
          </h2>
          <p className="text-center font-poppins text-base font-normal text-[#636363]">
            Our platform provides secure, streamlined tools for collecting,
            analyzing, and sharing DNA data.
          </p>
          <Button
            className="h-[54px] w-full"
            onClick={() => setStartedOnboarding(true)}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPageComp;
