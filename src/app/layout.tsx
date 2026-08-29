import type { Metadata } from "next";
import { Montserrat, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_TAGLINE } from "@/lib/constants";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/images/og.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${montserrat.variable} ${beVietnamPro.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
