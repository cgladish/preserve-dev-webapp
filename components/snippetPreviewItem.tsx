import { Comment, MoreHoriz, Visibility } from "@mui/icons-material";
import { Card, List, ListItem, Skeleton, Typography } from "@mui/material";
import { forwardRef } from "react";
import { SnippetPreview } from "../utils/types";
import MessageItem from "./snippetMessageItem";

const LoadingSnippetPreviewMessage = () => (
  <ListItem
    style={{
      padding: "10px 5px",
      borderTop: "1px solid #666",
    }}
    disablePadding
  >
    <div style={{ display: "flex", width: "100%" }}>
      <Skeleton variant="circular" width={40} height={40} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: 10,
          width: "100%",
          maxWidth: "calc(100% - 60px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="rectangular" width={100} height={20} />
          <Skeleton
            variant="rectangular"
            width={150}
            height={20}
            style={{ marginLeft: 15 }}
          />
        </div>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={20}
          style={{ marginTop: 10 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={20}
          style={{ marginTop: 10 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={20}
          style={{ marginTop: 10 }}
        />
      </div>
    </div>
  </ListItem>
);

export const LoadingSnippetPreviewItem = forwardRef<HTMLDivElement>(
  (_, ref) => (
    <Card
      ref={ref}
      className="snippet-preview-item"
      style={{ width: 300, paddingBottom: 10, marginBottom: 30 }}
    >
      <List style={{ paddingBottom: 10, paddingTop: 0 }} dense>
        <LoadingSnippetPreviewMessage />
        <LoadingSnippetPreviewMessage />
        <LoadingSnippetPreviewMessage />
      </List>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
          borderTop: "1px solid #666",
          paddingTop: 10,
          paddingLeft: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: 70,
            height: 20,
          }}
        >
          <Skeleton variant="rectangular" height={20} width={50} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: 70,
            height: 20,
          }}
        >
          <Skeleton variant="rectangular" height={20} width={50} />
        </div>
      </div>
    </Card>
  )
);

const MAX_MESSAGE_LENGTH = 100;
export default function SnippetPreviewItem({
  snippet,
}: {
  snippet: SnippetPreview;
}) {
  const messagesToShow = snippet.messages.slice(
    Math.max(0, snippet.messages.length - 5)
  );
  const hiddenMessages = snippet.messages.length - messagesToShow.length;
  return (
    <a
      className="snippet-preview-item"
      href={`/p/${snippet.id}`}
      style={{ marginBottom: 30 }}
    >
      <Card style={{ width: 300, paddingBottom: 10 }}>
        {hiddenMessages > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingBottom: 10,
            }}
          >
            <MoreHoriz />
            <Typography fontSize="0.8rem">
              {hiddenMessages} more messages
            </Typography>
          </div>
        )}
        <List style={{ paddingBottom: 10, paddingTop: 0 }} dense>
          {messagesToShow.map((message) => (
            <MessageItem key={message.id} message={message} scale={0.8} />
          ))}
        </List>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid #A45EE5",
            paddingTop: 10,
          }}
        >
          {snippet.title && (
            <Typography
              style={{ marginBottom: 10, marginLeft: 10 }}
              fontSize="0.85rem"
            >
              {snippet.title}
            </Typography>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              paddingLeft: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: 70,
                height: 15,
              }}
            >
              <Visibility style={{ width: 15, height: 15, marginRight: 5 }} />
              <Typography fontSize="0.8rem">
                {snippet.interaction.views}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: 70,
                height: 15,
              }}
            >
              <Comment
                style={{ width: 15, height: 15, marginTop: 3, marginRight: 5 }}
              />
              <Typography fontSize="0.8rem">{snippet.totalComments}</Typography>
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}
