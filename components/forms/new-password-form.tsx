// @flow
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { RestPassword } from "@/app/actions/auth.actions";
import { SetupPasswordCSchema } from "@/lib/common-rules";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import CustomPasswordInput from "../ui/password-widget";

export const NewPasswordForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const form = useForm<z.infer<typeof SetupPasswordCSchema>>({
    resolver: zodResolver(SetupPasswordCSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof SetupPasswordCSchema>) => {
    // setTimeout(() => {
    // }, 200);
    startTransition(() => {
      if (email) {
        RestPassword(values, email).then((data) => {
          // if (data?.invalid) {
          //   toast(data.invalid.new_password[0]);
          // }
          if (data?.error) {
            toast(data.error);
          }

          if (data?.success) {
            toast(data.success);
            form.reset();
            router.push("/sign-in");
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
            name="password"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <FormItem className="space-y-3">
                  <FormLabel className="font-poppins text-sm font-medium">
                    Password
                  </FormLabel>

                  <FormControl>
                    <CustomPasswordInput
                      field={field}
                      isPending={isPending}
                      label="Password"
                      placeholder="Enter your password here"
                      // className="border-none outline-none no-focus !bg-transparent cursor-pointer focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-base font-mont font-normal"
                    />
                  </FormControl>
                </FormItem>
                <FormMessage />
              </div>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <FormItem className="space-y-3">
                  <FormLabel className="font-poppins text-sm font-medium">
                    Confirm Password
                  </FormLabel>{" "}
                  <FormControl>
                    <CustomPasswordInput
                      field={field}
                      isPending={isPending}
                      label="Password"
                      placeholder="Confirm new password"
                      // className="border-none outline-none no-focus !bg-transparent cursor-pointer focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-base font-mont font-normal"
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
            className="flex h-[51px] w-full items-center justify-center rounded-[8px] bg-black text-sm text-white"
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            Create Password
          </Button>
        </div>
      </form>
    </Form>
  );
};
