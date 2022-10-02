import { SessionProvider } from "next-auth/react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import type { Session } from "next-auth";
import "./_app.css";
import { AppProps } from "next/app";
import createCache from "@emotion/cache";
import { CacheProvider, EmotionCache } from "@emotion/react";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#A45EE5",
      dark: "#52168b",
    },
    text: {
      primary: "#eee",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 90.2%);",
        },
        "&::-webkit-scrollbar": {
          width: 10,
        },
        "&::-webkit-scrollbar-track": {
          boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#A45EE5",
          borderRadius: 6,
        },
      },
    },
  },
});

export type Props = AppProps<{ session: Session }> & {
  emotionCache: EmotionCache;
};
export default function App({
  Component,
  emotionCache = createCache({ key: "css", prepend: true }),
  pageProps: { session, ...pageProps },
}: Props) {
  return (
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
}
