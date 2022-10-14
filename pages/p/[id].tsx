import Layout from "../../components/layout";
import { GetStaticPaths, GetStaticProps } from "next";
import { debounce } from "lodash";
import {
  Typography,
  List,
  ListItem,
  Card,
  Skeleton,
  TextField,
  useTheme,
} from "@mui/material";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { timeAgo } from "../../utils";
import { LoadingButton } from "@mui/lab";
import { useIsInViewport } from "../../hooks/useIsInViewport";
import { UserContext } from "../../components/userProvider";
import {
  CommentsPaginationInfo,
  Comment,
  Snippet,
  SnippetInteraction,
} from "../../utils/types";
import MessageItem from "../../components/snippetMessageItem";
import Link from "next/link";

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

  const [title, setTitle] = useState(snippet.title ?? "");
  const updateTitle = useCallback(
    debounce(async (title: string) => {
      await fetch(`/api/v1/snippets/${snippet.id}`, {
        method: "post",
        body: JSON.stringify({ title }),
      });
    }, 500),
    []
  );
  const onChangeTitle = (title: string) => {
    setTitle(title);
    updateTitle(title);
  };

  const {
    palette: { primary },
  } = useTheme();

  const { user, isLoading: isLoadingUser } = useContext(UserContext);
  useEffect(() => {
    if (!isLoadingUser && !snippet.claimed) {
      (async () => {
        await fetch(`/api/v1/snippets/${snippet.id}/claim`, { method: "post" });
      })();
    }
  }, [isLoadingUser]);

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

  const isEditableSnippet =
    !snippet.claimed ||
    (!snippet.public &&
      snippet.creator != null &&
      snippet.creator.id === user?.id);

  return (
    <Layout
      title={snippet.title ? `${snippet.title} - Preserve.dev` : "Preserve.dev"}
      withHeader
      withAds
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
        {isEditableSnippet ? (
          <TextField
            className="title-input"
            inputProps={{
              style: {
                fontWeight: 600,
                fontSize: "1.5rem",
                padding: 0,
                marginBottom: 10,
              },
            }}
            variant="outlined"
            value={title}
            onChange={(event) => onChangeTitle(event.target.value)}
            placeholder="Title your post..."
          />
        ) : (
          <Typography
            variant="h5"
            style={{ paddingBottom: 10, fontWeight: 600 }}
          >
            {title}
          </Typography>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 20,
          }}
        >
          <Typography fontSize={14}>
            {snippet.creator && (
              <>
                Uploaded by{" "}
                <Link href={`/u/${snippet.creator?.id}/snippets`}>
                  <a style={{ color: "#fff", textDecoration: "underline" }}>
                    @{snippet.creator?.displayName}
                  </a>
                </Link>
              </>
            )}
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
        <List dense>
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
  const snippetId = params?.id as string;
  const response = await fetch(
    `${process.env.APP_URL}/api/v1/snippets/${snippetId}?full=true`
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
