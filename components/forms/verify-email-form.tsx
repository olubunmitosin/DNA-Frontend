// @flow
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { confirmPasswordOTP, EmailSendOTP } from "@/app/actions/auth.actions";
import { OTPSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export const VerifyEmailForm = () => {
  const [secondsRemaining, setSecondsRemaining] = React.useState(120); // 2 minutes (120 seconds)
  const [resendEnabled, setResendEnabled] = React.useState(false); // Manage resend button state
  const [isPending, startTransition] = React.useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  // console.log(crypto.getCiphers());
  const form = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: "",
    },
  });
  const email = searchParams.get("email") || "";

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (secondsRemaining > 0) {
      intervalId = setInterval(() => {
        setSecondsRemaining((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      setResendEnabled(true);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [secondsRemaining]);

  const handleResendClick = () => {
    handleSendOTP(email);
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

  const handleSendOTP = async (email: string) => {
    try {
      startTransition(async () => {
        await EmailSendOTP(email).then((data) => {
          if (data?.error) {
            toast(data.error);
          }
          if (data?.success) {
            toast(data.success);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (values: z.infer<typeof OTPSchema>) => {
    // setTimeout(() => {
    // }, 200);
    startTransition(() => {
      if (email) {
        confirmPasswordOTP(email, values.otp).then((data) => {
          if (data?.error) {
            toast(data.error);
          }

          if (data?.success) {
            toast(data.success);
            form.reset();
            router.push(`/reset-password?email=${email}`);
          }
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col justify-end space-y-4"
      >
        <div className="w-full space-y-4">
          <FormField
            name="otp"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <FormItem className="w-full space-y-3">
                  <FormLabel className="font-poppins text-sm font-medium">
                    OTP
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter code here"
                      type="number"
                      className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
                <FormMessage />
              </div>
            )}
          />
        </div>

        <div className="w-full space-y-4">
          <Button
            disabled={isPending}
            className="w-fot flex h-[51px] w-full items-center justify-center rounded-[8px] bg-black text-sm text-white"
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            Reset Password
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
      </form>
    </Form>
  );
};
