import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';
import { UserProfile } from '../types/event';
import { LotusDivider, MandalaCorner, MarigoldAccentIcon } from './IndianMotifs';

interface LoginScreenProps {
  onLoginSuccess: (profile: UserProfile) => void;
  onBackToLanding: () => void;
}

export function LoginScreen({ onLoginSuccess, onBackToLanding }: LoginScreenProps) {
  const [googleMode, setGoogleMode] = useState(false);
  const [googleName, setGoogleName] = useState('Aarav Sharma');
  const [googleEmail, setGoogleEmail] = useState('aarav.sharma@gmail.com');
  const [error, setError] = useState<string | null>(null);

  const persistAndContinue = (profile: UserProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    onLoginSuccess(profile);
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = googleName.trim();
    const cleanEmail = googleEmail.trim();
    if (!cleanName || !cleanEmail.includes('@')) {
      setError('Please enter a valid name and email address.');
      return;
    }
    persistAndContinue({ name: cleanName, email: cleanEmail });
  };

  const handleContinueAsGuest = () => {
    persistAndContinue({
      name: 'Guest Host',
      email: 'guest@utsav.ai',
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#064E3B] px-4 py-12">
      {/* Hero Background Image with Scrim */}
      <img
        src="/src/assets/images/hero_utsav_celebration_1795259806132.jpg"
        alt="Indian courtyard wedding mandap illuminated with marigolds and brass diyas"
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/65 via-[#064E3B]/70 to-black/80"
        aria-hidden="true"
      />
      <MandalaCorner
        className="pointer-events-none absolute top-0 left-0 opacity-60"
        stroke="rgba(251, 191, 36, 0.25)"
      />
      <MandalaCorner
        className="pointer-events-none absolute bottom-0 right-0 rotate-180 opacity-60"
        stroke="rgba(251, 191, 36, 0.25)"
      />

      {/* Centered Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#E6DFD3] bg-[#FBF9F5] p-8 shadow-2xl sm:p-10">
        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E] hover:text-[#064E3B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to Overview
        </button>

        <div className="mt-5 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#B8860B]/40 bg-[#F4EFE6]">
            <MarigoldAccentIcon />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#064E3B]">
            Utsav AI
          </h1>
          <p className="mt-1.5 text-sm font-medium text-[#57534E]">Your AI Event Planner</p>
        </div>

        <LotusDivider className="my-6" />

        {!googleMode ? (
          <div className="space-y-3.5">
            <button
              type="button"
              onClick={() => setGoogleMode(true)}
              className="flex min-h-[48px] w-full items-center justify-center gap-3 rounded-lg border border-[#E6DFD3] bg-white px-5 py-3 text-sm font-medium text-[#1C1917] shadow-sm hover:border-[#064E3B]/40 hover:bg-[#F4EFE6] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#C2410C] px-5 py-3 text-sm font-medium text-white hover:bg-[#9A3412] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]"
            >
              <UserCheck className="h-4 w-4" aria-hidden="true" />
              <span>Continue as Guest</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleGoogleSubmit} className="space-y-4">
            <div className="rounded-lg border border-[#E6DFD3] bg-[#F4EFE6]/70 px-3.5 py-2.5 text-xs text-[#57534E]">
              Confirm your Google profile details to save your celebration workspace locally.
            </div>

            {error && (
              <p role="alert" className="text-xs font-medium text-red-700">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="google-name" className="block text-xs font-medium text-[#1C1917]">
                Full Name
              </label>
              <input
                id="google-name"
                type="text"
                required
                value={googleName}
                onChange={(e) => {
                  setGoogleName(e.target.value);
                  setError(null);
                }}
                className="mt-1.5 w-full rounded-lg border border-[#E6DFD3] bg-white px-3.5 py-2.5 text-sm text-[#1C1917] focus:border-[#064E3B] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="google-email" className="block text-xs font-medium text-[#1C1917]">
                Google Email
              </label>
              <input
                id="google-email"
                type="email"
                required
                value={googleEmail}
                onChange={(e) => {
                  setGoogleEmail(e.target.value);
                  setError(null);
                }}
                className="mt-1.5 w-full rounded-lg border border-[#E6DFD3] bg-white px-3.5 py-2.5 text-sm text-[#1C1917] focus:border-[#064E3B] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setGoogleMode(false)}
                className="flex-1 rounded-lg border border-[#E6DFD3] bg-white px-4 py-2.5 text-xs font-medium text-[#1C1917] hover:bg-[#F4EFE6] cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-[2] inline-flex items-center justify-center gap-2 rounded-lg bg-[#064E3B] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#065F46] cursor-pointer"
              >
                Continue
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-[#57534E]">
          Your profile and celebration blueprint are saved automatically in this browser.
        </p>
      </div>
    </div>
  );
}
