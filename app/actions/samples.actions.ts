"use server";

import { revalidatePath } from "next/cache";

import { AllSampleD, AllSamplesD, MainSropOff, MaiPickUP } from "@/types";

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
      `${process.env.NEXT_PUBLIC_BASE_URL}/save/sample/type`,
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
export const SaveSampleProcess = async (values: FormData, pathname: string) => {
  try {
    console.log("SAMPLE+PROCESS", values);
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/save/sample/process`,
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

    console.log("SAVE_SAMPLE+PROCESS", data);
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
export const SaveSampleDroffOff = async (
  values: FormData,
  pathname: string
) => {
  try {
    console.log("SAMPLE+PROCESS", values);
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/save/sample/dropoff`,
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

    console.log("SAVE_SAMPLE+PROCESS", data);
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
export const UpdateSampleDroffOff = async (
  values: FormData,
  pathname: string
) => {
  try {
    console.log("SAMPLE+PROCESS", values);
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/update/sample/dropoff`,
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

    console.log("UPDATE_SAMPLE+PROCESS", data);
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
export const SaveSamplePickUp = async (values: FormData, pathname: string) => {
  try {
    console.log("SAMPLE+PROCESS", values);
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/save/sample/pickup`,
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

    console.log("SAVE_SAMPLE+PROCESS", data);
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

export const getDropOffSamples = async () => {
  // const token = localStorage.getItem("authToken");

  try {
    const session = await getSession();
    const token = session.accessToken;
    if (!token) {
      return {
        error: "No Bearer Token",
      };
    }

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
      `${process.env.NEXT_PUBLIC_BASE_URL}/get/dropoff/samples`,
      {
        headers: headersList,
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid Token",
      };
    }

    const data: MainSropOff = await response.json();

    return {
      success: data.message,
      samples: data.data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
export const getPickUPSamples = async () => {
  // const token = localStorage.getItem("authToken");

  try {
    const session = await getSession();
    const token = session.accessToken;
    if (!token) {
      return {
        error: "No Bearer Token",
      };
    }

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
      `${process.env.NEXT_PUBLIC_BASE_URL}/get/pickup/samples`,
      {
        headers: headersList,
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid Token",
      };
    }

    const data: MaiPickUP = await response.json();

    return {
      success: data.message,
      samples: data.data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
export const getAllSamples = async () => {
  // const token = localStorage.getItem("authToken");

  try {
    const session = await getSession();
    const token = session.accessToken;
    if (!token) {
      return {
        error: "No Bearer Token",
      };
    }

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
      `${process.env.NEXT_PUBLIC_BASE_URL}/get/all/samples`,
      {
        headers: headersList,
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid Token",
      };
    }

    const data: AllSamplesD = await response.json();

    return {
      success: data.message,
      samples: data.data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
export const getSampleByID = async (values: FormData) => {
  // const token = localStorage.getItem("authToken");
  try {
    const session = await getSession();
    const token = session.accessToken;
    if (!token) {
      return {
        error: "No Bearer Token",
      };
    }

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
      `${process.env.NEXT_PUBLIC_BASE_URL}/get/sample/by/id`,
      {
        method: "POST",
        body: values,
        headers: headersList,
      }
    );

    const data: AllSampleD = await response.json();

    if (data.status === false) {
      return {
        error: data.message,
      };
    }

    return {
      success: data.message,
      data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
