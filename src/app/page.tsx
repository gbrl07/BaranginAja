import HeroCarousel from '@/components/HeroCarousel';
import StatsBar from '@/components/StatsBar';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroCarousel />
      <StatsBar />
    </main>
  );
}
