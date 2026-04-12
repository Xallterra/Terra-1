import { PageHero } from '@/components/shared/page-hero';
import { ContactForm } from '@/components/forms/contact-form';

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact" subtitle="Questions, partnership requests, or enterprise inquiries? Reach out to the Makriva team." />
      <section className="container page-section" style={{ paddingTop: 0 }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <p style={{ marginTop: 0, color: '#9db0cf' }}>
            We typically respond to technical and business inquiries within one business day.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
