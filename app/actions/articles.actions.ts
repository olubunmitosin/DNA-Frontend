"use server";

import { AriclesMain, MainCategories } from "@/types";

import { getSession } from "./session.action";

export const getAllArticles = async () => {
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/get/all/news`,
      {
        headers: headersList,
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid Token",
      };
    }

    const data: AriclesMain = await response.json();

    return {
      success: data.message,
      articles: data.data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
export const getRecentArticles = async () => {
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/get/recent/news`,
      {
        headers: headersList,
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid Token",
      };
    }

    const data: AriclesMain = await response.json();

    return {
      success: data.message,
      articles: data.data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
export const getAllNewsCategories = async () => {
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/get/all/categories`,
      {
        headers: headersList,
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid Token",
      };
    }

    const data: MainCategories = await response.json();

    return {
      success: data.message,
      categories: data.data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
export const getCategoryByID = async (category: string) => {
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/get/news/by/category?category_id=${category}`,
      {
        headers: headersList,
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid Token",
      };
    }

    const data: AriclesMain = await response.json();

    return {
      success: data.message,
      articles: data.data,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
