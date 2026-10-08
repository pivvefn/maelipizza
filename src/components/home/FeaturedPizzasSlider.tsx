"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { FeaturedPizza } from "@/lib/menu";
import { formatPrice } from "@/lib/menu";
import { images } from "@/lib/images";
import Link from "next/link";

interface FeaturedPizzasSliderProps {
  pizzas: FeaturedPizza[];
}

const FALLBACK_BG = images.sliderFallback;

export default function FeaturedPizzasSlider({ pizzas }: FeaturedPizzasSliderProps) {

  const [itemsPerView, setItemsPerView] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const [dragDelta, setDragDelta] = useState(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const activePointerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setItemsPerView(1);
      } else if (w < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = pizzas.length;

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setWithTransition(true);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const threshold = 40; 

    if (distance > threshold) {

      handleNext();
    } else if (distance < -threshold) {

      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    draggingRef.current = true;
    activePointerRef.current = e.pointerId;
    dragStartXRef.current = e.clientX;
    setDragDelta(0);
    setWithTransition(false);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      setDragDelta(0);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || e.pointerId !== activePointerRef.current) return;
    setDragDelta(e.clientX - dragStartXRef.current);
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    activePointerRef.current = null;
    const delta = e.clientX - dragStartXRef.current;
    const soglia = 50;
    setDragDelta(0);
    if (delta < -soglia) {
      handleNext();
    } else if (delta > soglia) {
      handlePrev();
    } else {
      setWithTransition(true);
    }
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= total) {
      setWithTransition(false);
      setCurrentIndex(0);
    }
  };

  const extendedPizzas = [...pizzas, ...pizzas, ...pizzas];

  if (pizzas.length === 0) {
    return null;
  }

  const stepPercentage = 100 / itemsPerView;

  const pages = Math.ceil(total / itemsPerView);
  const activePage = Math.min(
    Math.floor((currentIndex % total) / itemsPerView),
    pages - 1,
  );

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full relative">

      <div className="relative w-full flex items-center md:gap-4">

        <button
          type="button"
          onClick={handlePrev}
          aria-label="Pizza precedente"
          className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-surface-container-lowest hover:bg-primary text-on-surface hover:text-on-primary border border-outline-variant/30 shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 items-center justify-center group z-10"
        >
          <span className="material-symbols-outlined text-[26px] transition-transform group-hover:-translate-x-0.5">
            chevron_left
          </span>
        </button>

        <div
          className="overflow-hidden flex-1 w-full py-2 cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          <div
            className={`flex ${withTransition ? "transition-transform duration-500 ease-out" : ""}`}
            style={{
              transform: `translateX(calc(-${currentIndex * stepPercentage}% + ${dragDelta}px))`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedPizzas.map((pizza, idx) => {
              return (
                <div
                  key={`${pizza.nome}-${idx}`}
                  className="shrink-0 w-full px-1 sm:px-3"
                  style={{ width: `${stepPercentage}%` }}
                >

                  <article
                    className="group relative rounded-3xl overflow-hidden min-h-[500px] bg-cover bg-center flex flex-col justify-end p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{
                      backgroundImage: `url("${pizza.imageUrl || FALLBACK_BG}")`,
                    }}
                  >

                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 via-transparent to-transparent pointer-events-none" />

                    <div className="relative z-10 bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-5 shadow-lg space-y-3 min-h-[220px]">

                      <div className="flex items-center justify-between gap-2 md:min-h-[42px]">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary text-primary font-label-md text-label-md font-bold tracking-tight bg-primary/5">
                          <span
                            className="material-symbols-outlined text-[16px] text-primary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            local_pizza
                          </span>
                          {pizza.categoria}
                        </span>
                        <span className="font-headline-md text-headline-md font-bold text-secondary tracking-tight shrink-0">
                          {formatPrice(pizza.prezzo)}€
                        </span>
                      </div>

                      <h3 className="font-headline-md text-headline-md font-bold text-primary tracking-tight leading-tight md:min-h-[60px]">
                        {pizza.nome}
                      </h3>

                      <div className="w-full border-t border-surface-container-highest" />

                      <div className="space-y-1 pt-0.5">
                        <div className="flex items-center gap-1.5 text-tertiary">
                          <span
                            className="material-symbols-outlined text-[16px] text-primary font-bold"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            restaurant
                          </span>
                          <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">
                            Ingredienti
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed md:min-h-[92px]">
                          {pizza.ingredienti}
                        </p>
                      </div>

                      {pizza.nota && (
                        <p className="font-label-sm text-label-sm text-secondary italic flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">
                            info
                          </span>
                          {pizza.nota}
                        </p>
                      )}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Prossima pizza"
          className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-surface-container-lowest hover:bg-primary text-on-surface hover:text-on-primary border border-outline-variant/30 shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 items-center justify-center group z-10"
        >
          <span className="material-symbols-outlined text-[26px] transition-transform group-hover:translate-x-0.5">
            chevron_right
          </span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 pt-1">

        <button
          type="button"
          onClick={handlePrev}
          aria-label="Pizza precedente"
          className="md:hidden w-11 h-11 rounded-full bg-surface-container-lowest border border-outline-variant/35 shadow-md flex items-center justify-center text-on-surface active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-[22px]">
            chevron_left
          </span>
        </button>

        <div className="flex items-center justify-center gap-2.5">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Vai alla schermata ${i + 1} di ${pages}`}
              onClick={() => {
                setWithTransition(true);
                setCurrentIndex(i * itemsPerView);
              }}
              className={`h-3 rounded-full transition-all duration-300 ${
                activePage === i
                  ? "w-9 bg-primary shadow-xs"
                  : "w-3 bg-surface-container-high hover:bg-surface-variant"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Prossima pizza"
          className="md:hidden w-11 h-11 rounded-full bg-surface-container-lowest border border-outline-variant/35 shadow-md flex items-center justify-center text-on-surface active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-[22px]">
            chevron_right
          </span>
        </button>
      </div>

      <div className="flex justify-center pt-1">
        <Link
          href="/listino"
          className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-lg hover:shadow-2xl hover:scale-[1.04] hover:bg-primary-container transition-all duration-200 ease-out transform active:scale-95 relative overflow-hidden"
        >
          <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:rotate-12">
            restaurant_menu
          </span>
          <span className="relative">
            Sfoglia il Listino Completo
            <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-on-primary transition-all duration-300 ease-out group-hover:w-full" />
          </span>
          <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:translate-x-1">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
