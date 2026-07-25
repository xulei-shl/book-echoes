import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";

type FontVarStyle = CSSProperties & Record<string, string>;

export const metadata: Metadata = {
  title: "书海回响",
  description: "基于上海图书馆借阅数据的书目推荐项目",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontHost = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
  const fontVars: FontVarStyle = {};

  if (fontHost) {
    fontVars["--font-shangtu-src"] = `url('${fontHost}/fonts/shangtu-dongguan.woff2') format('woff2')`;
    fontVars["--font-youyou-src"] = `url('${fontHost}/fonts/youyou-yisong.woff2') format('woff2')`;
    fontVars["--font-runzhijia-src"] = `url('${fontHost}/fonts/runzhijia-ruyin.woff2') format('woff2')`;
    fontVars["--font-huiwen-src"] = `url('${fontHost}/fonts/huiwen-mingchao.woff2') format('woff2')`;
  }

  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="antialiased" suppressHydrationWarning style={fontVars}>
        {children}
      </body>
    </html>
  );
}
