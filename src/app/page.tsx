import { Hero } from '@/components/home/hero';
import { Features } from '@/components/home/features';
import { LatestAlerts } from '@/components/home/latest-alerts';
import { WhyMakriva } from '@/components/home/why-makriva';
import { SubscribeCta } from '@/components/home/subscribe-cta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <LatestAlerts />
      <WhyMakriva />
      <SubscribeCta />
    </>
  );
}
