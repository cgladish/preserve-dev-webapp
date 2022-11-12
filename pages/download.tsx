import { Button, Grid, Typography } from "@mui/material";
import {
  Download as DownloadIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/layout";

const Download: NextPage = () => {
  return (
    <Layout title="Download" withHeader>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 60,
          paddingRight: 40,
          paddingLeft: 40,
        }}
      >
        <Grid container spacing={6} style={{ maxWidth: 1200 }}>
          <Grid id="desktop" item xs={12} md={6}>
            <Typography
              variant="h4"
              fontWeight={700}
              style={{ marginBottom: 10 }}
            >
              Get the Desktop Client
            </Typography>
            <Typography fontSize="1.2rem" style={{ marginBottom: 20 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </Typography>
            <Link href="https://download.preserve.dev/download">
              <a target="_blank" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<DownloadIcon />}
                >
                  Download
                </Button>
              </a>
            </Link>
            <Typography style={{ marginTop: 20 }}>
              Download for a specific platform:{" "}
              <Link href="https://download.preserve.dev/download/exe">
                <a target="_blank">Windows</a>
              </Link>
              ,{" "}
              <Link href="https://download.preserve.dev/download/dmg">
                <a target="_blank">MacOS</a>
              </Link>
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img src="/download/desktop.png" width={"100%"} />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={6}
          style={{ maxWidth: 1200, marginTop: 60 }}
          direction="row-reverse"
        >
          <Grid id="extension" item xs={12} md={6}>
            <Typography
              variant="h4"
              fontWeight={700}
              style={{ marginBottom: 10 }}
            >
              Get the Browser Extension
            </Typography>
            <Typography fontSize="1.2rem" style={{ marginBottom: 20 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </Typography>
            <Link href="">
              <a target="_blank" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<OpenInNewIcon />}
                >
                  Chrome Web Store
                </Button>
              </a>
            </Link>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img src="/download/extension.png" width={"100%"} />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Download;
