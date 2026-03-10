import React from "react";
import Head from "next/head";
import { env } from "@/env.js";

export const HeadMetaData: React.FC<{
  title?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  pathname?: string;
  keywords?: string;
  author?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  ogType?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  locale?: string;
  siteName?: string;
}> = ({
  title = "",
  metaDescription,
  ogImageUrl = "env.NEXT_PUBLIC_OG_IMAGE_URL", // not string need to be import from env
  pathname = "",
  keywords,
  author,
  canonicalUrl,
  noindex = false,
  ogType = "website",
  twitterCard = "summary_large_image",
  locale = "id_ID",
  siteName = env.NEXT_PUBLIC_APP_NAME ?? "APP",
}) => {
  const defaultTitle = env.NEXT_PUBLIC_APP_NAME ?? "APP";
  const defaultTitleContent = title
    ? title + " || " + defaultTitle
    : defaultTitle;

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : env.NEXT_PUBLIC_BASE_URL;

  const pageUrl = new URL(pathname, baseUrl).toString();
  const finalCanonicalUrl = canonicalUrl ?? pageUrl;

  return (
    <Head>
      <title>{defaultTitleContent}</title>
      <link rel="icon" href="/avnexeed.ico" />
      <link rel="canonical" href={finalCanonicalUrl} />

      {/* Basic Meta Tags */}
      <meta name="title" content={defaultTitleContent} />
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Indonesian" />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}
      <meta name="googlebot" content="index, follow" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={defaultTitleContent} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:alt" content={defaultTitleContent} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={defaultTitleContent} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={defaultTitleContent} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={defaultTitle} />
      <meta name="format-detection" content="telephone=no" />

      {/* Favicon and Apple Touch Icons */}
      {/* <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" /> */}
    </Head>
  );
};
