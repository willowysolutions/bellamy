"use client";

import Image from "next/image";
import Slider from "react-slick";
import { useMemo } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NewBannerImages } from "@/constants/values";

type BannerSlide = {
  id: number;
  desktopImage: string;
  mobileImage: string;
};

export default function Banner() {
  const slides: BannerSlide[] = useMemo(
    () => [
      {
        id: 1,
        desktopImage: NewBannerImages[0],
        mobileImage: NewBannerImages[1],
      },
      {
        id: 2,
        desktopImage: NewBannerImages[2],
        mobileImage: NewBannerImages[3],
      },
      {
        id: 3,
        desktopImage: NewBannerImages[4],
        mobileImage: NewBannerImages[5],
      },
      {
        id: 4,
        desktopImage: NewBannerImages[6],
        mobileImage: NewBannerImages[7],
      },
    ],
    []
  );

  const desktopSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 700,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3500,
      arrows: true,
      pauseOnHover: true,
      swipeToSlide: true,
      cssEase: "ease-in-out",
      dotsClass:
        "slick-dots !flex !items-center !justify-center !gap-2 !-bottom-10",
      appendDots: (dots: React.ReactNode) => (
        <ul className="flex items-center justify-center gap-2">{dots}</ul>
      ),
      customPaging: () => (
        <div className="w-12 h-1 bg-gray-400 rounded-full overflow-hidden cursor-pointer" />
      ),
    }),
    []
  );

  const mobileSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 600,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3500,
      arrows: false,
      pauseOnHover: true,
      swipeToSlide: true,
      cssEase: "ease-in-out",
      dotsClass:
        "slick-dots !flex !items-center !justify-center !gap-1.5 !-bottom-8",
      appendDots: (dots: React.ReactNode) => (
        <ul className="flex items-center justify-center gap-1.5">{dots}</ul>
      ),
      customPaging: () => (
        <button className="w-2 h-2 bg-stone-400/60 rounded-full transition-all" />
      ),
    }),
    []
  );

  return (
    <section className="relative w-full h-[55vh] md:h-[80vh] overflow-visible pb-10 md:pb-12 mb-10 md:mb-12">
      {/* Desktop Slider */}
      <div className="hidden md:block h-[80vh] [&_.slick-prev]:!w-10 [&_.slick-prev]:!h-16 [&_.slick-prev]:!left-2 [&_.slick-prev]:!z-20 [&_.slick-prev]:!bg-white/20 [&_.slick-prev]:!rounded-md [&_.slick-prev]:hover:!bg-white/40 [&_.slick-next]:!w-10 [&_.slick-next]:!h-16 [&_.slick-next]:!right-2 [&_.slick-next]:!z-20 [&_.slick-next]:!bg-white/20 [&_.slick-next]:!rounded-md [&_.slick-next]:hover:!bg-white/40 [&_.slick-prev:before]:!text-3xl [&_.slick-next:before]:!text-3xl [&_.slick-dots_li_button:before]:!hidden">
        <Slider {...desktopSettings} className="h-full">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative w-full h-[55vh] md:h-[80vh]"
            >
              <Image
                src={slide.desktopImage}
                alt={`Banner slide ${slide.id}`}
                fill
                priority={slide.id === 1}
                className="object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Mobile Slider */}
      <div className="block md:hidden h-[55vh] px-2 pt-2 pb-8 [&_.slick-dots_li_button:before]:!hidden">
        <Slider {...mobileSettings} className="h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="px-0.5">
              <div className="relative w-full h-[calc(55vh-2rem)] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={slide.mobileImage}
                  alt={`Banner slide ${slide.id}`}
                  fill
                  priority={slide.id === 1}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
