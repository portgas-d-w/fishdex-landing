import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeaturesSection from '@/components/FeaturesSection'
import RaritySection from '@/components/RaritySection'
import MemorySection from '@/components/MemorySection'
import PricingSection from '@/components/PricingSection'
import ManifestSection from '@/components/ManifestSection'
import CTASection from '@/components/CTASection'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <RaritySection />
      <MemorySection />
      <PricingSection />
      <ManifestSection />
      <CTASection />
    </main>
  )
}
