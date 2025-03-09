import React from "react";

import { getUserDetails } from "@/app/actions/auth.actions";
import { SettingsPageComp } from "@/components/pages/dashboard/settings-page";

const SettingsPage = async () => {
  const user = await getUserDetails();
  return <SettingsPageComp user={user.userDetails} />;
};

export default SettingsPage;
