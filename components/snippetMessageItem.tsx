import { Attachment, Download } from "@mui/icons-material";
import { Typography, Modal, ListItem, Avatar, Skeleton } from "@mui/material";
import { format } from "date-fns";
import filesize from "filesize";
import { partition } from "lodash";
import { useState } from "react";
import { DiscordAppSpecificData, Message } from "../utils/types";

const DiscordAttachmentsAndEmbeds = ({
  appSpecificData,
  scale = 1,
}: {
  appSpecificData: DiscordAppSpecificData;
  scale?: number;
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
            <Typography
              className="message-view-original"
              color="text.secondary"
              style={{
                fontSize: `${0.75 * scale}rem`,
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
                borderRadius: 4 * scale,
                maxHeight: 300 * scale,
                maxWidth: 300 * scale,
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

export default function MessageItem({
  message,
  scale = 1,
}: {
  message: Message;
  scale?: number;
}) {
  const appSpecificData =
    message.appSpecificDataJson && JSON.parse(message.appSpecificDataJson);

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
            style={{
              fontSize: `${1.0 * scale}rem`,
              marginTop: `${2 * scale}px`,
              wordWrap: "break-word",
            }}
          >
            {message.content}
          </Typography>
          <DiscordAttachmentsAndEmbeds
            appSpecificData={appSpecificData}
            scale={scale}
          />
        </div>
      </div>
    </ListItem>
  );
}
