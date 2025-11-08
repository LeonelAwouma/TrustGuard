import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interest, setInterest] = useState('general');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('waitlist').insert({
        email,
        name: name || null,
        interest_area: interest,
      });

      if (insertError) {
        if (insertError.message.includes('duplicate')) {
          setError('This email is already on the waitlist');
        } else {
          throw insertError;
        }
      } else {
        setSubmitted(true);
        setEmail('');
        setName('');
        setInterest('general');
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to join waitlist',
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200">
        <div className="flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-900">Welcome to the waitlist!</h3>
            <p className="text-sm text-green-700">
              Check your email for updates about our launch.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        Get Early Access
      </h3>
      <p className="text-slate-600 mb-6">
        Join our waitlist to be among the first to use TrustGuard AI
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Name (optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            What interests you most?
          </label>
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General Protection</option>
            <option value="dating">Dating App Safety</option>
            <option value="investment">Investment Scam Prevention</option>
            <option value="phishing">Phishing Detection</option>
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          {loading ? 'Joining...' : 'Join Waitlist'}
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-4 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  );
}
