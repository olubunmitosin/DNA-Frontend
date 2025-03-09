import React from "react";

import {
  getAllNewsCategories,
  getRecentArticles,
} from "@/app/actions/articles.actions";
import UpdateAndNewsPage from "@/components/pages/dashboard/update-page";

const UpdateAndNewsDash = async () => {
  const recentArticles = await getRecentArticles();
  const allCategories = await getAllNewsCategories();

  return (
    <UpdateAndNewsPage
      articles={recentArticles?.articles}
      categories={allCategories?.categories}
    />
  );
};

export default UpdateAndNewsDash;
