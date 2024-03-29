export type User = {
  id: string;
  username: string;
  over18: boolean;
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
  externalId: string | null;
  content: string;
  sentAt: string;
  attachments: Attachment[];
  authorUsername: string;
  authorIdentifier: string | null;
  authorAvatarUrl: string | null;
};
export type SnippetInteraction = {
  views: number;
};
export type Snippet = {
  id: string;
  public: boolean;
  claimed: boolean;
  nsfw: boolean;
  title: string | null;
  creator: User | null;
  app: App;
  messages: Message[];
  interaction: SnippetInteraction;
  createdAt: Date;
};
export type SnippetPreview = Snippet & {
  id: string;
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
