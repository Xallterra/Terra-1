import { z } from 'zod';

export const postCategories = [
  'Endpoint',
  'Intune',
  'SCCM',
  'Microsoft 365',
  'Azure',
  'AWS',
  'Security',
  'Vulnerabilities',
  'Outages',
  'Networking',
  'Patch Management',
  'Identity',
  'Helpdesk',
] as const;

export const createPostSchema = z.object({
  title: z.string().min(12).max(160),
  body: z.string().min(30).max(12000),
  type: z.enum(['QUESTION', 'INCIDENT', 'FIX', 'WARNING', 'DISCUSSION', 'GUIDE']),
  category: z.enum(postCategories),
  tags: z.string().max(240).optional(),
  affectedVendor: z.string().max(80).optional(),
  affectedProduct: z.string().max(120).optional(),
  environment: z.string().max(2000).optional(),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL']),
  codeSnippet: z.string().max(8000).optional(),
});

export const createCommentSchema = z.object({
  postId: z.string().min(1),
  parentId: z.string().optional(),
  body: z.string().min(5).max(8000),
  codeSnippet: z.string().max(8000).optional(),
});

export const voteSchema = z.object({
  targetType: z.enum(['POST', 'COMMENT']),
  targetId: z.string().min(1),
});

export const reportSchema = z.object({
  targetType: z.enum(['POST', 'COMMENT', 'USER']),
  targetId: z.string().min(1),
  reason: z.string().min(4).max(120),
  details: z.string().max(2000).optional(),
});
