import { Attachment as AttachmentIcon, Download } from "@mui/icons-material";
import { Typography, Modal, ListItem, Avatar } from "@mui/material";
import { format } from "date-fns";
import filesize from "filesize";
import { partition } from "lodash";
import { useState } from "react";
import { Attachment, Message } from "../utils/types";

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
              <Typography
                className="message-view-original"
                color="text.secondary"
                style={{
                  fontSize: `${0.75 * scale}rem`,
                  cursor: "pointer",
                  width: "fit-content",
                }}
                onClick={
                  isPreview
                    ? undefined
                    : (event) => {
                        event.stopPropagation();
                        window.open(url, "_blank");
                      }
                }
              >
                View Original
              </Typography>
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
            onClick={
              isPreview
                ? undefined
                : (event) => {
                    event.stopPropagation();
                    window.open(url, "_blank");
                  }
            }
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
        );
      })}
    </>
  );
};

export default function MessageItem({
  message,
  isPreview = false,
}: {
  message: Message;
  isPreview?: boolean;
}) {
  const scale = isPreview ? PREVIEW_SCALE : 1.0;
  return (
    <ListItem
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
        <Avatar
          style={{ width: 40 * scale, height: 40 * scale }}
          src={message.authorAvatarUrl ?? undefined}
        />
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
            <Typography
              style={{ fontSize: `${1.0 * scale}rem`, fontWeight: "500" }}
            >
              {message.authorUsername}
              {message.authorIdentifier ? ` #${message.authorIdentifier}` : ""}
            </Typography>
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
