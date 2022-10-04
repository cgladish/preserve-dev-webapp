import Layout from "../../components/layout";
import { GetStaticPaths, GetStaticProps } from "next";
import { Typography, List, Avatar, ListItem, Modal, Card } from "@mui/material";
import { format } from "date-fns";
import { partition } from "lodash";
import { Attachment, Download, Visibility } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import filesize from "filesize";
import { timeAgo } from "../../utils";

type DiscordAppSpecificData = {
  attachments?: {
    id: string;
    filename: string;
    description?: string;
    content_type?: string;
    size: number;
    url: string;
    height?: number;
    width?: number;
    ephemeral?: boolean;
  }[];
  embeds?: {
    title?: string;
    type?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    footer?: {
      text: string;
      icon_url?: string;
    };
    image?: {
      url: string;
      height?: number;
      width?: number;
    };
    thumbnail?: {
      url: string;
      height?: number;
      width?: number;
    };
    video?: {
      url: string;
      height?: number;
      width?: number;
    };
    provider?: {
      name?: string;
      url?: string;
    };
    author?: {
      name: string;
      url?: string;
      icon_url?: string;
    };
    fields?: {
      name: string;
      value: string;
      inline?: boolean;
    }[];
  }[];
};

type App = { id: string; name: string };
type Message = {
  id: string;
  content: string;
  sentAt: string;
  appSpecificDataJson: string | null;
  authorUsername: string;
  authorIdentifier: string | null;
  authorAvatarUrl: string | null;
};
type Snippet = {
  id: string;
  public: boolean;
  title: string | null;
  appSpecificDataJson: string | null;
  views: number;
  creatorId: string;
  app: App;
  messages: Message[];
  createdAt: string;
};

const DiscordAttachmentsAndEmbeds = ({
  appSpecificData,
}: {
  appSpecificData: DiscordAppSpecificData;
}) => {
  const [imageAttachments, nonImageAttachments] = appSpecificData?.attachments
    ? partition(appSpecificData.attachments, ({ content_type }) =>
        content_type?.includes("image")
      )
    : [];

  const [viewedImage, setViewedImage] = useState<{
    url: string;
    filename: string;
  } | null>(null);

  return (
    <>
      {imageAttachments?.map(({ filename, url, width, height }, index) => {
        const widthHeightRatio = width && height && width / height;
        let widthToUse: number | undefined;
        let heightToUse: number | undefined;
        if (widthHeightRatio) {
          if (widthHeightRatio > 1) {
            widthToUse = Math.min(width, 300);
            heightToUse = widthToUse / widthHeightRatio;
          } else {
            heightToUse = Math.min(height, 300);
            widthToUse = heightToUse * widthHeightRatio;
          }
        }
        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography
              className="message-view-original"
              color="text.secondary"
              style={{
                fontSize: "0.75rem",
                cursor: "pointer",
                width: "fit-content",
              }}
              onClick={(event) => {
                event.stopPropagation();
                window.open(url, "_blank");
              }}
            >
              View Original
            </Typography>
            <img
              src={url}
              alt={filename}
              style={{
                borderRadius: 4,
                maxHeight: 300,
                maxWidth: 300,
                height: heightToUse ?? "auto",
                width: widthToUse ?? "auto",
                cursor: "pointer",
              }}
              onClick={(event) => {
                event.stopPropagation();
                setViewedImage({ url, filename });
              }}
            />
          </div>
        );
      })}
      {viewedImage && (
        <Modal onClose={() => setViewedImage(null)} open>
          <img
            src={viewedImage.url}
            alt={viewedImage.filename}
            style={{
              maxWidth: 800,
              maxHeight: 600,
              height: "auto",
              width: "auto",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </Modal>
      )}
      {nonImageAttachments?.map(
        ({ filename, url, content_type, size }, index) => (
          <div
            key={index}
            style={{
              background: "#111",
              height: 55,
              display: "flex",
              alignItems: "center",
              margin: "5px 0 5px 0",
              borderRadius: 4,
              border: "1px solid #666",
              cursor: "pointer",
              padding: "0 10px",
              width: 400,
              justifyContent: "space-between",
            }}
            onClick={(event) => {
              event.stopPropagation();
              window.open(url, "_blank");
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Attachment />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: 5,
                }}
              >
                <Typography
                  style={{
                    width: 250,
                    justifyContent: "space-between",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {filename}
                </Typography>
                <Typography
                  color="text.secondary"
                  style={{ fontSize: ".875rem" }}
                >
                  {content_type}
                </Typography>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                color="text.secondary"
                style={{ fontSize: ".875rem", whiteSpace: "nowrap" }}
              >
                {filesize(size)}
              </Typography>
              <Download />
            </div>
          </div>
        )
      )}
      {appSpecificData?.embeds?.map((embed) => "EMBED")}
    </>
  );
};

const MessageItem = ({ message }: { message: Message }) => {
  const appSpecificData =
    message.appSpecificDataJson && JSON.parse(message.appSpecificDataJson);

  return (
    <ListItem
      style={{
        padding: "10px 5px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
      disablePadding
    >
      <div style={{ display: "flex", width: "100%" }}>
        <Avatar src={message.authorAvatarUrl ?? undefined} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 10,
            width: "100%",
            maxWidth: "calc(100% - 60px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontWeight: "500" }}>
              {message.authorUsername}
              {message.authorIdentifier ? ` #${message.authorIdentifier}` : ""}
            </Typography>
            <Typography color="text.secondary" style={{ fontSize: ".75rem" }}>
              {format(new Date(message.sentAt), "P")} at{" "}
              {format(new Date(message.sentAt), "p")}
            </Typography>
          </div>
          <Typography style={{ marginTop: "2px" }}>
            {message.content}
          </Typography>
          <DiscordAttachmentsAndEmbeds appSpecificData={appSpecificData} />
        </div>
      </div>
    </ListItem>
  );
};

export default function Preservette({ snippet }: { snippet: Snippet }) {
  const messagesRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, []);
  return (
    <Layout
      title={snippet.title ? `${snippet.title} - Preserve.dev` : "Preserve.dev"}
      withHeader
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: 100,
          marginTop: 30,
          width: 850,
        }}
      >
        <Typography variant="h5" style={{ paddingBottom: 10, fontWeight: 600 }}>
          {snippet.title}
        </Typography>
        <Card
          style={{
            display: "flex",
            wordWrap: "break-word",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "100%",
            minWidth: 850,
            height: 500,
            position: "relative",
          }}
        >
          <List
            ref={messagesRef}
            style={{
              overflowY: "scroll",
              maxHeight: 500,
              width: "100%",
              padding: 0,
            }}
            dense
          >
            {snippet.messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </List>
        </Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#aaa",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Visibility style={{ width: 20, height: 20, marginRight: 5 }} />
            <Typography fontSize={14}>{snippet.views} Views</Typography>
          </div>
          <Typography fontSize={14}>
            Posted {timeAgo.format(new Date(snippet.createdAt))}
          </Typography>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(
    `${process.env.APP_URL}/api/v1/snippets/${params?.id as string}`
  );
  const snippet = await response.json();
  return {
    props: {
      snippet,
    },
  };
};
