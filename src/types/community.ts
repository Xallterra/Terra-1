export type CommunityRole = 'USER' | 'VERIFIED_PROFESSIONAL' | 'MODERATOR' | 'ADMIN';
export type PostStatus = 'OPEN' | 'INVESTIGATING' | 'SOLVED' | 'ARCHIVED';
export type PostType = 'QUESTION' | 'INCIDENT' | 'FIX' | 'WARNING' | 'DISCUSSION' | 'GUIDE';
export type CommunitySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export type CommunityProfile = {
  id: string;
  username: string;
  displayName: string;
  title: string;
  company?: string;
  skills: string[];
  role: CommunityRole;
  reputation: number;
  acceptedAnswersCount: number;
  postsCount: number;
};

export type CommunityPost = {
  id: string;
  slug: string;
  title: string;
  body: string;
  type: PostType;
  category: string;
  tags: string[];
  affectedVendor?: string;
  affectedProduct?: string;
  environment: Record<string, string>;
  severity: CommunitySeverity;
  status: PostStatus;
  author: CommunityProfile;
  voteCount: number;
  commentCount: number;
  bookmarked?: boolean;
  acceptedSolution?: CommunityComment;
  createdAt: string;
  updatedAt: string;
};

export type CommunityComment = {
  id: string;
  postId: string;
  parentId?: string;
  body: string;
  author: CommunityProfile;
  voteCount: number;
  isAccepted: boolean;
  isModeratorNote: boolean;
  createdAt: string;
  replies: CommunityComment[];
};

export type FeedSort = 'newest' | 'trending' | 'most-discussed' | 'unresolved' | 'solved' | 'critical';
