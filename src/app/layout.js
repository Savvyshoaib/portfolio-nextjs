import "../styles.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Nova Studio - Premium digital design & development",
  description:
    "An independent design studio crafting bold brands, premium digital products, and award-winning web experiences.",
  authors: [{ name: "Nova Studio" }],
  openGraph: {
    title: "Nova Studio - Premium digital design & development",
    description: "Bold brands, premium products, and award-winning web experiences.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <div className="relative min-h-screen flex flex-col" suppressHydrationWarning>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
