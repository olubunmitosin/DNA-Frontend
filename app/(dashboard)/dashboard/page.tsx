import React from "react";

import { getRecentArticles } from "@/app/actions/articles.actions";
import { getAllSamples } from "@/app/actions/samples.actions";
import DashboardPageComp from "@/components/pages/dashboard/dashboard-page";

const DashboardPage = async () => {
  const recentArticles = await getRecentArticles();

  const samples = await getAllSamples();
  const totalSub = samples?.samples?.length || 0;
  return (
    <DashboardPageComp
      submission={totalSub}
      articles={recentArticles?.articles}
      columnData={samples?.samples || []}
    />
  );
};

export default DashboardPage;
