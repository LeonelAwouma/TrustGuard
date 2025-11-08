import { useEffect, useState } from 'react';
import { LogOut, Shield } from 'lucide-react';
import { supabase, type Profile } from '../lib/supabase';
import { signOut, getCurrentUser, type User } from '../lib/auth';
import { ProfileAnalyzer } from './ProfileAnalyzer';
import { AnalysisResult } from '../lib/analyzer';

type DashboardProps = {
  user: User;
  onSignOut: () => void;
};

export function Dashboard({ user, onSignOut }: DashboardProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.id]);

  const handleSignOut = async () => {
    try {
      await signOut();
      onSignOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleAnalysisComplete = async (result: AnalysisResult) => {
    setAnalyzing(true);

    try {
      if (profile) {
        const updated = await supabase
          .from('profiles')
          .update({
            profiles_analyzed: (profile.profiles_analyzed || 0) + 1,
            trust_score: Math.round(
              (profile.trust_score * (profile.profiles_analyzed || 0) +
                result.trustScore) /
                ((profile.profiles_analyzed || 0) + 1),
            ),
          })
          .eq('id', user.id)
          .select()
          .maybeSingle();

        if (updated.data) {
          setProfile(updated.data);
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">TrustGuard</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-slate-600">Signed in as</p>
              <p className="font-medium text-slate-900">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-600">
            <p className="text-sm text-slate-600 font-medium mb-2">Trust Score</p>
            <p className="text-4xl font-bold text-slate-900">
              {profile?.trust_score || 0}
              <span className="text-lg text-slate-500">/100</span>
            </p>
            <p className="text-xs text-slate-500 mt-2">Your personal safety rating</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-600">
            <p className="text-sm text-slate-600 font-medium mb-2">
              Profiles Analyzed
            </p>
            <p className="text-4xl font-bold text-slate-900">
              {profile?.profiles_analyzed || 0}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Profiles checked by you
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-600">
            <p className="text-sm text-slate-600 font-medium mb-2">Reports Made</p>
            <p className="text-4xl font-bold text-slate-900">
              {profile?.reports_submitted || 0}
            </p>
            <p className="text-xs text-slate-500 mt-2">Scams you've reported</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {analyzing && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 font-medium">
                Updating your profile statistics...
              </p>
            </div>
          )}
          <ProfileAnalyzer onAnalysisComplete={handleAnalysisComplete} />
        </div>
      </main>
    </div>
  );
}
