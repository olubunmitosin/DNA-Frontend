/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { removeS } from "@/lib/utils";

interface PageTitleHeaderProps {
  page: string;
  addLink?: string;
  addType?: string;
  showCrumbs?: boolean;
  showbtn?: boolean;
  addDialog?: boolean;
  dialogContent?: React.ReactNode;
  secondBtn?: React.ReactNode;
}

const PageTitleHeader = ({
  page,
  addLink,
  addType,
  showCrumbs,
  showbtn,
  addDialog,
  dialogContent,
  secondBtn,
}: PageTitleHeaderProps) => {
  const pathname = usePathname();
  const parts = pathname.split("/");
  parts.shift();
  const breadcrumbs = parts;
  return (
    <section className="mb-2 flex items-center justify-between md:mb-4 2xl:mb-6">
      <div className="flex flex-col items-start gap-1">
        <h2 className="text-xl font-bold dark:text-light-200">{page}</h2>
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.length > 1 ? (
              breadcrumbs.map((crum, i) => (
                <div key={`${crum} - ${i}`} className="flex items-center gap-2">
                  <BreadcrumbItem key={`${crum} - ${i}`}>
                    {i < breadcrumbs.length - 1 ? (
                      <BreadcrumbLink
                        href={`/${breadcrumbs.slice(0, i + 1).join("/")}`}
                      >
                        <span className="text-sm font-semibold capitalize">
                          {crum}
                        </span>
                      </BreadcrumbLink>
                    ) : (
                      <span className="capitalize">{crum}</span>
                    )}
                  </BreadcrumbItem>
                  {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </div>
              ))
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-semibold" href="/dashboard">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span>{page}</span>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="my-2 flex gap-2 md:my-0 md:ml-auto">
        {addLink && !addDialog && (
          <Link
            href={addLink}
            className="light-border-2 text-dark400_light500 flex items-center gap-2 rounded-md  border p-2"
          >
            <Plus />
            Add New {removeS(page)}
          </Link>
        )}
        <div>{secondBtn}</div>
      </div>

      {dialogContent}
    </section>
  );
};

export default PageTitleHeader;
