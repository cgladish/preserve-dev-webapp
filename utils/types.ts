export type User = {
  id: string;
  username: string;
  displayName: string;
  createdAt: Date;
};

export type App = { id: string; name: string };

export type Attachment = {
  id: string;
  type: string;
  filename: string | null;
  url: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
};
export type Message = {
  id: string;
  content: string;
  sentAt: string;
  attachments: Attachment[];
  authorUsername: string;
  authorIdentifier: string | null;
  authorAvatarUrl: string | null;
};
export type Snippet = {
  id: string;
  public: boolean;
  title: string | null;
  creator: User | null;
  app: App;
  messages: Message[];
  createdAt: Date;
};
export type SnippetInteraction = {
  views: number;
};
export type SnippetPreview = Snippet & {
  id: string;
  interaction: SnippetInteraction;
  totalComments: number;
};
export type SnippetPreviewsPaginationInfo = {
  data: SnippetPreview[];
  isLastPage: boolean;
};

export type Comment = {
  id: string;
  content: string;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
  savedNow?: boolean;
};
export type CommentsPaginationInfo = {
  data: Comment[];
  totalCount: number;
  isLastPage: boolean;
};
