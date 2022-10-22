import { Masonry } from "@mui/lab";
import { useRef, useState, useEffect } from "react";
import { useIsInViewport } from "../hooks/useIsInViewport";
import { SnippetPreviewsPaginationInfo } from "../utils/types";
import queryString from "query-string";
import SnippetPreviewItem, {
  LoadingSnippetPreviewItem,
} from "./snippetPreviewItem";
import { Typography } from "@mui/material";

export default function SnippetsPreview({
  title,
  initialSnippets,
  creatorId,
}: {
  title: string;
  initialSnippets?: SnippetPreviewsPaginationInfo;
  creatorId?: string;
}) {
  const snippetsBottomRef = useRef<HTMLDivElement>(null);
  const [isFetchingSnippets, setIsFetchingSnippets] = useState<boolean>();
  const [snippets, setSnippets] =
    useState<SnippetPreviewsPaginationInfo | null>(initialSnippets ?? null);
  const isSnippetsBottomRefInViewport = useIsInViewport(snippetsBottomRef);
  useEffect(() => {
    (async () => {
      if (
        !snippets ||
        (isSnippetsBottomRefInViewport &&
          !isFetchingSnippets &&
          !snippets?.isLastPage)
      ) {
        setIsFetchingSnippets(true);
        try {
          const response = await fetch(
            `/api/v1/snippets/preview?${queryString.stringify({
              cursor: snippets?.data[snippets.data.length - 1]?.id,
              creatorId,
            })}`
          );
          if (response.status !== 200) {
            throw new Error(response.statusText);
          }
          const fetchedSnippets: SnippetPreviewsPaginationInfo =
            await response.json();
          setSnippets({
            data: [...(snippets?.data ?? []), ...fetchedSnippets.data],
            isLastPage: fetchedSnippets.isLastPage,
          });
        } catch (err) {
          console.error(err);
        }
        setIsFetchingSnippets(false);
      }
    })();
  }, [isSnippetsBottomRefInViewport]);

  return (
    <div
      className="recent-snippets"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: 40,
      }}
    >
      <Typography variant="h6" style={{ marginBottom: 20 }}>
        {title}
      </Typography>
      {snippets && !snippets?.data.length && "Nothing to see here."}
      <Masonry columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} spacing={0}>
        {(snippets?.data ?? []).map((snippet) => (
          <SnippetPreviewItem key={snippet.id} snippet={snippet} />
        ))}
        {!snippets?.isLastPage && (
          <>
            <LoadingSnippetPreviewItem ref={snippetsBottomRef} />
            <LoadingSnippetPreviewItem />
            <LoadingSnippetPreviewItem />
            <LoadingSnippetPreviewItem />
            <LoadingSnippetPreviewItem />
            <LoadingSnippetPreviewItem />
            <LoadingSnippetPreviewItem />
            <LoadingSnippetPreviewItem />
            <LoadingSnippetPreviewItem />
            <LoadingSnippetPreviewItem />
            <LoadingSnippetPreviewItem />
            <LoadingSnippetPreviewItem />
          </>
        )}
      </Masonry>
    </div>
  );
}
