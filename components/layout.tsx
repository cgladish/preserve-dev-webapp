import Head from "next/head";
import Script from "next/script";
import { ReactNode } from "react";
import Header from "./header";

export const siteTitle = "Next.js Sample Website";

export default function Layout({
  children,
  title,
  withHeader,
  withAds,
}: {
  children: ReactNode | ReactNode[];
  title?: string;
  withAds?: boolean;
  withHeader?: boolean;
}) {
  return (
    <div style={{ paddingBottom: 30 }}>
      <Head>
        <title>{title ? `${title} - Preserve.dev` : "Preserve.dev"}</title>
        {withAds && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7658970265006187"
            crossOrigin="anonymous"
          />
        )}
      </Head>
      <main>
        {withHeader && <Header />}
        {children}
      </main>
    </div>
  );
}
