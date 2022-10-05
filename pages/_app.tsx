import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "./_app.css";
import { AppProps } from "next/app";
import createCache from "@emotion/cache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { UserProvider as Auth0UserProvider } from "@auth0/nextjs-auth0";
import UserProvider from "../components/userProvider";

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
          background: "rgba(20, 20, 20, 1.0)",
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

export type Props = AppProps & {
  emotionCache: EmotionCache;
};
export default function App({
  Component,
  emotionCache = createCache({ key: "css", prepend: true }),
  pageProps: { ...pageProps },
}: Props) {
  return (
    <Auth0UserProvider>
      <UserProvider>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </UserProvider>
    </Auth0UserProvider>
  );
}
