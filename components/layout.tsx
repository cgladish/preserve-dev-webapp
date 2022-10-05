import Head from "next/head";
import { ReactNode } from "react";
import Header from "./header";

export const siteTitle = "Next.js Sample Website";

export default function Layout({
  children,
  title,
  withHeader,
}: {
  children: ReactNode | ReactNode[];
  title: string;
  withHeader?: boolean;
}) {
  return (
    <div style={{ paddingBottom: 30 }}>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        {withHeader && <Header />}
        {children}
      </main>
    </div>
  );
}
