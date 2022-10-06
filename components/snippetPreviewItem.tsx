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
    <div
      style={{ display: "flex", width: "100%" }}
      style={{ marginBottom: 30 }}
    >
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

export const LoadingSnippetPreviewItem = forwardRef<HTMLLIElement>((_, ref) => (
  <Card style={{ width: 300, paddingBottom: 10 }}>
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
));

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
    <a href={`/p/${snippet.id}`} style={{ marginBottom: 30 }}>
      <Card style={{ width: 300, paddingBottom: 10 }}>
        {hiddenMessages > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0",
            }}
          >
            <Typography fontSize="0.8rem">
              {hiddenMessages} more messages
            </Typography>
          </div>
        )}
        <List style={{ paddingBottom: 10, paddingTop: 0 }} dense>
          {messagesToShow.map((message) => (
            <MessageItem message={message} scale={0.8} />
          ))}
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
      </Card>
    </a>
  );
}
