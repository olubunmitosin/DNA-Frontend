"use client";
import React, { useCallback, useEffect, useState } from "react";

import { getUserDetails } from "@/app/actions/auth.actions";
import { cn, toCurrency } from "@/lib/utils";
import { User } from "@/types/main";

import { Input } from "../ui/input";

interface PriceInputProps {
  onChange: (amount: string) => void;
  value?: string;
  currency?: string; // Optional currency symbol
  className?: string; // Optional class to add
  disabled: boolean;
}

const PriceInput: React.FC<PriceInputProps> = ({
  onChange,
  value = "",
  currency = "₦",
  className,
  disabled,
}) => {
  const [AuthUser, setAuthUser] = useState<User>();
  const [amount, setAmount] = useState(value);

  const getUserCallback = useCallback(async () => {
    const user = await getUserDetails();
    if (user.success) {
      setAuthUser(user.userDetails);
    }
  }, []);

  useEffect(() => {
    getUserCallback();
  }, [getUserCallback]);

  useEffect(() => {
    // Format the initial value when the component mounts
    const formattedValue = formatAmount(value);
    setAmount(formattedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newAmount = e.target.value;

    // Remove non-numeric characters except decimal point
    newAmount = newAmount.replace(/[^0-9.]/g, "");
    newAmount = newAmount.replace(/(\..*)\./g, "$1");
    const formattedAmount = formatAmount(newAmount);

    setAmount(formattedAmount);
    onChange(newAmount); // Send the raw numeric value for calculations/storage
  };
  const formatAmount = (amount: string) => {
    if (amount === "") return "";

    // Remove existing commas
    const numericValue = amount.replace(/,/g, "");

    // Extract decimals, parse as a number, and then add the thousands separators
    const parts = numericValue.split(".");
    const integerPart = parseInt(parts[0] || "0", 10).toLocaleString();
    const decimalPart = parts[1] || null;

    if (decimalPart) {
      return `${integerPart}.${decimalPart.substring(0, 2)}`;
    } else {
      return `${integerPart}`;
    }
  };
  return (
    <div className={`flex flex-col items-start`}>
      <div className={cn("flex w-full items-center", className)}>
        <span className="mr-2 text-sm font-normal text-[#2A0C314D] dark:text-light-300">
          {currency}
        </span>
        <Input
          type="text"
          disabled={disabled}
          className="no-focus w-full flex-1 border-none bg-transparent !p-0 shadow-none outline-none placeholder:text-sm placeholder:font-normal dark:bg-dark-400 dark:placeholder:text-light-300/30"
          value={amount}
          placeholder="0.00"
          onChange={handleAmountChange}
        />
      </div>
      {AuthUser && (
        <span className="font-sm mt-2 text-sm font-medium text-[#0000004D]/30 dark:text-light-400">
          Available Balance: {toCurrency(AuthUser.wallet_balance)}
        </span>
      )}
    </div>
  );
};

export default PriceInput;
