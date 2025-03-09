// @flow
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { sendOTP, confirmOTP } from "@/app/actions/auth.actions";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
type Props = {
  trigger: React.ReactNode;
  number: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: any;
  disabled?: boolean;
  disabledPhone?: boolean;
  //   onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
};
export const VerifyPhoneNumber = (props: Props) => {
  const [OTP, setOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [openOTPModal, setOpenOTPModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendEnabled, setResendEnabled] = React.useState(false); // Manage resend button state
  const [secondsRemaining, setSecondsRemaining] = useState(120); // 2 minutes (120 seconds)

  const [number, setNumber] = useState(props.number);
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
      setResendEnabled(true);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [secondsRemaining]);

  const handleResendClick = () => {
    handleSendOTP(props.number);
    // Call the function to resend the OTP here
    setSecondsRemaining(120); // Restart the timer
    setResendEnabled(false); // Disable the button again
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`; // If you want MM:SS format
    // return seconds < 60 ? `${seconds}s` : `${minutes}m ${remainingSeconds}s`;
  };

  const handleSendOTP = async (phone: string) => {
    setIsLoading(true);
    try {
      await sendOTP(phone).then((data) => {
        if (data?.error) {
          toast(data.error);
          setIsLoading(false);
        }
        if (data?.success) {
          toast(data.success);
          setOtpSent(true);
          setIsLoading(false);
        }
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleConfirmOTP = async (phone: string, otp: string) => {
    try {
      setIsLoading(true);
      await confirmOTP(phone, otp).then((data) => {
        if (data?.error) {
          toast(data.error);
          setIsLoading(false);
        }

        if (data?.success) {
          toast(data.success);
          setIsLoading(false);
          setOtpSent(false);
          setOpenOTPModal(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={openOTPModal} onOpenChange={setOpenOTPModal}>
      <DialogTrigger className="flex items-start justify-start">
        {props.trigger}
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        // hideCLose
      >
        {otpSent ? (
          <div>
            <DialogHeader>
              <DialogTitle>OTP Verification</DialogTitle>
              <DialogDescription>
                Enter the OTP you recieved on your phone
              </DialogDescription>

              <div className="mt-2 space-y-3">
                <div className="flex flex-col gap-1">
                  <Label className="font-poppins text-sm font-medium">
                    OTP
                  </Label>

                  <Input
                    disabled={isLoading || props.disabled}
                    placeholder="Enter OTP"
                    value={OTP}
                    onChange={(e) => {
                      e.preventDefault();
                      setOTP(e.target.value);
                    }}
                    type="number"
                    className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                  />
                </div>
                <Button
                  disabled={isLoading || props.disabled}
                  onClick={() => handleConfirmOTP(props.number, OTP)}
                  type="button"
                  className="flex h-[48px] w-full items-center"
                >
                  {isLoading && (
                    <Loader2 className="me-2 size-4 animate-spin" />
                  )}
                  Confirm OTP
                </Button>
                {secondsRemaining > 0 ? (
                  <span className="flex items-center justify-center gap-1 text-center text-xs font-normal dark:text-black">
                    Resending in{" "}
                    <span className="text-center font-semibold text-primary dark:text-black">
                      {formatTime(secondsRemaining)}
                    </span>
                  </span>
                ) : (
                  <span
                    className={`flex cursor-pointer items-center justify-center text-center text-sm font-semibold text-primary dark:text-black ${
                      resendEnabled ? "" : "cursor-default opacity-50"
                    }`} // Style disabled state
                    onClick={resendEnabled ? handleResendClick : undefined} // Conditionally call resend
                  >
                    Resend OTP
                  </span>
                )}
              </div>
            </DialogHeader>
          </div>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle>OTP Verification</DialogTitle>
              <DialogDescription>
                Enter phone number to recieve OTP
              </DialogDescription>

              <div className="mt-2 space-y-3">
                <div className="flex flex-col gap-2">
                  <Label className="font-poppins text-sm font-medium">
                    Phone Number
                  </Label>
                  <>
                    <Input
                      disabled={isLoading || props.disabledPhone}
                      placeholder="Enter Phone Number"
                      type="number"
                      value={number}
                      onChange={(e) => {
                        e.preventDefault();
                        if (props.form) {
                          props.form.setValue("phone", e.target.value);
                        }
                        setNumber(e.target.value);
                      }}
                      className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                    />
                  </>
                </div>
                <Button
                  disabled={isLoading || props.disabled}
                  onClick={() => handleSendOTP(props.number)}
                  type="button"
                  className="flex h-[48px] w-full items-center"
                >
                  {isLoading && (
                    <Loader2 className="me-2 size-4 animate-spin" />
                  )}
                  Send OTP
                </Button>
              </div>
            </DialogHeader>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
