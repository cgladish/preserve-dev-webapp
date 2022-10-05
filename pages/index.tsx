import { Download } from "@mui/icons-material";
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
          spacing={3}
        >
          <Grid item sm={6} xs={12}>
            <Card style={{ width: 400, height: 300, padding: "10px 20px" }}>
              <Typography fontSize={16}>
                Back up messages to your computer using the desktop app.
                <br />
                <br />
                Pick the servers, channels, and DMs you care about and keep a
                copy safe regardless of what happens to the original messages.
              </Typography>
              <Button variant="contained" size="large">
                <Download />
                Download Desktop Client
              </Button>
            </Card>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Card style={{ width: 400, height: 300, padding: "10px 20px" }}>
              <Typography></Typography>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
}
