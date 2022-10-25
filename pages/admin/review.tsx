import { NextPage } from "next";
import Layout from "../../components/layout";
import {
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Check, Clear } from "@mui/icons-material";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { SnippetPreviewsPaginationInfo } from "../../utils/types";
import Link from "next/link";

const AdminReview: NextPage = () => {
  const { user: auth0User, isLoading: isLoadingAuth0User } = useUser();
  if (isLoadingAuth0User) {
    return null;
  }
  if (!auth0User?.["https://auth.preserve.dev/isAdmin"]) {
    throw new Error("You are not authorized");
  }

  const [snippets, setSnippets] =
    useState<SnippetPreviewsPaginationInfo | null>(null);
  const fetchSnippets = async () => {
    try {
      const response = await fetch("/api/v1/snippets/unreviewed");
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      const fetched = await response.json();
      setSnippets(fetched);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchSnippets();
  }, []);
  useEffect(() => {
    if (snippets && !snippets.data.length && !snippets.isLastPage) {
      fetchSnippets();
    }
  }, [snippets]);

  const onReviewSnippet = async (snippetId: string, approved: boolean) => {
    if (!snippets) {
      return;
    }
    try {
      const response = await fetch(`/api/v1/snippets/${snippetId}/review`, {
        method: "post",
        body: JSON.stringify({ approved }),
      });
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      setSnippets({
        data: snippets.data.filter(({ id }) => id !== snippetId),
        isLastPage: snippets.isLastPage,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title={`Review Snippets - Preserve.dev`} withHeader>
      <div
        style={{
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        {!snippets ? (
          <CircularProgress />
        ) : (
          <>
            {!snippets.data.length &&
              snippets.isLastPage &&
              "No snippets to review"}
            <List style={{ width: 600 }}>
              {snippets.data.map((snippet) => (
                <ListItem>
                  <Link href={`/p/${snippet.id}`}>
                    <a style={{ width: "100%" }} target="_blank">
                      <ListItemButton>
                        <ListItemText>
                          {snippet.title || "Untitled snippet"}
                        </ListItemText>
                        <div style={{ marginLeft: "auto" }}>
                          <IconButton
                            onClick={(event) => {
                              event.preventDefault();
                              onReviewSnippet(snippet.id, true);
                            }}
                          >
                            <Check color="success" />
                          </IconButton>
                          <IconButton
                            onClick={(event) => {
                              event.preventDefault();
                              onReviewSnippet(snippet.id, false);
                            }}
                          >
                            <Clear color="error" />
                          </IconButton>
                        </div>
                      </ListItemButton>
                    </a>
                  </Link>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </div>
    </Layout>
  );
};

export default withPageAuthRequired(AdminReview, {});
