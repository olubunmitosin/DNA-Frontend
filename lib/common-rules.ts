import * as z from "zod";

import { messages } from "@/constants/valiadators";

export const FileSchema = z.object({
  name: z.string(),
  url: z.string(),
  size: z.number(),
  // key: z.optional(z.string()),
});
export const validateEmail = z
  .string()
  .min(1, { message: messages.emailIsRequired })
  .email({ message: messages.invalidEmail });

export const validatePassword = z
  .string()
  .min(1, { message: messages.passwordRequired })
  .min(6, { message: messages.passwordLengthMin })
  .regex(/.*[A-Z].*/, {
    message: messages.passwordOneUppercase,
  })
  .regex(/.*[a-z].*/, {
    message: messages.passwordOneLowercase,
  })
  .regex(/.*\d.*/, {
    message: messages.passwordOneNumeric,
  });
export const validateNewPassword = z
  .string()
  .min(1, { message: messages.passwordRequired })
  .min(6, { message: messages.passwordLengthMin })
  .regex(/.*[A-Z].*/, {
    message: messages.passwordOneUppercase,
  })
  .regex(/.*[a-z].*/, {
    message: messages.passwordOneLowercase,
  })
  .regex(/.*\d.*/, {
    message: messages.passwordOneNumeric,
  });
export const validateConfirmPassword = z
  .string()
  .min(1, { message: messages.confirmPasswordRequired })
  .min(6, { message: messages.passwordLengthMin })
  .regex(/.*[A-Z].*/, {
    message: messages.passwordOneUppercase,
  })
  .regex(/.*[a-z].*/, {
    message: messages.passwordOneLowercase,
  })
  .regex(/.*\d.*/, {
    message: messages.passwordOneNumeric,
  });
export const SetupPasswordSchema = z
  .object({
    password: validatePassword,
    newPassword: validateNewPassword,
    confirmPassword: validateConfirmPassword,
  })
  .refine(
    (data) => {
      if (data.password && !data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.confirmPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  )
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: messages.passwordsDidNotMatch,
    path: ["confirmPassword"], // Correct path for the confirmedPassword field
  });

export const SetupPasswordCSchema = z
  .object({
    password: validatePassword,
    confirmPassword: validateConfirmPassword,
  })
  .refine(
    (data) => {
      if (data.password && !data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.confirmPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: messages.passwordsDidNotMatch,
    path: ["confirmPassword"], // Correct path for the confirmedPassword field
  });
