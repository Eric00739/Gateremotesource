import LeadModalProvider from '@/components/LeadModalProvider';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import BrandCompatibilitySection from '@/components/BrandCompatibilitySection';
import RiskControlSection from '@/components/RiskControlSection';
import CompatibilityWorkflowSection from '@/components/CompatibilityWorkflowSection';
import CapabilityHighlightsSection from '@/components/CapabilityHighlightsSection';
import ApplicationScenariosSection from '@/components/ApplicationScenariosSection';
import FactoryEvidenceSection from '@/components/FactoryEvidenceSection';
import FaqSection from '@/components/FaqSection';
import CtaSection from '@/components/CtaSection';

export default function HomePage() {
  return (
    <LeadModalProvider>
      <HeroSection />
      <StatsSection />
      <BrandCompatibilitySection />
      <RiskControlSection />
      <CompatibilityWorkflowSection />
      <CapabilityHighlightsSection />
      <ApplicationScenariosSection />
      <FactoryEvidenceSection />
      <FaqSection />
      <CtaSection />
    </LeadModalProvider>
  );
}
