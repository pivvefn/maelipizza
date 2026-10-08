"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOpeningStatus } from "@/lib/opening-hours";
import { useCart } from "@/lib/cart";
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/listino", label: "Listino" },
  { href: "/chi-siamo", label: "Chi Siamo" },
  { href: "/novita", label: "Novità" },
];

export default function Header() {
  const pathname = usePathname();
  const openingStatus = useOpeningStatus();
  const { totalePezzi } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">

      <div className="w-full bg-on-surface text-surface py-space-xs px-margin md:px-margin-desktop">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm overflow-hidden text-ellipsis whitespace-nowrap">
            {openingStatus.isOpen ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm uppercase tracking-wider font-bold shrink-0 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-surface animate-ping" />
                Aperto
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-bold shrink-0 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-surface animate-ping" />
                Chiuso
              </span>
            )}
            <p className="font-label-sm text-label-sm text-surface-container-high truncate">
              {!openingStatus.isOpen && (
                <>
                  <strong className="text-surface font-semibold">
                    {openingStatus.headline}
                  </strong>{" "}
                </>
              )}
              {openingStatus.subline}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-space-md shrink-0 font-label-sm text-label-sm text-surface-variant">
            <span className="inline-flex items-center gap-1 text-secondary-container">
              <span className="material-symbols-outlined text-[14px]">
                verified
              </span>
              Impasti Artigianali dal 2003
            </span>
            <span className="text-tertiary">•</span>
            <span>Campocroce di M.V.to (TV)</span>
          </div>
        </div>
      </div>

      <div className="h-20 max-w-7xl mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-lg">
          <Link className="flex items-center gap-space-sm group" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Logo Maeli Pizza"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              src={images.logo}
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface leading-none group-hover:text-primary transition-colors">
                Maeli Pizza
              </span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                Campocroce dal 2003
              </span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "px-space-md py-2 transition-all duration-200 bg-surface-container-high text-primary font-semibold rounded-full shadow-xs hover:scale-[1.05]"
                      : "px-space-md py-2 rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary hover:font-semibold hover:shadow-xs hover:scale-[1.05] transition-all duration-200 ease-out active:scale-95"
                  }
                  href={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-space-sm md:gap-space-md">

          <a
            className="hidden md:relative md:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm hover:shadow-md hover:scale-[1.04] transition-all duration-200 ease-out active:scale-95 group"
            href="tel:+393501096092"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-12">
              phone_in_talk
            </span>
            <span className="hidden sm:inline font-semibold">
              Chiama: +39 350 109 6092
            </span>
            <span className="sm:hidden font-semibold">Chiama</span>
          </a>

          <Link
            href="/listino/carrello"
            aria-label="Carrello"
            className="relative p-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">
              shopping_bag
            </span>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm flex items-center justify-center font-bold">
              {totalePezzi}
            </span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Apri menu di navigazione"
                size="icon-lg"
                variant="ghost"
                className="xl:hidden rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[22px]">
                  menu
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="gap-0 p-0 bg-surface-container-lowest border-l border-surface-container text-on-surface sm:max-w-sm"
            >
              <SheetHeader className="border-b border-surface-container px-6 py-5 pr-14">
                <SheetTitle className="flex items-center gap-space-sm text-left">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Logo Maeli Pizza"
                    className="h-10 w-auto object-contain"
                    src={images.logo}
                  />
                  <span className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface leading-none">
                      Maeli Pizza
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                      Campocroce dal 2003
                    </span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-3 py-4">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        className={
                          isActive
                            ? "px-5 py-3 rounded-full bg-surface-container-high text-primary font-semibold transition-colors"
                            : "px-5 py-3 rounded-full font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high hover:font-semibold transition-all duration-200"
                        }
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-surface-container px-6 py-6 flex flex-col gap-3">
                <Button
                  asChild
                  className="h-12 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm hover:opacity-95 active:scale-95"
                >
                  <a href="tel:+393501096092">
                    <span className="material-symbols-outlined text-[18px]">
                      phone_in_talk
                    </span>
                    Chiama: +39 350 109 6092
                  </a>
                </Button>
                <p className="text-center font-label-sm text-label-sm text-on-surface-variant">
                  Mercoledì – Domenica 18:30 – 21:30 · Lunedì – Martedì CHIUSO
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
