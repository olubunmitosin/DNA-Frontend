"use server";
import { revalidatePath } from "next/cache";
import * as z from "zod";

import { SetupPasswordCSchema } from "@/lib/common-rules";
import { LoginSchema, onboardingStepOneSchema } from "@/lib/validations";

import {
  getSession,
  loginSession,
  onboardSession,
  RegisterUserSession,
} from "./session.action";

// import { RegisterUserSession } from "./session.action";

export const RegisterUser = async (values: FormData) => {
  try {
    const headersList = {
      Accept: "*/*",
      //   "Content-Type": "application/json", // Important! Set the Content-Type header
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
      {
        method: "POST",
        body: values,
        headers: headersList,
      }
    );

    const data = await response.json();
    console.log("REGISTER USER", data);

    if (data.status === false) {
      // Initialize an array to collect error messages
      const errorMessages = [];
      // Check if there are specific error messages in the errors object
      for (const [key, messages] of Object.entries(data.errors!)) {
        console.log(key);
        if (Array.isArray(messages)) {
          // If messages are present, push them to the errorMessages array
          errorMessages.push(...messages);
        }
      }

      return {
        invalid:
          errorMessages.length > 0
            ? errorMessages
            : ["An unknown error occurred."],
        message: data.message || "Validation failed.",
      };
    }

    const loginUser = {
      email: String(values.get("email") || ""),
      password: String(values.get("password") || ""),
      rememberMe: false,
    };

    await BackendLogin(loginUser).then(async (mData) => {
      if (mData.success) {
        await RegisterUserSession(mData.user.userDetails, mData.accessToken);
        return {
          success: data.message,
        };
      }
    });

    return {
      success: data.message,
    };
  } catch (error) {
    console.error("Caught error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const AuthUser = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { email, password } = validatedFields.data;
  try {
    const headersList = {
      Accept: "*/*",
    };
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
      method: "POST",
      body: formData,
      headers: headersList,
    });

    const data = await response.json();
    console.log("LOGGED_IN_USER", data);

    if (data.status === false) {
      // Initialize an array to collect error messages
      return {
        error: data.message,
      };
    }

    const user = await getBackendUserDetails(data.access_token);

    console.log("user", user);
    await loginSession(user.userDetails, data.access_token);

    return {
      success: "Logged In Successfully",
      user: data.user,
    };

    //   await loginSession(data.data.user, token);
  } catch (error) {
    console.error("Caught error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
export const BackendLogin = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { email, password } = validatedFields.data;
  try {
    const headersList = {
      Accept: "*/*",
    };
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
      method: "POST",
      body: formData,
      headers: headersList,
    });

    const data = await response.json();
    console.log("LOGGED_IN_USER", data);

    const user = await getBackendUserDetails(data.access_token);

    if (data.status === false) {
      // Initialize an array to collect error messages
      return {
        error: data.message,
      };
    }

    return {
      success: "Onboarding Started",
      user,
      accessToken: data.access_token,
    };

    //   await loginSession(data.data.user, token);
  } catch (error) {
    console.error("Caught error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
export const UpdateUserRole = async (
  values: z.infer<typeof onboardingStepOneSchema>
) => {
  const session = await getSession();
  const token = session.accessToken;

  if (!token) {
    return {
      error: "Unauthorized",
    };
  }
  const validatedFields = onboardingStepOneSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { role } = validatedFields.data;
  try {
    const headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    };
    const formData = new FormData();
    formData.append("user_type", role);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/update/role`,
      {
        method: "POST",
        body: formData,
        headers: headersList,
      }
    );

    const data = await response.json();
    console.log("UPDATE_ROLE_ACTION", data);

    if (data.status === false) {
      // Initialize an array to collect error messages
      const errorMessages = [];
      // Check if there are specific error messages in the errors object
      for (const [key, messages] of Object.entries(data.errors!)) {
        console.log(key);
        if (Array.isArray(messages)) {
          // If messages are present, push them to the errorMessages array
          errorMessages.push(...messages);
        }
      }

      return {
        invalid:
          errorMessages.length > 0
            ? errorMessages
            : ["An unknown error occurred."],
        message: data.message || "Validation failed.",
      };
    }
    const user = await getUserDetails();

    await loginSession(user.userDetails, token);

    return {
      success: data.message,
      user: data.user,
    };
  } catch (error) {
    console.error("Caught error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const getUserDetails = async () => {
  // const token = localStorage.getItem("authToken");
  try {
    const session = await getSession();
    const token = session.accessToken;

    if (!token) {
      return {
        error: "Unauthorized",
      };
    }

    const headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
      // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/detail`,
      {
        headers: headersList,
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid Token",
      };
    }

    const data = await response.json();

    return {
      success: "User details fetched",
      userDetails: data.user,
    };
  } catch (error) {
    return {
      error,
    };
  }
};
export const getBackendUserDetails = async (token: string) => {
  // const token = localStorage.getItem("authToken");
  try {
    if (!token) {
      return {
        error: "Unauthorized",
      };
    }

    const headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
      // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/detail`,
      {
        headers: headersList,
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid Token",
      };
    }

    const data = await response.json();

    return {
      success: "User details fetched",
      userDetails: data.user,
    };
  } catch (error) {
    return {
      error,
    };
  }
};

