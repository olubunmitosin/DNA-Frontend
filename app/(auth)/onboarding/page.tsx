import React from "react";

import { getUserDetails } from "@/app/actions/auth.actions";
import OnboardingPageComp from "@/components/pages/onboarding-page";

export default async function OnboardingPage() {
  const user = await getUserDetails();
  return (
    <section className="h-full lg:h-screen">
      <OnboardingPageComp user={user.userDetails} />
    </section>
  );
}
