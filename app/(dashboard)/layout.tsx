// import { cookies } from "next/headers";
// import ClientOnly from "@/components/shared/client-only";
// import { DashboardHeader } from "@/components/shared/header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import ClientOnly from "@/components/shared/client-only";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";

import { getUserDetails } from "../actions/auth.actions";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // const cookieStore = await cookies();
  // const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const user = await getUserDetails();

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full ">
        <DashboardHeader user={user.userDetails} />
        <main className="relative size-full bg-[#F4F4F4] px-[20px] py-[14px] lg:px-[30px] lg:py-[24px] 2xl:px-[40px]">
          <ClientOnly>{children}</ClientOnly>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
