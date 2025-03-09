"use client";
import { BellDot, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { InitiatePayment, VerifyPayment } from "@/app/actions/wallet.actions";
import CoinsIcon from "@/icons/coins-icon";
import { User } from "@/types/main";

import GlobalSearchBar from "./search/global-searchbar";
import PriceInput from "../forms/price-input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SidebarTrigger } from "../ui/sidebar";

type Props = {
  user: User;
};
export const DashboardHeader = (props: Props) => {
  const router = useRouter();

  const [price, setPrice] = React.useState("");
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();

  const initiatePayment = async () => {
    startTransition(async () => {
      const formData = new FormData();

      formData.append("amount", price);
      formData.append(
        "callback_url",
        String(`${process.env.NEXT_PUBLIC_FRONTEND_URL}${pathname}`)
      );
      await InitiatePayment(formData, pathname).then((data) => {
        if (data?.error) {
          toast(data.error);
        }
        if (data?.success) {
          toast(data.success);
          router.push(data.url);
          // const accessCode = data.access_code;
          // const result = popup.resumeTransaction({
          //   accessCode,
          // });

          // console.log(result);
          // // Optional: Monitor transaction status (e.g., success, failed)
          // const transactionStatus = result.getStatus();

          // console.log("Transaction Status:", transactionStatus);

          // if (transactionStatus.status === "success") {
          //   alert("Payment was successful!");
          // } else if (transactionStatus.status === "failed") {
          //   alert("Payment failed. Please try again.");
          // }
        } else {
          console.error("Failed to initialize payment:", data?.error);
        }
      });
    });
  };

  const veirfyPayment = useCallback(async () => {
    const url = new URL(window.location.href);
    const reference = url.searchParams.get("reference");

    if (reference) {
      console.log("Reference:", reference);
      await VerifyPayment(pathname, reference).then((data) => {
        if (data?.error) {
          toast(data.error);
        }
        if (data?.success) {
          toast(data.success);
        }

        // Remove the query parameters after success or error
        const newUrl = window.location.pathname + window.location.hash;
        window.history.pushState({}, "", newUrl);
      });
    }
  }, [pathname]);
  useEffect(() => {
    veirfyPayment();
  }, [veirfyPayment]);

  return (
    <div className="flex w-full items-center justify-between border-b px-4 py-[16px] lg:px-[20px] 2xl:px-[40px]">
      <div className="flex items-center gap-4">
        <React.Suspense>
          <GlobalSearchBar />
        </React.Suspense>
        <div className="flex mmd:hidden">
          <SidebarTrigger />
        </div>
      </div>
      <div className="flex items-center gap-3 lg:gap-6">
        <Dialog>
          <DialogTrigger>
            <div className="flex items-center gap-2 rounded-[7px] bg-[#4F1271] px-[12px] py-[7px] text-sm text-white">
              <CoinsIcon />
              <span className="hidden lg:flex">
                {props.user?.wallet_balance} Units
              </span>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fund Your Wallet</DialogTitle>
              <DialogDescription>
                Seamlessly add funds to your wallet and unlock limitless
                possibilities.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label>Amount</label>
              <PriceInput
                disabled={isPending}
                value={price}
                onChange={(value) => {
                  setPrice(value);
                }}
                className="h-[50px] rounded-[10px] bg-[#f7f7f7] px-3 py-1 text-base shadow-none dark:bg-dark-400 md:text-sm"
              />
            </div>

            <Button
              onClick={initiatePayment}
              className="flex h-[50px] w-full items-center rounded-md bg-primary"
              disabled={isPending}
            >
              {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
              Make Payment
            </Button>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h5>{props.user?.first_name}</h5>
        </div>
        <div>
          <BellDot />
        </div>
      </div>
    </div>
  );
};
