import Layout from "../../components/layout";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  Typography,
  List,
  Avatar,
  ListItem,
  Modal,
  Card,
  Skeleton,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import { partition } from "lodash";
import { Attachment, Download, Send } from "@mui/icons-material";
import {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import filesize from "filesize";
import { timeAgo } from "../../utils";
import { LoadingButton } from "@mui/lab";
import { useIsInViewport } from "../../hooks/useIsInViewport";
import { UserContext } from "../../components/userProvider";

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

type User = {
  id: string;
  username: string;
  displayName: string;
  createdAt: Date;
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
  creator: User | null;
  app: App;
  messages: Message[];
  createdAt: string;
};
type SnippetInteraction = {
  id: string;
  snippetId: string;
  views: number;
  messages: Message[];
  createdAt: string;
};
type Comment = {
  id: string;
  content: string;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
  savedNow?: boolean;
};
type CommentsPaginationInfo = {
  data: Comment[];
  totalCount: number;
  isLastPage: boolean;
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
        borderTop: "1px solid #666",
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

const LoadingCommentItem = forwardRef<HTMLLIElement>((_, ref) => (
  <ListItem
    ref={ref}
    style={{
      display: "flex",
      flexDirection: "column",
      borderTop: "1px solid #666",
      alignItems: "flex-start",
      padding: "5px 5px 15px 5px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        color: "#aaa",
        width: "100%",
        height: 30,
      }}
    >
      <Skeleton height="100%" width={70} />
      <Skeleton style={{ marginLeft: 20 }} height="100%" width={150} />
    </div>
    <Skeleton height="40" width="100%" />
    <Skeleton height="40" width="100%" />
  </ListItem>
));

const MAX_COMMENT_LENGTH = 2000;
export default function Preservette({ snippet }: { snippet: Snippet }) {
  const [interaction, setInteraction] = useState<SnippetInteraction | null>(
    null
  );

  const { user } = useContext(UserContext);

  const messagesRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
    (async () => {
      const interactionUrl = `/api/v1/snippets/${snippet.id}/interaction`;
      const response = await fetch(interactionUrl);
      const fetchedInteraction = await response.json();
      setInteraction(fetchedInteraction);
      await fetch(`${interactionUrl}/views`, { method: "post" }); // Update view count
    })();
  }, []);

  const commentsBottomRef = useRef<HTMLLIElement>(null);
  const [isFetchingComments, setIsFetchingComments] = useState<boolean>();
  const [comments, setComments] = useState<CommentsPaginationInfo | null>(null);
  const isCommentsBottomRefInViewport = useIsInViewport(commentsBottomRef);
  useEffect(() => {
    (async () => {
      if (
        !comments ||
        (isCommentsBottomRefInViewport &&
          !isFetchingComments &&
          !comments?.isLastPage)
      ) {
        setIsFetchingComments(true);
        try {
          const response = await fetch(
            `/api/v1/snippets/${snippet.id}/comments${
              comments
                ? `?cursor=${comments.data[comments.data.length - 1]?.id}`
                : ""
            }`
          );
          if (response.status !== 200) {
            throw new Error(response.statusText);
          }
          const fetchedComments: CommentsPaginationInfo = await response.json();
          setComments({
            data: [...(comments?.data ?? []), ...fetchedComments.data],
            totalCount: comments?.totalCount ?? fetchedComments.totalCount,
            isLastPage: fetchedComments.isLastPage,
          });
        } catch (err) {
          console.error(err);
        }
        setIsFetchingComments(false);
      }
    })();
  }, [isCommentsBottomRefInViewport]);

  const [savedComments, setSavedComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [isSavingComment, setIsSavingComment] = useState<boolean>(false);
  const isCommentSubmitDisabled =
    commentText.length < 1 || commentText.length > MAX_COMMENT_LENGTH;
  const onCommentSubmit = async () => {
    if (isCommentSubmitDisabled) {
      return;
    }
    setIsSavingComment(true);
    try {
      const response = await fetch(`/api/v1/snippets/${snippet.id}/comments`, {
        method: "post",
        body: JSON.stringify({ content: commentText }),
      });
      if (response.status !== 201) {
        throw new Error(response.statusText);
      }
      setCommentText("");
      const savedComment = await response.json();
      setSavedComments([{ ...savedComment, savedNow: true }, ...savedComments]);
    } catch (err) {
      console.error(err);
    }
    setIsSavingComment(false);
  };

  const commentsFilterSavedComments = useMemo(
    () =>
      comments?.data.filter(
        (comment) =>
          !savedComments.some((savedComment) => comment.id === savedComment.id)
      ) ?? [],
    [savedComments, comments]
  );

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
          minWidth: 850,
          maxWidth: 850,
          wordWrap: "break-word",
        }}
      >
        <Typography variant="h5" style={{ paddingBottom: 10, fontWeight: 600 }}>
          {snippet.title}
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 20,
          }}
        >
          <Typography fontSize={14}>
            Uploaded by @{snippet.creator?.displayName}
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#aaa",
              width: "100%",
              height: 30,
            }}
          >
            {interaction ? (
              <>
                <Typography fontSize={12}>{interaction.views} Views</Typography>
                <Typography
                  fontSize={12}
                  style={{ marginLeft: 5, marginRight: 5 }}
                >
                  •
                </Typography>
                <Typography fontSize={12}>
                  Posted {timeAgo.format(new Date(snippet.createdAt))}
                </Typography>
              </>
            ) : (
              <Skeleton style={{ width: 150 }} />
            )}
          </div>
        </div>
        <Card
          style={{
            display: "flex",
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
        <form
          style={{ marginTop: 150, background: "#222", borderRadius: 4 }}
          onSubmit={(event) => {
            event.preventDefault();
            onCommentSubmit();
          }}
        >
          <TextField
            style={{ width: "100%" }}
            InputProps={{ style: { paddingTop: 10 } }}
            placeholder="Add a comment"
            variant="filled"
            multiline
            minRows={3}
            maxRows={3}
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 50,
              borderRadius: "0 0 4px 4px",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 70,
                justifyContent: "end",
                marginRight: 10,
              }}
            >
              <Typography
                fontSize={14}
                color={
                  commentText.length > MAX_COMMENT_LENGTH ? "error" : undefined
                }
              >
                {commentText.length}/{MAX_COMMENT_LENGTH}
              </Typography>
            </div>
            <LoadingButton
              disabled={isCommentSubmitDisabled}
              loading={isSavingComment}
              type="submit"
              variant="contained"
              size="small"
              style={{ marginRight: 10 }}
            >
              Save
            </LoadingButton>
          </div>
        </form>
        <div style={{ height: 35, marginTop: 40 }}>
          {comments ? (
            <Typography
              variant="h6"
              fontWeight={500}
              style={{
                color: "#ccc",
              }}
            >
              {comments.totalCount + savedComments.length} Comments
            </Typography>
          ) : (
            <Skeleton height="100%" width={200} />
          )}
        </div>
        {!comments?.data.length && comments?.isLastPage && (
          <Typography style={{ borderTop: "1px solid #666", paddingTop: 20 }}>
            There is nothing to see here.
          </Typography>
        )}
        <List ref={messagesRef} dense>
          {[...savedComments, ...commentsFilterSavedComments].map((comment) => (
            <ListItem
              key={comment.id}
              style={{
                display: "flex",
                flexDirection: "column",
                borderTop: "1px solid #666",
                alignItems: "flex-start",
                padding: "5px 5px 15px 5px",
                background: comment.savedNow ? "#222" : "unset",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#aaa",
                  width: "100%",
                  height: 30,
                }}
              >
                <Typography
                  fontSize={12}
                  color={
                    comment.creator.id === user?.id ? "primary" : undefined
                  }
                >
                  @{comment.creator.displayName}
                </Typography>
                <Typography
                  fontSize={12}
                  style={{ marginLeft: 5, marginRight: 5 }}
                >
                  •
                </Typography>
                <Typography fontSize={12}>
                  Posted {timeAgo.format(new Date(comment.createdAt))}
                </Typography>
              </div>
              <Typography
                style={{
                  wordWrap: "break-word",
                  display: "inline-block",
                  maxWidth: "850px",
                }}
              >
                {comment.content}
              </Typography>
            </ListItem>
          ))}
        </List>
        {!comments?.isLastPage && (
          <>
            <LoadingCommentItem ref={commentsBottomRef} />
            <LoadingCommentItem />
            <LoadingCommentItem />
            <LoadingCommentItem />
          </>
        )}
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
  if (response.status === 404) {
    return { notFound: true };
  } else if (response.status !== 200) {
    throw new Error(response.statusText);
  }
  const snippet = await response.json();
  return {
    props: {
      snippet,
    },
  };
};
