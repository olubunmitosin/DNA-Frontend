"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { EmailSendOTP } from "@/app/actions/auth.actions";
import { ResetPasswordSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

// type Props = {

// };
export const ChangePasswordForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    // setTimeout(() => {
    // }, 200);
    startTransition(() => {
      EmailSendOTP(values.email).then((data) => {
        if (data?.error) {
          toast(data.error);
        }

        if (data?.success) {
          form.reset();
          toast(data.success);
          router.push(`/verify-email?email=${values.email}`);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-[18px]"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-poppins text-base font-medium">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Enter email"
                  type="email"
                  {...field}
                  className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center justify-center">
          <Button
            className="flex h-[52px] w-full items-center rounded-[6px] bg-[#0F6485]"
            disabled={isPending}
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            Continue
          </Button>
          <Button
            type="button"
            disabled={isPending}
            variant={"link"}
            onClick={() => router.push("/sign-in")}
            className="mt-4 flex size-fit self-center p-0 text-center "
          >
            Already have an account?{" "}
            <span className="text-sm font-semibold text-primary">Sign in</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};
