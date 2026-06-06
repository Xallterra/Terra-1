import { Send } from 'lucide-react';
import Link from 'next/link';
import { createPostAction } from '@/lib/community-actions';
import { postCategories } from '@/lib/community-validation';
import { getCurrentUser } from '@/lib/auth';

export async function AskComposer() {
  const user = await getCurrentUser();

  return (
    <section className="mk-panel mk-composer">
      <div className="mk-section-title">
        <div>
          <h2>Share an admin update</h2>
          <p>Post the issue, impact, environment, evidence, and the fix or decision your team learned.</p>
        </div>
      </div>
      {!user && (
        <div className="auth-cta">
          <strong>Create an account to share with other admins.</strong>
          <span>Public viewers can read the feed, but posting is limited to authenticated members.</span>
          <div>
            <Link href="/signup" className="btn btn-primary">
              Create account
            </Link>
            <Link href="/login" className="mk-link-button">
              Log in
            </Link>
          </div>
        </div>
      )}
      <form action={createPostAction} className="mk-composer__form">
        <input name="title" className="mk-input" placeholder="Example: Intune compliance policy failing on Windows 11 after June update" required minLength={12} />
        <textarea name="body" className="mk-input" placeholder="Describe the issue, scope, timeline, errors, and mitigation attempts..." required minLength={30} />
        <div className="mk-form-grid">
          <select name="type" className="mk-input" defaultValue="QUESTION">
            <option value="QUESTION">Question</option>
            <option value="INCIDENT">Incident</option>
            <option value="FIX">Fix</option>
            <option value="WARNING">Warning</option>
            <option value="DISCUSSION">Discussion</option>
            <option value="GUIDE">Guide</option>
          </select>
          <select name="category" className="mk-input" defaultValue="Endpoint">
            {postCategories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
          <select name="severity" className="mk-input" defaultValue="MEDIUM">
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="INFORMATIONAL">Informational</option>
          </select>
        </div>
        <div className="mk-form-grid">
          <input name="affectedVendor" className="mk-input" placeholder="Vendor: Microsoft, AWS, Cisco..." />
          <input name="affectedProduct" className="mk-input" placeholder="Product: Intune, Entra ID, SCCM..." />
          <input name="tags" className="mk-input" placeholder="Tags: Intune, Autopilot, Windows 11" />
        </div>
        <textarea name="environment" className="mk-input mk-input--compact" placeholder={'Environment details, one per line:\nTenant: Hybrid Entra joined\nOS: Windows 11 23H2\nScope: 37 devices'} />
        <textarea name="codeSnippet" className="mk-input mk-input--compact" placeholder="Optional code, event log, KQL, PowerShell, error snippet..." />
        <button className="btn btn-primary" type="submit" disabled={!user}>
          <Send size={16} />
          Share with admins
        </button>
      </form>
    </section>
  );
}
