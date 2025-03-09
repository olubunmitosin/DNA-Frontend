"use client";
import { LogOut } from "lucide-react";
import * as React from "react";

import { sidebarItems } from "@/constants";

import { Logo } from "./logo";
import { LogoutModal } from "../dialog/logout-modal";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../ui/sidebar";
// type Props = {

// };
export const AppSidebar = () => {
  //   const {} = useSidebar();
  return (
    <Sidebar
      className="p-[15px]"
      side="left"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="mb-[20px] flex !flex-row items-start justify-between bg-white group-data-[collapsible=icon]:!p-0 dark:bg-transparent  2xl:mb-[30px]">
        <Logo
          logoLink="/assets/images/logo.png"
          className="h-[30.33px] w-[123.54px] object-contain group-data-[collapsible=icon]:!hidden"
        />
        <div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="custom-scrollbar flex flex-col justify-between space-y-4 bg-white dark:bg-transparent">
        <SidebarGroup className="!p-0">
          <SidebarGroupContent>
            <SidebarMenu className="!gap-4">
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.name} className="">
                  <SidebarMenuButton
                    key={item.name}
                    asChild
                    className="py-[18px] hover:bg-accent"
                    tooltip={item.name}
                  >
                    <a href={item.href} className="space-x-[10px]">
                      <item.icon className="!size-4 text-[#787878] group-data-[collapsible=icon]:!size-4 lg:!size-5" />
                      <span className="text-sm font-normal hover:font-medium hover:text-primary lg:text-base">
                        {item.name}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="!mt-[40px] !p-0 lg:!mt-[60px] 2xl:!mt-[130px]">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              <SidebarMenuItem className="">
                <SidebarMenuButton
                  asChild
                  className="py-[18px] hover:bg-accent"
                >
                  <LogoutModal
                    trigger={
                      <Button
                        variant={"ghost"}
                        className="flex w-full items-start justify-start space-x-[18px] p-2 hover:bg-accent"
                      >
                        <LogOut className="!size-4 rotate-180 text-[#DF3600] lg:!size-5" />
                        <span className="text-sm font-normal hover:font-medium hover:text-primary lg:text-base">
                          Logout
                        </span>
                      </Button>
                    }
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
