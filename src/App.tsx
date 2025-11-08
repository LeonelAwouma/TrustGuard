import { useEffect, useState } from 'react';
import { Shield, Zap, Users, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { onAuthStateChange, type User } from './lib/auth';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { WaitlistForm } from './components/WaitlistForm';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading TrustGuard...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onSignOut={() => setUser(null)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
        }}
      />
      <Hero onGetStarted={() => setShowAuthModal(true)} />
      <Stats />
      <Features />
      <HowItWorks />
      <WaitlistSection />
      <CTA onGetStarted={() => setShowAuthModal(true)} />
    </div>
  );
}

function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-2 mb-8">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">AI-Powered Scam Detection</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Stop Scams Before
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              They Start
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Artificial intelligence that protects 100,000+ people from fake profiles and cyberscams across social media platforms
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-xl shadow-blue-500/25"
            >
              Get Started
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all backdrop-blur-sm border border-white/20">
              View Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: '£571M', label: 'Protected' },
    { value: '94.7%', label: 'Accuracy' },
    { value: '100K+', label: 'Active Users' },
    { value: '2.1M', label: 'Scams Detected' }
  ];

  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">{stat.value}</div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Real-Time AI Detection',
      description: 'Instant analysis of profiles as you browse using advanced machine learning models'
    },
    {
      icon: Shield,
      title: 'Multi-Platform Protection',
      description: 'Works across Facebook, Instagram, LinkedIn, Twitter, and dating platforms'
    },
    {
      icon: Users,
      title: 'Community Reports',
      description: 'Crowdsourced threat intelligence from thousands of verified users'
    },
    {
      icon: TrendingUp,
      title: 'Trust Score System',
      description: 'Clear 0-100 scoring that helps you make informed decisions instantly'
    },
    {
      icon: CheckCircle,
      title: 'Phishing Detection',
      description: 'Automatically identifies suspicious emails, messages, and websites'
    },
    {
      icon: AlertTriangle,
      title: 'Smart Alerts',
      description: 'Get notified when you interact with potentially dangerous accounts'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Complete Protection Suite
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Advanced features designed to keep you safe online
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="group p-8 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { number: '01', title: 'Install Extension', description: 'Add TrustGuard to your browser in seconds' },
    { number: '02', title: 'Browse Normally', description: 'Continue using social media as you always do' },
    { number: '03', title: 'Stay Protected', description: 'Get instant alerts on suspicious profiles and content' }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600">
            Three simple steps to complete online safety
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
                <span className="text-3xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WaitlistSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <WaitlistForm />
      </div>
    </section>
  );
}

function CTA({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Join 100,000+ Protected Users
        </h2>
        <p className="text-xl text-slate-300 mb-12">
          Start protecting yourself from online scams today
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-xl shadow-blue-500/25"
          >
            Get Started Now
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all backdrop-blur-sm border border-white/20">
            Learn More
          </button>
        </div>

        <p className="text-slate-400 mt-8">Free forever • No credit card required • Privacy protected</p>
      </div>
    </section>
  );
}

export default App;
