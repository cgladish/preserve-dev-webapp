import {
  Attachment as AttachmentIcon,
  Download,
  Link as LinkIcon,
} from "@mui/icons-material";
import { Typography, Modal, ListItem, Avatar } from "@mui/material";
import { format } from "date-fns";
import filesize from "filesize";
import { partition } from "lodash";
import Link from "next/link";
import { memo, useState } from "react";
import { Attachment, Message } from "../utils/types";
import ConditionalWrapper from "./conditionalWrapper";

const PREVIEW_SCALE = 0.8;

const Attachments = ({
  attachments,
  isPreview = false,
}: {
  attachments: Attachment[];
  isPreview?: boolean;
}) => {
  const scale = isPreview ? PREVIEW_SCALE : 1.0;

  const [imageAttachments, nonImageAttachments] = partition(
    attachments,
    ({ type }) => ["photo", "image"].includes(type)
  );

  const [viewedImage, setViewedImage] = useState<{
    url: string;
    filename: string | null;
  } | null>(null);

  return (
    <>
      {imageAttachments?.map(({ filename, url, width, height }, index) => {
        if (!url) {
          return null;
        }
        const widthHeightRatio = width && height && width / height;
        let widthToUse: number | undefined;
        let heightToUse: number | undefined;
        if (widthHeightRatio) {
          if (widthHeightRatio > 1) {
            widthToUse = Math.min(width, 300 * scale);
            heightToUse = widthToUse / widthHeightRatio;
          } else {
            heightToUse = Math.min(height, 300 * scale);
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
            {!isPreview && (
              <ConditionalWrapper
                condition={!isPreview}
                wrapper={({ children }) => (
                  <Link href={url}>
                    <a target="_blank">{children}</a>
                  </Link>
                )}
              >
                <Typography
                  className="message-view-original"
                  color="text.secondary"
                  style={{
                    fontSize: `${0.75 * scale}rem`,
                    width: "fit-content",
                  }}
                >
                  View Original
                </Typography>
              </ConditionalWrapper>
            )}
            <img
              src={url}
              alt={filename ?? url}
              style={{
                borderRadius: 4 * scale,
                maxHeight: 300 * scale,
                maxWidth: 300 * scale,
                height: heightToUse ?? "auto",
                width: widthToUse ?? "auto",
                cursor: "pointer",
              }}
              onClick={
                isPreview
                  ? undefined
                  : (event) => {
                      event.stopPropagation();
                      setViewedImage({ url, filename });
                    }
              }
            />
          </div>
        );
      })}
      {viewedImage && (
        <Modal onClose={() => setViewedImage(null)} open>
          <img
            src={viewedImage.url}
            alt={viewedImage.filename || viewedImage.url}
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
      {nonImageAttachments?.map(({ filename, url, type, size }, index) => {
        if (!url) {
          return;
        }
        return (
          <ConditionalWrapper
            condition={!isPreview}
            wrapper={({ children }) => (
              <Link href={url}>
                <a target="_blank">{children}</a>
              </Link>
            )}
          >
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
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <AttachmentIcon />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: 5,
                  }}
                >
                  <Typography
                    style={{
                      fontSize: `${1.0 * scale}rem`,
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
                    style={{ fontSize: `${0.875 * scale}rem` }}
                  >
                    {type}
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
                  {size && filesize(size)}
                </Typography>
                <Download />
              </div>
            </div>
          </ConditionalWrapper>
        );
      })}
    </>
  );
};

const MessageItem = memo(
  ({
    appName,
    message,
    isPreview = false,
  }: {
    appName?: string;
    message: Message;
    isPreview?: boolean;
  }) => {
    const scale = isPreview ? PREVIEW_SCALE : 1.0;
    const authorUrl = (() => {
      switch (appName) {
        case "Twitter":
          return `https://www.twitter.com/${message.authorUsername}`;
        default:
          return null;
      }
    })();
    const messageUrl = (() => {
      switch (appName) {
        case "Twitter":
          return (
            message.externalId && `${authorUrl}/status/${message.externalId}`
          );
        default:
          return null;
      }
    })();
    return (
      <ListItem
        className="snippet-message-item"
        style={{
          paddingTop: 10 * scale,
          paddingBottom: 10 * scale,
          paddingRight: 5 * scale,
          paddingLeft: 5 * scale,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid #666",
        }}
        disablePadding
      >
        <div style={{ display: "flex", width: "100%" }}>
          <ConditionalWrapper
            condition={authorUrl}
            wrapper={({ children, condition: href }) => (
              <Link href={href}>
                <a target="_blank">{children}</a>
              </Link>
            )}
          >
            <Avatar
              style={{ width: 40 * scale, height: 40 * scale }}
              src={message.authorAvatarUrl ?? undefined}
            />
          </ConditionalWrapper>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 10 * scale,
              width: "100%",
              maxWidth: `calc(100% - ${60 * scale}px)`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  style={{ fontSize: `${1.0 * scale}rem`, fontWeight: "500" }}
                >
                  <ConditionalWrapper
                    condition={authorUrl}
                    wrapper={({ children, condition: href }) => (
                      <Link href={href}>
                        <a target="_blank">{children}</a>
                      </Link>
                    )}
                  >
                    <>
                      {message.authorUsername}
                      {message.authorIdentifier
                        ? ` #${message.authorIdentifier}`
                        : ""}
                    </>
                  </ConditionalWrapper>
                </Typography>
                {messageUrl && (
                  <Link href={messageUrl}>
                    <a
                      className="snippet-external-link"
                      target="_blank"
                      style={{ marginLeft: 5, color: "#aaa" }}
                    >
                      <LinkIcon fontSize="small" />
                    </a>
                  </Link>
                )}
              </div>
              <Typography
                color="text.secondary"
                style={{ fontSize: `${0.75 * scale}rem` }}
              >
                {format(new Date(message.sentAt), "P")} at{" "}
                {format(new Date(message.sentAt), "p")}
              </Typography>
            </div>
            <Typography
              className="message-content"
              style={{
                fontSize: `${1.0 * scale}rem`,
                marginTop: `${2 * scale}px`,
                wordWrap: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {message.content}
            </Typography>
            <Attachments
              attachments={message.attachments}
              isPreview={isPreview}
            />
          </div>
        </div>
      </ListItem>
    );
  }
);

export default MessageItem;
