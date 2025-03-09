import React from "react";

import { getAllSamples } from "@/app/actions/samples.actions";
import SampleManagementPage from "@/components/pages/dashboard/sample-management";

const SampleManagementDashboard = async () => {
  const samples = await getAllSamples();
  const arrangedSamples = samples?.samples?.sort(
    (a, b) =>
      (new Date(b.updated_at || new Date()).getTime() ?? 0) -
      (new Date(a.updated_at || new Date()).getTime() ?? 0)
  );

  // const columnData = await mergeSampleData();
  return (
    <div>
      <SampleManagementPage columnData={arrangedSamples || []} />
    </div>
  );
};

export default SampleManagementDashboard;