export const sendOTP = async (phone: string) => {
  try {
    const session = await getSession();
    const token = session.accessToken;

    if (!token) {
      return {
        error: "Unauthorized",
      };
    }
    const headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,

      // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };
    const formData = new FormData();

    formData.append("phone_number", phone);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/verify/mobile/send`,
      {
        method: "POST",
        body: formData,
        headers: headersList,
      }
    );

    const data = await response.json();

    console.log("SEND_OTP_ACTION", data);
    if (!response.ok) {
      return {
        error: data.message,
      };
    }
    return {
      success: data.message,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};

export const confirmOTP = async (phone: string, otp: string) => {
  try {
    const session = await getSession();
    const token = session.accessToken;

    if (!token) {
      return {
        error: "Unauthorized",
      };
    }
    const headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,

      // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };
    const formData = new FormData();

    formData.append("phone_number", phone);
    formData.append("otp", otp);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/verify/mobile/otp`,
      {
        method: "POST",
        body: formData,
        headers: headersList,
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid Phone Number",
      };
    }

    const data = await response.json();

    console.log("CONFIRM_OTP_ACTION", data);

    return {
      success: "OTP confirmed",
      data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};

export const OnboardUser = async (values: FormData, pathname: string) => {
  try {
    console.log("UPDATE_PROFILE_VALUES", values);
    const session = await getSession();
    const token = session.accessToken;
    if (!token) {
      return {
        error: "No Bearer Token",
      };
    }

    const headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,

      // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/update/profile`,
      {
        method: "POST",
        body: values,
        headers: headersList,
      }
    );

    const data = await response.json();

    if (data.status === false) {
      // Initialize an array to collect error messages
      if (data.errors) {
        const errorMessages = [];
        // Check if there are specific error messages in the errors object
        for (const [key, messages] of Object.entries(data.errors)) {
          console.log(key);
          if (Array.isArray(messages)) {
            // If messages are present, push them to the errorMessages array
            errorMessages.push(...messages);
          }
        }

        return {
          invalid:
            errorMessages.length > 0
              ? errorMessages
              : ["An unknown error occurred."],
          message: data.message || "Validation failed.",
        };
      }
    }

    console.log("UPDATE_PROFILE", data);
    if (data.status === false) {
      return {
        error: data.message,
      };
    }

    await onboardSession(data.user);

    revalidatePath(pathname);
    return {
      success: data.message,
      data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};

export const EmailSendOTP = async (email: string) => {
  try {
    // const session = await getSession();
    // const token = session.accessToken;

    // if (!token) {
    //   return {
    //     error: "Unauthorized",
    //   };
    // }
    const headersList = {
      Accept: "*/*",
      // Authorization: `Bearer ${token}`,

      // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };
    const formData = new FormData();

    formData.append("email", email);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/forgot/password`,
      {
        method: "POST",
        body: formData,
        headers: headersList,
      }
    );

    const data = await response.json();

    console.log("SEND_PASSWORD_OTP_ACTION", data);
    if (!response.ok) {
      return {
        error: data.message,
      };
    }
    return {
      success: data.message,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
export const confirmPasswordOTP = async (email: string, otp: string) => {
  try {
    // const session = await getSession();
    // const token = session.accessToken;

    // if (!token) {
    //   return {
    //     error: "Unauthorized",
    //   };
    // }
    const headersList = {
      Accept: "*/*",
      // Authorization: `Bearer ${token}`,

      // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };
    const formData = new FormData();

    formData.append("email", email);
    formData.append("otp", otp);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/confirm/otp`,
      {
        method: "POST",
        body: formData,
        headers: headersList,
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid Email",
      };
    }

    const data = await response.json();

    console.log("CONFIRM_EMAIL_OTP_ACTION", data);

    return {
      success: "OTP confirmed",
      data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};

export const RestPassword = async (
  values: z.infer<typeof SetupPasswordCSchema>,
  email: string
) => {
  const validatedFields = SetupPasswordCSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { password, confirmPassword } = validatedFields.data;

  try {
    const headersList = {
      Accept: "*/*",
      // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };
    const formData = new FormData();
    formData.append("email", email);
    formData.append("new_password", password);
    formData.append("new_password_confirmation", confirmPassword);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/reset/password`,
      {
        method: "POST",
        body: formData,
        headers: headersList,
      }
    );
    const data = await response.json();

    if (data.status === false) {
      return {
        error: data.message,
      };
    }

    if (!response.ok) {
      return {
        error: "An error occured",
      };
    }
    return {
      success: "Password successfully reset",
      data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};

export const UploadGenotype = async (values: FormData, pathname: string) => {
  try {
    console.log("UPDATE_PROFILE_GENOTYPE_VALUES", values);
    const session = await getSession();
    const token = session.accessToken;
    if (!token) {
      return {
        error: "No Bearer Token",
      };
    }

    const headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,

      // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/update/profile/genotype`,
      {
        method: "POST",
        body: values,
        headers: headersList,
      }
    );

    const data = await response.json();

    if (data.status === false) {
      // Initialize an array to collect error messages
      if (data.errors) {
        const errorMessages = [];
        // Check if there are specific error messages in the errors object
        for (const [key, messages] of Object.entries(data.errors)) {
          console.log(key);
          if (Array.isArray(messages)) {
            // If messages are present, push them to the errorMessages array
            errorMessages.push(...messages);
          }
        }

        return {
          invalid:
            errorMessages.length > 0
              ? errorMessages
              : ["An unknown error occurred."],
          message: data.message || "Validation failed.",
        };
      }
    }

    console.log("UPDATE__GENOTYPE__PROFILE", data);
    if (data.status === false) {
      return {
        error: data.message,
      };
    }

    revalidatePath(pathname);
    return {
      success: data.message,
      data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
