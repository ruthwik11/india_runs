import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '../components/shared/Button';

// Memoized Hero component to prevent expensive Framer Motion spring re-calculations on state changes (FAQ clicks)
const Hero = React.memo(({ title, subtitle, startButtonText, onStart }) => {
  const titleWords = title.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 70, damping: 20 }
    }
  };

  return (
    <section className="container pt-24 pb-20 md:py-32 flex flex-col items-center px-8 md:px-8">
      {/* Title */}
      <motion.h2
        className="font-display text-4xl md:text-6xl tracking-tighter leading-[1.2] text-center mb-8 md:mb-6 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {titleWords.map((word, idx) => (
          <motion.span key={idx} variants={wordVariants} className="inline-block mr-4">
            {word}
          </motion.span>
        ))}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="font-body text-base md:text-xl font-light text-center mb-12 md:mb-12 max-w-2xl text-muted-foreground px-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {subtitle}
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Button onClick={onStart} variant="primary" className="text-base md:text-lg px-8 md:px-12 py-4 md:py-5 w-full sm:w-auto">
          {startButtonText} →
        </Button>
      </motion.div>
    </section>
  );
});

Hero.displayName = 'Hero';

// Memoized FeatureCards component to prevent animation re-triggers on state updates
const FeatureCards = React.memo(({ features }) => {
  return (
    <section className="container pt-20 md:pt-24 pb-16 md:pb-24 flex justify-center items-center px-8 md:px-8">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-12">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="card-fade-up group cursor-pointer flex flex-col bg-white border-thin border-black p-5 md:p-8
                       transition-all duration-200 ease-out hover:-translate-y-1.5 hover:bg-black"
            style={{ animationDelay: `${idx * 0.12}s` }}
          >
            <div className="mb-5 md:mb-8 w-12 h-12 md:w-16 md:h-16 border-thin border-black flex items-center justify-center group-hover:border-white transition-colors duration-200">
              <span className="font-mono text-base md:text-xl group-hover:text-white transition-colors duration-200">0{idx + 1}</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-3 md:mb-4 group-hover:text-white transition-colors duration-200">
              {feature.title}
            </h3>
            <p className="font-body text-base md:text-lg group-hover:text-white transition-colors duration-200 mb-4 md:mb-6">
              {feature.desc}
            </p>

            {/* Bullet points */}
            <ul className="space-y-2 mb-6">
              {feature.bullets.map((point, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm text-muted-foreground group-hover:text-white/80 transition-colors duration-200">
                  <span className="mt-1 w-1.5 h-1.5 bg-black group-hover:bg-white rounded-full flex-shrink-0 transition-colors duration-200" />
                  {point}
                </li>
              ))}
            </ul>

            {/* Tag pill */}
            <div className="mt-auto">
              <span className="inline-block font-mono text-xs tracking-widest uppercase border border-black group-hover:border-white group-hover:text-white px-3 py-1 transition-colors duration-200">
                {feature.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

FeatureCards.displayName = 'FeatureCards';

function Home({ onStart }) {
  const { t } = useTranslation();
  const [activeFaq, setActiveFaq] = React.useState(null);

  const features = React.useMemo(() => [
    {
      title: t('home.feature1Title'),
      desc: t('home.feature1Desc'),
      bullets: ['500+ central & state schemes', 'Income, caste & age filters', 'Updated monthly'],
      tag: '500+ Schemes',
    },
    {
      title: t('home.feature2Title'),
      desc: t('home.feature2Desc'),
      bullets: ['Hindi, Telugu, Tamil & more', 'Voice input supported', 'Regional script display'],
      tag: '10 Languages',
    },
    {
      title: t('home.feature3Title'),
      desc: t('home.feature3Desc'),
      bullets: ['Document checklist per scheme', 'Direct application links', 'Deadline reminders'],
      tag: 'Zero Paperwork Confusion',
    },
  ], [t]);

  return (
    <div className="relative bg-white pattern-lines-horizontal mt-10 md:mt-0">
      {/* Hero Section */}
      <Hero
        title={t('home.title')}
        subtitle={t('home.subtitle')}
        startButtonText={t('home.startButton')}
        onStart={onStart}
      />

      {/* Animated Rule Divider */}
      <motion.div 
        className="w-full h-[6px] md:h-[8px] bg-black my-8 md:my-16"
        initial={{ width: '0%' }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 2, ease: "linear" }}
      />

      {/* Feature Cards */}
      <FeatureCards features={features} />

      {/* Divider */}
      <div className="w-full h-px bg-gray-200" />

      {/* About Section */}
      <section className="container py-16 md:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest bg-gray-100 text-gray-800 px-3 py-1 font-bold rounded">
                Project Manifesto
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter mt-4">
                About the Initiative
              </h2>
            </div>
            <p className="font-body text-lg text-muted-foreground max-w-md leading-relaxed">
              An independent civic-tech portal designed to make India's public welfare schemes searchable, understandable, and accessible to everyone.
            </p>
          </div>

          {/* Concrete Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Mission & Purpose */}
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold">Our Objective</h3>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Welfare programs in India total billions of rupees, yet millions of eligible citizens are left out due to a lack of awareness or confusion over document requirements.
              </p>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                SarkariSaathi provides an alternative to expensive middlemen. By using simplified logic filters, we translate complex bureaucratic guidelines into easy questions. You check your eligibility in minutes and apply directly on official portals.
              </p>
            </div>

            {/* Project Specs */}
            <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl">
              <h3 className="font-display text-2xl font-bold mb-6">Platform Specifications</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-mono text-xs text-gray-500 uppercase">STATUS</span>
                  <span className="font-body text-sm font-semibold text-black">Active (Independent Utility)</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-mono text-xs text-gray-500 uppercase">PRIMARY DATA SOURCE</span>
                  <span className="font-body text-sm font-semibold text-black text-right">myScheme databases & Gazettes</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-mono text-xs text-gray-500 uppercase">GEOGRAPHIC SCOPE</span>
                  <span className="font-body text-sm font-semibold text-black">All 28 States & 8 UTs</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-mono text-xs text-gray-500 uppercase">DATA PRIVACY</span>
                  <span className="font-body text-sm font-semibold text-black">100% Client-Side Memory</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-xs text-gray-500 uppercase">AFFILIATION</span>
                  <span className="font-body text-sm font-semibold text-red-600">None (Not Government Owned)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Who is it for? */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="border border-gray-200 p-6 bg-gray-50 rounded-xl">
              <h4 className="font-display text-lg font-bold mb-2">🧑‍🌾 For Citizens</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Discover financial grants, educational scholarships, agricultural subsidies, and health insurances that you qualify for.
              </p>
            </div>

            <div className="border border-gray-200 p-6 bg-gray-50 rounded-xl">
              <h4 className="font-display text-lg font-bold mb-2">🤝 For Volunteers</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Help local communities, farmers, and daily-wage laborers check their eligibility and gather required application documents on the spot.
              </p>
            </div>

            <div className="border border-gray-200 p-6 bg-gray-50 rounded-xl">
              <h4 className="font-display text-lg font-bold mb-2">🏢 For Common Centers</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                CSCs and digital kiosks can run rapid qualifications checks for visitors without tedious manual document verification.
              </p>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="border border-red-200 p-6 bg-red-50/50 rounded-xl mb-16">
            <h4 className="font-display text-lg font-bold text-red-800 mb-2">⚠️ Important Disclaimer</h4>
            <p className="font-body text-sm text-red-700 leading-relaxed">
              SarkariSaathi is an independent, non-governmental civic-tech utility. While we make every effort to verify scheme criteria against official gazettes, this platform does not issue certificates, submit official applications, or guarantee welfare allocation. Final eligibility is determined solely by the respective state or central ministries during the formal application process.
            </p>
          </div>

          {/* How It Works Timeline */}
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl mb-16">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center tracking-tight">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-mono text-lg font-bold mb-4">
                  1
                </div>
                <h4 className="font-display text-lg font-bold mb-2">Build Profile</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Answer 6 simple anonymous questions regarding your age, location, occupation, and land ownership.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-mono text-lg font-bold mb-4">
                  2
                </div>
                <h4 className="font-display text-lg font-bold mb-2">Instant Filter</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Our system evaluates your inputs against active government guidelines in real-time.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-mono text-lg font-bold mb-4">
                  3
                </div>
                <h4 className="font-display text-lg font-bold mb-2">Apply Directly</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Review matched schemes, view required documents checklists, and navigate directly to official portals.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom FAQ Accordion */}
          <div className="border border-gray-200 rounded-xl p-6 md:p-10 bg-white">
            <h4 className="font-display text-2xl md:text-3xl font-bold mb-8 uppercase tracking-tight">
              Frequently Asked Questions
            </h4>
            
            <div className="space-y-4 border-t border-gray-200 pt-6">
              {[
                {
                  q: "How does the scheme matching algorithm work?",
                  a: "SarkariSaathi matches your demographic and financial profile against over 500 central and state welfare scheme databases. When you select your state (e.g. Karnataka) and input your details (e.g. Farmer, Income under ₹2 Lakhs), the system instantly filters matching criteria like age limits, occupational rules, and land limits, highlighting schemes where you qualify."
                },
                {
                  q: "What actual government schemes are covered?",
                  a: "We support a wide database of welfare benefits, including: Pradhan Mantri Kisan Samman Nidhi (PM-KISAN), PM Awas Yojana (Housing), PM Vishwakarma (Artisans), Post-Matric Scholarships, and regional state programs like Rythu Bandhu (Telangana) or Gruha Lakshmi (Karnataka). All matches link directly to the official government portals."
                },
                {
                  q: "Is my personal data or income information saved?",
                  a: "No. SarkariSaathi is built on a privacy-first architecture. We do not require any signup, phone numbers, Aadhaar numbers, or document uploads. Your answers are processed in your browser memory and are deleted immediately when you refresh or close the tab."
                },
                {
                  q: "Who runs this platform and is it free?",
                  a: "SarkariSaathi is a free public utility project. There are no registration fees, hidden commissions, or premium tiers. The platform provides transparent access to public resources and routes you directly to government services without any middlemen."
                }
              ].map((item, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border-b border-gray-100 py-4 last:border-b-0">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left py-3 font-display text-lg font-bold flex justify-between items-center hover:text-gray-600 transition-colors duration-150"
                    >
                      <span>{item.q}</span>
                      <span className="font-light text-gray-400 text-xl">{isOpen ? '−' : '+'}</span>
                    </button>
                    <div 
                      className="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-2 pb-4">
                          <p className="font-body text-base text-muted-foreground leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
