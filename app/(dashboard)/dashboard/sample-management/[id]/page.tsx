import { notFound } from "next/navigation";
import React from "react";

import { getSampleByID } from "@/app/actions/samples.actions";
import SampleDetailsPage from "@/components/pages/dashboard/sample-details-page";

export default async function SampleSinglePage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const formData = new FormData();
  formData.append("sampleId", id);
  const sample = await getSampleByID(formData);

  if (!sample?.success) {
    return notFound();
  }
  return <SampleDetailsPage sample={sample?.data.data} />;
}
