"use client";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import useSession from "@/hooks/use-session";

const OnboardingSuccess = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(15); // 2 minutes (120 seconds)
  const { session } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (secondsRemaining > 0) {
      intervalId = setInterval(() => {
        setSecondsRemaining((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      // Countdown finished -  Handle resend action here (e.g., enable a "Resend OTP" button)
      // Example:
      // setResendOtpEnabled(true); // If you're managing a resend button's state
      console.log("View Dashboard");
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [secondsRemaining]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 20 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 20 ? `${remainingSeconds}` : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}s`; // If you want MM:SS format
    // return seconds < 60 ? `${seconds}s` : `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="flex size-full items-center justify-center">
      <div className="mt-10 flex h-[400px] w-full flex-col items-center justify-center gap-4 rounded-md border-[#E9E9E9] bg-white lg:h-[700px]">
        <div className="flex size-[136px] items-center justify-center rounded-full bg-[#35BA5226]">
          <div className="flex size-[106px] items-center justify-center rounded-full bg-[#35ba52]">
            <Check className="size-12 text-white" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2">
          <h4 className="text-3xl font-medium text-[#222]">
            You&apos;re all set!{" "}
          </h4>
          <p className="max-w-screen-sm text-center text-sm font-normal text-[#222]">
            We&apos;ve sent a confirmation link to ({session.email}) Click the
            link to verify your email and complete your setup.
          </p>
        </div>
        <div className="flex w-full max-w-screen-sm flex-col gap-3">
          <Button
            className="h-[50px] rounded-md bg-primary text-white"
            onClick={() => router.push("/dashboard")}
            disabled={secondsRemaining > 0}
          >
            View Dashboard
            {secondsRemaining > 0 && (
              <span className="text-center font-semibold text-white ">
                {formatTime(secondsRemaining)}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccess;
