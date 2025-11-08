export type AnalysisResult = {
  trustScore: number;
  redFlags: string[];
  confidence: number;
  analysis: {
    imageScore: number;
    textScore: number;
    behaviorScore: number;
  };
};

export type ProfileData = {
  username: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  accountAgeInDays: number;
  isVerified: boolean;
  profileImageUrl?: string;
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tinder';
};

const SUSPICIOUS_KEYWORDS = [
  'make money',
  'quick cash',
  'guarantee',
  'limited time',
  'urgent',
  'click here',
  'verify account',
  'confirm identity',
  'update payment',
  'congratulations won',
  'claim prize',
  'bitcoin',
  'crypto',
  'investment opportunity',
  'no experience needed',
  'work from home',
];

const GENERIC_WORDS = [
  'hello',
  'hi there',
  'beautiful',
  'gorgeous',
  'handsome',
  'love travel',
  'love fitness',
  'adventure',
];

function calculateImageScore(
  _imageUrl?: string,
): number {
  if (!_imageUrl) return 30;

  const isPhotoGeneric =
    _imageUrl.includes('stock') ||
    _imageUrl.includes('unsplash') ||
    _imageUrl.includes('pexels');

  return isPhotoGeneric ? 40 : 75;
}

function calculateTextScore(bio: string, platform: string): number {
  const lowerBio = bio.toLowerCase();
  let score = 80;

  const suspiciousCount = SUSPICIOUS_KEYWORDS.filter((keyword) =>
    lowerBio.includes(keyword),
  ).length;

  const genericCount = GENERIC_WORDS.filter((word) =>
    lowerBio.includes(word),
  ).length;

  score -= suspiciousCount * 15;
  score -= genericCount * 5;

  if (bio.length < 20) score -= 20;
  if (bio.includes('http') && platform === 'instagram') score -= 25;

  const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  const emojiCount = (bio.match(emojiRegex) || []).length;
  if (emojiCount > 5) score -= 15;

  return Math.max(0, Math.min(100, score));
}

function calculateBehaviorScore(
  followersCount: number,
  followingCount: number,
  postsCount: number,
  accountAgeInDays: number,
  isVerified: boolean,
): number {
  let score = 70;

  if (followersCount === 0 || followingCount === 0) score -= 20;

  const ratio = followingCount > 0 ? followersCount / followingCount : 0;
  if (ratio > 10 || ratio < 0.1) score -= 15;
  if (ratio === 0) score -= 25;

  if (postsCount === 0) score -= 15;
  if (postsCount > 0 && accountAgeInDays > 0) {
    const postFrequency = postsCount / Math.max(accountAgeInDays, 1);
    if (postFrequency > 10) score -= 10;
    if (postFrequency < 0.1) score -= 15;
  }

  if (accountAgeInDays < 7) score -= 30;
  if (accountAgeInDays < 30) score -= 15;

  if (isVerified) score += 20;

  if (
    followersCount > 100000 &&
    postsCount > 100 &&
    accountAgeInDays > 365
  ) {
    score += 15;
  }

  return Math.max(0, Math.min(100, score));
}

function identifyRedFlags(
  profileData: ProfileData,
  imageScore: number,
  textScore: number,
  behaviorScore: number,
): string[] {
  const flags: string[] = [];

  if (profileData.accountAgeInDays < 7) {
    flags.push('Very new account (less than 7 days old)');
  }

  if (profileData.followersCount === 0) {
    flags.push('No followers');
  }

  if (profileData.postsCount === 0) {
    flags.push('No posts on record');
  }

  if (
    profileData.followingCount > 0 &&
    profileData.followersCount / profileData.followingCount < 0.2
  ) {
    flags.push('Unusual follower-to-following ratio');
  }

  const lowerBio = profileData.bio.toLowerCase();
  if (SUSPICIOUS_KEYWORDS.some((kw) => lowerBio.includes(kw))) {
    flags.push('Bio contains suspicious keywords');
  }

  if (profileData.bio.length < 20 && profileData.bio.length > 0) {
    flags.push('Unusually short bio');
  }

  if (imageScore < 50) {
    flags.push('Generic or suspicious profile image');
  }

  if (textScore < 50) {
    flags.push('Bio contains spam-like language');
  }

  if (behaviorScore < 50) {
    flags.push('Unusual account behavior patterns');
  }

  if (!profileData.isVerified && profileData.platform === 'twitter') {
    flags.push('Not verified on Twitter');
  }

  return flags;
}

export function analyzeProfile(profileData: ProfileData): AnalysisResult {
  const imageScore = calculateImageScore(profileData.profileImageUrl);
  const textScore = calculateTextScore(profileData.bio, profileData.platform);
  const behaviorScore = calculateBehaviorScore(
    profileData.followersCount,
    profileData.followingCount,
    profileData.postsCount,
    profileData.accountAgeInDays,
    profileData.isVerified,
  );

  const weights = {
    image: 0.25,
    text: 0.35,
    behavior: 0.4,
  };

  const trustScore = Math.round(
    imageScore * weights.image +
      textScore * weights.text +
      behaviorScore * weights.behavior,
  );

  const redFlags = identifyRedFlags(
    profileData,
    imageScore,
    textScore,
    behaviorScore,
  );

  const confidence = Math.min(
    95,
    Math.round(75 + (Math.abs(trustScore - 50) / 50) * 20),
  );

  return {
    trustScore,
    redFlags,
    confidence,
    analysis: {
      imageScore,
      textScore,
      behaviorScore,
    },
  };
}
