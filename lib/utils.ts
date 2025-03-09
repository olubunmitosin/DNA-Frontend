/* eslint-disable camelcase */
import { clsx, type ClassValue } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to capitalize the first letter
export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to lowercase the first letter
export const lowercaseFirstLetter = (string: string): string => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

export const sentenceCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
export const formatDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const options: Intl.DateTimeFormatOptions = {
    month: "short", // Abbreviated month name, e.g., "Sep"
    day: "2-digit", // Day of the month, e.g., "28"
    year: "numeric", // Full year, e.g., "2024"
  };

  // Format the date using the given options
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
export const lowerCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
};

export const titleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}
export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};
export function removeS(page: string): string {
  // Check if the string contains "s"
  if (page.charAt(page.length - 1) === "s") {
    // Remove the last character
    return page.slice(0, -1);
  } else {
    // If "s" is not found, return the original string
    return page;
  }
}

/**
 * Formats a number to a string representation with support for million (M) and billion (B) abbreviations.
 * @param {number} value - The number to be formatted.
 * @returns {string} - The formatted string.
 */
export function formatNumber(value: number): string {
  // Check if the value is less than 0
  if (value < 0) {
    // Handle negative values separately and format the absolute value
    const absoluteValue = Math.abs(value);
    return `-${formatNumber(absoluteValue)}`;
  } else if (value >= 1e9) {
    // Format the value in billions
    const formattedValue = value / 1e9;
    return `${formattedValue.toFixed(1)}B`;
  } else if (value >= 1e6) {
    // Check if the value is between 1 million and 1 billion
    // Format the value in millions
    const formattedValue = value / 1e6;
    return `${formattedValue.toFixed(1)}M`;
  } else if (value >= 1000) {
    // Check if the value is between 1 thousand and 1 million
    // Format the value in thousands
    const formattedValue = value / 1000;
    return `${formattedValue.toFixed(1)}K`;
  } else {
    // If the value is less than 1 thousand, return the original value as a string
    return value.toString();
  }
}
export const formatAndDivideNumber = (num: number): string => {
  if (typeof num === "number") {
    if (num >= 1000000) {
      const formattedNum = (num / 1000000).toFixed(1);
      return `${formattedNum}M`;
    } else if (num >= 1000) {
      const formattedNum = (num / 1000).toFixed(1);
      return `${formattedNum}K`;
    } else {
      return num.toString();
    }
  } else {
    return "N/A";
  }
};

/**
 * This is for storing prices in database as float isn't supported by some database, it is better to store it in multiple integers then divide it
 * @param {number} value - The number to be formatted.
 * @returns {string} - The formatted string.
 */
export const convertAmountFromMilinunits = (amount: number) => {
  return amount / 1000;
};
export const convertAmountToMilinunits = (amount: number) => {
  return Math.round(amount * 1000);
};
export function minutesToHours(minutes: number): number {
  return minutes / 60;
}
export function toCurrency(
  number: number | string,
  disableDecimal = false,
  decimalPlaces = 2
) {
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: disableDecimal ? 0 : decimalPlaces,
    maximumFractionDigits: disableDecimal ? 0 : decimalPlaces,
  });
  return formatter.format(+number);
}
export function generateSlug(title: string) {
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  return slug.replace(/[^a-z0-9-]/g, "");
}
export const formatDateUtil = (dateInput: string | Date): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const options: Intl.DateTimeFormatOptions = {
    month: "short", // Abbreviated month name, e.g., "Sep"
    day: "2-digit", // Day of the month, e.g., "28"
    year: "numeric", // Full year, e.g., "2024"
  };

  // Format the date using the given options
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
export function formatDateToYMD(mDate: Date): string {
  const date = new Date(mDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
export function getCurrentTime(date: Date): string {
  const now = new Date(date);

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function parseDateAndTime(dateStr: string, timeStr: string): Date {
  // Parse date string (YYYY-MM-DD)
  const [year, month, day] = dateStr.split("-").map(Number);

  // Parse time string (HH:MM AM/PM)
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  // Convert 12-hour format to 24-hour format
  const adjustedHours =
    period === "PM" && hours !== 12
      ? hours + 12
      : period === "AM" && hours === 12
      ? 0
      : hours;

  // Create and return Date object
  return new Date(year, month - 1, day, adjustedHours, minutes);
}

// eslint-disable-next-line camelcase
export const isEmailVerified = (email_verified_at: Date | null): boolean => {
  return email_verified_at !== null;
};
export function extractFilename(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname.split("/").pop() || "video-file"; // Extract filename or provide default
  } catch (error) {
    console.error("Error extracting filename:", error);
    return "video-file"; // Default filename
  }
}
export function extractFileExtension(contentType: string) {
  if (!contentType) {
    return "jpg"; // Default extension or handle as needed
  }
  const parts = contentType.split("/");
  if (parts.length === 2) {
    return parts[1].split(";")[0].toLowerCase(); // Extract and handle parameters
  }
  console.warn("Invalid Content-Type:", contentType);
  return "jpg"; // Default or handle error
}
export const estimateReadingTime = (text: string): string => {
  // Average reading speed (words per minute)
  const wordsPerMinute = 200;

  // Count the number of words in the article
  const wordCount = text.split(/\s+/).length;

  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  // Return the reading time with the text "minutes read"
  return `${readingTime} min${readingTime > 1 ? "s" : ""} read`;
};

export function timeAgo(dateInput: string | Date) {
  // Convert string to Date only if it's not already a Date object
  const past = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInMs = now.getTime() - past.getTime();

  // Conversion constants
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day; // Approximation
  // const year = 365 * day; // Approximation

  if (diffInMs < minute) return "Just now";
  if (diffInMs < hour) return `${Math.floor(diffInMs / minute)} m`;
  if (diffInMs < day) return `${Math.floor(diffInMs / hour)} hrs`;

  const days = diffInMs / day;
  if (days < 2) return "1 day";
  if (days < 7) return `${Math.floor(days)} days`;

  const weeks = diffInMs / week;
  if (weeks < 2) return "1 week";
  if (weeks < 4) return `${Math.floor(weeks)} weeks`;

  const months = diffInMs / month;
  if (months < 2) return "1 month";
  if (months < 12) return `${Math.floor(months)} months`;

  // If over 12 months, format as a readable date
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return past.toLocaleDateString(undefined, options); // Example: "Oct 11, 2024"
}
export const formatTimestamp = (timestamp: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short", // Abbreviated month name
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  };

  return new Intl.DateTimeFormat("en-US", options).format(timestamp);
};
