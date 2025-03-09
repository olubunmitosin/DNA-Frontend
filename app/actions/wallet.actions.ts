"use server";

import { revalidatePath } from "next/cache";

import { WalletPaymentInitialized } from "@/types";

import { getSession } from "./session.action";

export const SaveSampleType = async (values: FormData, pathname: string) => {
  try {
    console.log("SAMPLE_TYPE", values);
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/make/payment`,
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

    console.log("SAVE_SAMPLE_TYPE", data);
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
export const InitiatePayment = async (values: FormData, pathname: string) => {
  try {
    console.log("AMOUNT", values);
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/make/payment`,
      {
        method: "POST",
        body: values,
        headers: headersList,
      }
    );

    const data: WalletPaymentInitialized = await response.json();

    // if (data.status === false) {
    //     return {
    //         error: ""
    //     }
    //   // Initialize an array to collect error messages
    // //   if (data.errors) {
    // //     const errorMessages = [];
    // //     // Check if there are specific error messages in the errors object
    // //     for (const [key, messages] of Object.entries(data.errors)) {
    // //       console.log(key);
    // //       if (Array.isArray(messages)) {
    // //         // If messages are present, push them to the errorMessages array
    // //         errorMessages.push(...messages);
    // //       }
    // //     }

    // //     return {
    // //       invalid:
    // //         errorMessages.length > 0
    // //           ? errorMessages
    // //           : ["An unknown error occurred."],
    // //       message: data.message || "Validation failed.",
    // //     };
    // //   }
    // }

    // REID {
    //   status: true,
    //   message: 'Payment initialized successfully.',
    //   access_code: 'sk_test_b93597defb9f4a87cda21964a9fcc4a99261760f',
    //   referenceId: 'DNA21513011'
    // }

    console.log("REID", data);
    if (data.status === false) {
      return {
        error: data.message,
      };
    }

    revalidatePath(pathname);
    return {
      success: data.message,
      access_code: data.initiate_payment_data.access_code,
      url: data.initiate_payment_data.authorization_url,
      referenceID: data.initiate_payment_data.reference,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
export const VerifyPayment = async (pathname: string, reference: string) => {
  try {
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/callback/verify/payment?reference=${reference}`,
      {
        method: "GET",
        headers: headersList,
      }
    );

    const data = await response.json();

    // if (data.status === false) {
    //     return {
    //         error: ""
    //     }
    //   // Initialize an array to collect error messages
    // //   if (data.errors) {
    // //     const errorMessages = [];
    // //     // Check if there are specific error messages in the errors object
    // //     for (const [key, messages] of Object.entries(data.errors)) {
    // //       console.log(key);
    // //       if (Array.isArray(messages)) {
    // //         // If messages are present, push them to the errorMessages array
    // //         errorMessages.push(...messages);
    // //       }
    // //     }

    // //     return {
    // //       invalid:
    // //         errorMessages.length > 0
    // //           ? errorMessages
    // //           : ["An unknown error occurred."],
    // //       message: data.message || "Validation failed.",
    // //     };
    // //   }
    // }

    // REID {
    //   status: true,
    //   message: 'Payment initialized successfully.',
    //   access_code: 'sk_test_b93597defb9f4a87cda21964a9fcc4a99261760f',
    //   referenceId: 'DNA21513011'
    // }

    console.log("REID", data);
    if (data.status === false) {
      return {
        error: data.message,
      };
    }

    revalidatePath(pathname);
    return {
      success: "This payment has been verified",
      data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
