import { PageHero } from '@/components/shared/page-hero';

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact" subtitle="Questions, partnership requests, or enterprise inquiries? Reach out to the Makriva team." />
      <section className="container page-section" style={{ paddingTop: 0 }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <p style={{ marginTop: 0, color: '#9db0cf' }}>
            We typically respond to technical and business inquiries within one business day.
          </p>
          <form style={{ display: 'grid', gap: '0.8rem', maxWidth: 680 }}>
            <input className="input" placeholder="Name" name="name" required />
            <input className="input" placeholder="Email" type="email" name="email" required />
            <input className="input" placeholder="Subject" name="subject" required />
            <textarea className="input" placeholder="Message" name="message" rows={6} required />
            <div>
              <button className="btn" type="submit">Send Inquiry</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
