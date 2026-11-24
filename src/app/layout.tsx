import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/bodoni-moda/wght-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BagDrawer } from "@/components/bag-drawer";
import { SearchOverlay } from "@/components/search-overlay";
import { AccountPanel } from "@/components/account-panel";
import { Toaster } from "@/components/toaster";

export const metadata: Metadata = {
  title: {
    default: "AUREL — Wear the Future",
    template: "%s · AUREL",
  },
  description:
    "AUREL is a Paris-based fashion house making modern clothing for men and women. Sculpted outerwear, fluid tailoring and traceable fibres — designed to outlast the season.",
  applicationName: "AUREL",
};

export const viewport: Viewport = {
  themeColor: "#f4efe6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <AnnouncementBar />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <BagDrawer />
          <SearchOverlay />
          <AccountPanel />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
