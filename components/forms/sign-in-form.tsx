"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { AuthUser } from "@/app/actions/auth.actions";
import { LoginSchema } from "@/lib/validations";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

// type Props = {

// };
export const SignInForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const callbackUrl = searchParams.get("callbackUrl") ?? DEFAULT_LOGIN_REDIRECT;

  const handleSubmit = async (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      AuthUser(values).then((data) => {
        if (data?.error) {
          toast(data.error);
        }
        if (data?.success) {
          router.push(callbackUrl);
          toast(data.success);
          form.reset();
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
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-poppins text-base font-medium">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Enter password"
                  type="password"
                  {...field}
                  className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <FormField
            name="rememberMe"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    disabled={isPending}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!m-0">Remember me</FormLabel>
              </FormItem>
            )}
          />
          <Link
            className="text-sm font-semibold text-primary"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Button
            disabled={isPending}
            className="flex h-[52px] w-full items-center rounded-[6px] bg-[#0F6485]"
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            Sign In
          </Button>
          <Button
            type="button"
            disabled={isPending}
            variant={"link"}
            onClick={() => router.push("/sign-up")}
            className="mt-4 flex size-fit self-center p-0 text-center "
          >
            Don&apos;t have an account?{" "}
            <span className="text-sm font-semibold text-primary">Sign Up</span>
          </Button>
        </div>
        <p className="mt-5 text-center text-xs font-normal text-[#767676]">
          By proceeding, I confirm that I have read and agree to the Terms of
          Service and Privacy Policy. I understand how my personal information
          will be collected, used, and stored in accordance with applicable data
          protection laws.
        </p>
      </form>
    </Form>
  );
};
