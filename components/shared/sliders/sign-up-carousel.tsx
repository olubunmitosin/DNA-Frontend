"use client";
import { EmblaCarouselType } from "embla-carousel";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import { DotButton } from "./dot-buttons";

export default function SignUpCarousel() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  //   console.log(scrollSnaps);
  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setScrollSnaps(api.scrollSnapList());
    api.on("reInit", () => {
      setScrollSnaps(api.scrollSnapList());
    });

    api.on("reInit", () => {
      setSelectedIndex(api.selectedScrollSnap());
    });

    api.on("select", () => setSelectedIndex(api.selectedScrollSnap()));
  }, [api, onInit, onSelect]);

  const onDotButtonClick = React.useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="size-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className=" relative  h-full"
      >
        <CarouselContent className="-ml-4 lg:h-screen xl:h-[92vh]  ">
          <CarouselItem className="h-full">
            <div className="relative flex h-full items-end justify-start rounded-[12px] bg-[url(/assets/images/sign-up-one.jpeg)] bg-cover bg-top bg-no-repeat px-[30px] py-[50px]">
              <div className="relative z-30 flex flex-col gap-4">
                <h4 className="text-3xl font-semibold text-white">
                  DNA Sample Analysis
                </h4>
                <p className="max-w-[500px] text-2xl font-medium text-white">
                  Advanced matching algorithms to help identify suspects and
                  trace ancestry
                </p>
              </div>
              <div className="absolute left-0 top-0 z-10 size-full rounded-[12px] bg-black/20" />
            </div>
          </CarouselItem>
          <CarouselItem className="h-full">
            <div className="relative flex h-full items-end justify-start rounded-[12px] bg-[url(/assets/images/sign-up-two.jpeg)] bg-cover bg-top bg-no-repeat px-[30px] py-[50px]">
              <div className="relative z-30 flex flex-col gap-4">
                <h4 className="text-3xl font-semibold text-white">
                  Ancestry Tracing
                </h4>
                <p className="max-w-[500px] text-2xl font-medium text-white">
                  Explore genetic relationships and kinship insights for case
                  breakthroughs
                </p>
              </div>
              <div className="absolute left-0 top-0 z-10 size-full rounded-[12px] bg-black/20" />
            </div>
          </CarouselItem>
          <CarouselItem className="h-full">
            <div className="relative flex h-full items-end justify-start rounded-[12px] bg-[url(/assets/images/sign-up-three.jpeg)] bg-cover bg-top bg-no-repeat px-[30px] py-[50px]">
              <div className="relative z-30 flex flex-col gap-4">
                <h4 className="text-3xl font-semibold text-white">
                  Real-Time Intelligence Reports
                </h4>
                <p className="max-w-[500px] text-2xl font-medium text-white">
                  Receive timely, actionable insights for criminal investigation
                </p>
              </div>
              <div className="absolute left-0 top-0 z-10 size-full rounded-[12px] bg-black/20" />
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="embla__dots !absolute bottom-0 mb-[3%] ml-[30px] mt-3">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={cn(
                "appearance-none bg-transparent flex cursor-pointer border p-0 m-0 size-[10px] items-center justify-center rounded-full",
                index === selectedIndex ? "bg-white w-[30px]" : ""
              )}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
