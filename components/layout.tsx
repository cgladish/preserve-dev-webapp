import Head from "next/head";
import { ReactNode } from "react";

export const siteTitle = "Next.js Sample Website";

export default function Layout({
  children,
  title,
}: {
  children: ReactNode | ReactNode[];
  title: string;
}) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <title>{title}</title>
      </Head>
      <main>{children}</main>
    </div>
  );
}
