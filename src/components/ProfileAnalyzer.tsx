import { useState } from 'react';
import { AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';
import { analyzeProfile, type ProfileData, type AnalysisResult } from '../lib/analyzer';

type ProfileAnalyzerProps = {
  onAnalysisComplete?: (result: AnalysisResult) => void;
};

export function ProfileAnalyzer({ onAnalysisComplete }: ProfileAnalyzerProps) {
  const [platform, setPlatform] = useState<ProfileData['platform']>('instagram');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState('0');
  const [following, setFollowing] = useState('0');
  const [posts, setPosts] = useState('0');
  const [accountAge, setAccountAge] = useState('30');
  const [isVerified, setIsVerified] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const profileData: ProfileData = {
      username,
      bio,
      followersCount: parseInt(followers) || 0,
      followingCount: parseInt(following) || 0,
      postsCount: parseInt(posts) || 0,
      accountAgeInDays: parseInt(accountAge) || 1,
      isVerified,
      platform,
    };

    const analysis = analyzeProfile(profileData);
    setResult(analysis);
    onAnalysisComplete?.(analysis);
    setLoading(false);
  };

  const getTrustColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrustBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-50';
    if (score >= 50) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleAnalyze} className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Analyze a Profile
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as ProfileData['platform'])}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="tinder">Tinder</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="@username"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bio / Description
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
            placeholder="Enter the profile bio or description..."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Followers
            </label>
            <input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Following
            </label>
            <input
              type="number"
              value={following}
              onChange={(e) => setFollowing(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Posts
            </label>
            <input
              type="number"
              value={posts}
              onChange={(e) => setPosts(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Account Age (days)
            </label>
            <input
              type="number"
              value={accountAge}
              onChange={(e) => setAccountAge(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="30"
              min="0"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            id="verified"
            checked={isVerified}
            onChange={(e) => setIsVerified(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="verified" className="text-sm font-medium text-slate-700">
            Account is verified
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Analyzing...' : 'Analyze Profile'}
        </button>
      </form>

      {result && (
        <div className={`rounded-2xl shadow-lg p-8 ${getTrustBgColor(result.trustScore)}`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">TRUST SCORE</p>
              <div className={`text-5xl font-bold ${getTrustColor(result.trustScore)}`}>
                {result.trustScore}
                <span className="text-2xl">/100</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-600 mb-2">CONFIDENCE</p>
              <div className="text-3xl font-bold text-slate-900">
                {result.confidence}%
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-600 mb-1">IMAGE SCORE</p>
              <p className="text-2xl font-bold text-slate-900">
                {result.analysis.imageScore}
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-600 mb-1">TEXT SCORE</p>
              <p className="text-2xl font-bold text-slate-900">
                {result.analysis.textScore}
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-600 mb-1">BEHAVIOR SCORE</p>
              <p className="text-2xl font-bold text-slate-900">
                {result.analysis.behaviorScore}
              </p>
            </div>
          </div>

          {result.redFlags.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Red Flags Detected
              </h3>
              <ul className="space-y-2">
                {result.redFlags.map((flag, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-slate-700 bg-white/60 p-3 rounded-lg"
                  >
                    <TrendingDown className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.redFlags.length === 0 && (
            <div className="flex items-center gap-3 text-green-700 bg-white/60 p-4 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">No major red flags detected</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
