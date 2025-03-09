import React from "react";

import { getUserDetails } from "@/app/actions/auth.actions";
import OrderReviewComp from "@/components/pages/dashboard/order-review-page";

const OrderReviewPage = async () => {
  const loggedInUser = await getUserDetails();
  return <OrderReviewComp user={loggedInUser.userDetails} />;
};

export default OrderReviewPage;
