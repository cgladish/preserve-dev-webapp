export type DiscordAppSpecificData = {
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

export type User = {
  id: string;
  username: string;
  displayName: string;
  createdAt: Date;
};

export type App = { id: string; name: string };

export type Message = {
  id: string;
  content: string;
  sentAt: string;
  appSpecificDataJson: string | null;
  authorUsername: string;
  authorIdentifier: string | null;
  authorAvatarUrl: string | null;
};

export type Snippet = {
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
