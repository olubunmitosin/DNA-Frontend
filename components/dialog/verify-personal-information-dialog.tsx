"use client";
import * as React from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "@/types/main";

import VerifyPersonalInfoForm from "../forms/verify-personal-info-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
export type BetProps = {
  trigger: React.ReactNode;
  user: User;
  pathname: string;
};
export const VerifyPersonalInfoDialog = (props: BetProps) => {
  const [openDIalog, setOpenDIalog] = React.useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={openDIalog} onOpenChange={setOpenDIalog}>
        <DialogTrigger asChild>{props.trigger}</DialogTrigger>
        <DialogContent className=" px-0 py-4">
          <DialogTitle className="sr-only">
            Verify Perosnal Information
          </DialogTitle>
          <div className="custom-scrollbar h-full max-h-[450px] overflow-y-scroll px-4">
            <VerifyPersonalInfoForm
              user={props.user}
              pathname={props.pathname}
              setOpenDialog={setOpenDIalog}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={openDIalog} onOpenChange={setOpenDIalog}>
      <DrawerTrigger asChild>{props.trigger}</DrawerTrigger>
      <DrawerContent className="no-focus !p-4 !pb-6 !pt-0">
        <DrawerTitle className="sr-only">
          Verify Perosnal Information
        </DrawerTitle>
        <div className="custom-scrollbar h-full overflow-y-scroll">
          <VerifyPersonalInfoForm
            user={props.user}
            pathname={props.pathname}
            setOpenDialog={setOpenDIalog}
          />{" "}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
