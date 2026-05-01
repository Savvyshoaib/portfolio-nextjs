import "../styles.css";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { buildPageMetadata, getPublicSiteData, getGlobalSeoSettings } from "@/lib/cms/public";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildPageMetadata("home");
}

function HtmlInjection({ html, className }) {
  if (!html) {
    return null;
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />;
}

export default async function RootLayout({ children }) {
  const data = await getPublicSiteData();
  const settings = data.settings || {};
  const general = settings.general || {};
  const seo = settings.seo || {};

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {seo.faviconUrl && (
          <>
            <link rel="icon" href={seo.faviconUrl} sizes="any" />
            <link rel="icon" href={seo.faviconUrl} sizes="32x32" />
            <link rel="apple-touch-icon" href={seo.faviconUrl} sizes="180x180" />
          </>
        )}
      </head>
      <body suppressHydrationWarning>
        {seo.headerScripts ? (
          <Script id="cms-header-scripts" strategy="beforeInteractive">
            {seo.headerScripts}
          </Script>
        ) : null}
        <HtmlInjection html={seo.customHeadHtml} className="cms-head-injection" />

        <ThemeProvider>
          <div className="relative min-h-screen flex flex-col" suppressHydrationWarning>
            <SiteHeader
              navigation={settings.navigation}
              brandMark={general.brandMark}
              siteName={general.siteName}
              logoUrl={general.logoUrl}
              logoOnly={general.logoOnly}
              logoSize={general.logoSize}
              hireLabel={settings?.ctaLabels?.headerHire || "Hire me"}
            />
            <main className="flex-1">{children}</main>
            <SiteFooter
              siteName={general.siteName}
              brandMark={general.brandMark}
              email={general.email}
              footer={settings.footer}
            />
          </div>
        </ThemeProvider>

        <HtmlInjection html={seo.customFooterHtml} className="cms-footer-injection" />
        {seo.footerScripts ? (
          <Script id="cms-footer-scripts" strategy="afterInteractive">
            {seo.footerScripts}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
