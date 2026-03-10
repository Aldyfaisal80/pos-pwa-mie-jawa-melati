import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { Footer, HeadMetaData, Header } from "../elements";

type PageContainerProps = {
  withHeader?: boolean;
  withFooter?: boolean;
  // HeadMetaData props
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
};

export const PageContainer = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & PageContainerProps
>(
  (
    {
      children,
      className,
      withHeader = false,
      withFooter = false,
      // HeadMetaData props
      title,
      metaDescription,
      ogImageUrl,
      pathname,
      keywords,
      author,
      canonicalUrl,
      noindex,
      ogType,
      twitterCard,
      locale,
      siteName,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("h-full w-full")}>
        <HeadMetaData
          title={title}
          metaDescription={metaDescription}
          ogImageUrl={ogImageUrl}
          pathname={pathname}
          keywords={keywords}
          author={author}
          canonicalUrl={canonicalUrl}
          noindex={noindex}
          ogType={ogType}
          twitterCard={twitterCard}
          locale={locale}
          siteName={siteName}
        />
        {withHeader && <Header />}
        <main ref={ref} className={cn("flex flex-col", className)} {...props}>
          {children}
        </main>
        {withFooter && <Footer />}
      </div>
    );
  },
);

PageContainer.displayName = "PageContainer";
