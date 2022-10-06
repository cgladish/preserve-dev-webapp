import { Apple, Download } from "@mui/icons-material";
import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout title="Preserve.dev" withHeader>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            whiteSpace: "nowrap",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" fontWeight={600} color="primary">
            Preserve&nbsp;
          </Typography>
          <Typography variant="h4" fontWeight={600}>
            your social media.
          </Typography>
        </div>
        <Typography
          variant="h6"
          style={{
            marginTop: 20,
            maxWidth: 500,
            textAlign: "justify",
            textJustify: "inter-word",
          }}
        >
          Preserve.dev provides a suite of tools to help you back up public and
          private social media messages. Never lose important messages to the
          electronic abyss again.
        </Typography>
        <Grid
          container
          style={{ width: "fit-content", marginTop: 20 }}
          spacing={4}
          columnSpacing={6}
        >
          <Grid
            item
            sm={6}
            xs={12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button variant="contained" size="large" style={{ width: 300 }}>
              Get the Desktop Client
            </Button>
            <div style={{ display: "flex", marginTop: 10 }}>
              <Typography variant="h6" style={{ marginRight: 10 }}>
                Available for
              </Typography>
              <img
                src="/app-logos/windows.svg"
                style={{ width: 30, height: 30, marginRight: 5 }}
                alt="windows"
              />
              <Apple style={{ width: 30, height: 30, marginRight: 5 }} />{" "}
              <img
                src="/app-logos/linux.svg"
                style={{ width: 30, height: 30 }}
                alt="linux"
              />
            </div>
          </Grid>
          <Grid
            item
            sm={6}
            xs={12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button variant="contained" size="large" style={{ width: 300 }}>
              Get the Browser Extension
            </Button>
            <div style={{ display: "flex", marginTop: 10 }}>
              <Typography variant="h6" style={{ marginRight: 10 }}>
                Available for
              </Typography>
              <img
                src="/app-logos/chrome.svg"
                style={{ width: 30, height: 30, marginRight: 5 }}
                alt="chrome"
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
}
