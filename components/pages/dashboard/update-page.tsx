"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import PageTitleHeader from "@/components/shared/page-title-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { estimateReadingTime, generateSlug, timeAgo } from "@/lib/utils";
import { ArticlesDatum, CategoriesDatum } from "@/types";

type Props = {
  articles: ArticlesDatum[] | undefined;
  categories: CategoriesDatum[] | undefined;
};

const UpdateAndNewsPage = (props: Props) => {
  const [images, setImages] = useState(
    props.articles?.map(
      (article) => article.image || "/assets/images/sign-up-one.jpeg"
    )
  );

  const handleImageError = (index: number) => {
    // Update the specific image fallback
    setImages((prev) =>
      prev?.map((src, i) =>
        i === index ? "/assets/images/sign-up-one.jpeg" : src
      )
    );
  };
  return (
    <>
      <PageTitleHeader page="Update and News" />
      <div className="flex grid-cols-12 flex-col gap-8 lg:grid ">
        <div className="col-span-12 space-y-8 lg:col-span-8">
          <div className="flex flex-col gap-4 rounded-[4px] border border-[#E9E9E9] bg-white p-6 lg:p-8">
            <div className="flex h-[41px] w-full items-center gap-2 rounded-[20px] border border-[#e6e6e6] px-[14px] py-2">
              <Search className="size-5" />
              <Input
                placeholder="Search"
                className="h-fit w-full border-none shadow-none outline-none"
                type="text"
              />
            </div>
            <div className="mt-6 space-y-8">
              {props.articles &&
                images &&
                props.articles.map((article, i) => (
                  <div
                    key={article.id}
                    className="grid w-full grid-cols-12 items-center gap-4 "
                  >
                    <div className="col-span-9 space-y-3">
                      <h5 className="space-x-3 text-sm font-normal text-[#757575]">
                        <span className="font-medium text-primary">Admin</span>
                        <span>{timeAgo(article.created_at)} ago</span>
                      </h5>
                      <div className="space-y-2">
                        <Link
                          href={`/dashboard/updates-and-news/${generateSlug(
                            article.title
                          )}`}
                          className="max-w-[238px] font-poppins text-sm font-semibold text-[#191919] lg:text-xl "
                        >
                          {article.title}
                        </Link>{" "}
                        <p className="max-w-screen-sm text-xs font-normal text-[#7E7E7E] md:text-sm lg:text-base">
                          {article.body}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm font-normal text-[#757575]">
                        <Badge className="flex h-[22px] w-fit cursor-pointer items-center justify-center rounded-[11px] bg-[#EFEFEF] px-3 py-4 text-xs font-normal text-[#292929] hover:text-white lg:h-[29px] lg:text-sm">
                          {article.category?.name}
                        </Badge>
                        <span>{estimateReadingTime(article.body)}</span>
                        <span>Selected for you</span>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="relative h-[139px] w-full">
                        <Image
                          src={images[i]}
                          alt={`article ${i}`}
                          fill
                          onError={() => handleImageError(i)}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="flex flex-col gap-6 rounded-[4px] border border-[#E9E9E9] bg-white p-4 lg:p-6 xl:p-8">
            <h6 className="text-base font-medium text-[#323232] lg:text-lg">
              Available Categories
            </h6>
            <div className="flex flex-wrap  gap-4">
              {props.categories &&
                props.categories.map((urf) => (
                  <Badge
                    key={urf.id}
                    className="flex h-[29px] w-fit cursor-pointer items-center justify-center rounded-[11px] bg-[#EFEFEF] px-3 py-4 text-xs font-normal capitalize text-[#292929] hover:text-white lg:text-sm"
                  >
                    {urf.name}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateAndNewsPage;
