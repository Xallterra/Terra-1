import { describe, expect, it } from 'vitest';
import { createCommentSchema, createPostSchema, voteSchema } from './community-validation';

describe('community validation', () => {
  it('accepts a complete IT troubleshooting post', () => {
    const parsed = createPostSchema.parse({
      title: 'Intune compliance policy failing after update',
      body: 'Devices are reporting non-compliant after the latest policy sync and we need field-tested remediation steps.',
      type: 'QUESTION',
      category: 'Intune',
      severity: 'HIGH',
      tags: 'Intune, Compliance, Windows 11',
      affectedVendor: 'Microsoft',
      affectedProduct: 'Microsoft Intune',
    });

    expect(parsed.category).toBe('Intune');
    expect(parsed.severity).toBe('HIGH');
  });

  it('rejects short low-quality posts', () => {
    expect(() =>
      createPostSchema.parse({
        title: 'Help',
        body: 'Broken',
        type: 'QUESTION',
        category: 'Endpoint',
        severity: 'LOW',
      })
    ).toThrow();
  });

  it('validates comments and vote targets', () => {
    expect(createCommentSchema.parse({ postId: 'p1', body: 'This fixed our pilot ring too.' }).postId).toBe('p1');
    expect(voteSchema.parse({ targetType: 'POST', targetId: 'p1' }).targetType).toBe('POST');
  });
});
