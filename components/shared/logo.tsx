// @flow
import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";
type Props = {
  className: string;
  logoLink: string;
};
export const Logo = (props: Props) => {
  return (
    <div className={cn("relative", props.className)}>
      <Image src={props.logoLink} alt="logo" fill className="object-cover" />
    </div>
  );
};
