"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { RegisterUser } from "@/app/actions/auth.actions";
import { SignUpSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

// type Props = {

// };
export const SignUpForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    try {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("first_name", values.firstName);
        formData.append("last_name", values.lastName);
        formData.append("email", values.email);
        formData.append("password", values.password.password);
        formData.append(
          "password_confirmation",
          values.password.confirmPassword
        );

        await RegisterUser(formData).then((data) => {
          if (data.error) {
            toast(data.error);
          }
          if (data?.invalid) {
            // Loop through the invalid messages and toast each one
            data.invalid.forEach((error) => {
              toast(error);
            });
          }
          if (data.message) {
            toast(data.message);
          }
          if (data?.success) {
            form.reset();
            toast(data.success);
            router.push("/onboarding");
            // AuthUser(loginValues).then((data) => {
            //   if (data?.success) {
            //     setAuth({
            //       accessToken: data.data.access_token,
            //       username: values.username,
            //       email: values.email,
            //       loggedIn: true,
            //     });
            //     router.push("/onboarding");
            //   }
            // });
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-[18px]"
      >
        <div className="grid gap-[10px] lg:grid-cols-2">
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="font-poppins text-base font-medium">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="First Name"
                    type="text"
                    {...field}
                    className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="font-poppins text-base font-medium">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Last Name"
                    type="text"
                    {...field}
                    className="no-focus h-[52px] rounded-[6px] border border-black/20 font-poppins text-base shadow-none placeholder:text-sm placeholder:font-normal"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
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
          name="password.password"
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
        <FormField
          name="password.confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-poppins text-base font-medium">
                Confirm Password
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

        <div className="flex flex-col items-center justify-center">
          <Button
            disabled={isPending}
            className="flex h-[52px] w-full items-center rounded-[6px] bg-[#0F6485]"
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            Sign Up
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
