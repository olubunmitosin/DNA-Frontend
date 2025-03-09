"use client";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const GlobalSearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("global") || "";
  // const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  // useEffect(() => {
  //   setSearch(query); // Sync local state with URL query
  //   onSearch(query); // Trigger database fetch when 'q' changes in the URL
  // }, [query, onSearch]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOutsideClick = (event: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    setIsOpen(false);

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    // return () => {
    //   second
    // }
    return () => clearTimeout(delayDebounceFn);
  }, [search, pathname, router, searchParams, query]);

  // console.log(query);
  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchRef}
    >
      <div className=" relative flex min-h-[40px] w-[496px] grow items-center gap-1 rounded-[6px] border px-4 ">
        <SearchIcon className="size-5 text-[#5555559C]" />

        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          type="text"
          placeholder="Search"
          // value=""
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />
      </div>
      {/* {isOpen && <GlobalResult glSearch={glSearch} />} */}
    </div>
  );
};

export default GlobalSearchBar;
