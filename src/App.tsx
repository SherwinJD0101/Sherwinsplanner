import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { EventWizard } from './components/EventWizard';
import { PlannerWorkspace } from './components/PlannerWorkspace';
import { EventCategory, EventProfile, UserProfile } from './types/event';

function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() =>
    loadFromStorage<UserProfile>('userProfile')
  );
  const [eventProfile, setEventProfile] = useState<EventProfile | null>(() =>
    loadFromStorage<EventProfile>('eventProfile')
  );

  // If the user is already signed in from a previous visit, resume straight into the app flow.
  const [showLanding, setShowLanding] = useState<boolean>(() => !loadFromStorage<UserProfile>('userProfile'));
  const [selectedEventType, setSelectedEventType] = useState<EventCategory>('Wedding');
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  const handleStartPlanning = (presetEventType?: EventCategory) => {
    if (presetEventType) {
      setSelectedEventType(presetEventType);
    }
    setShowLanding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
    setIsEditingEvent(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowLanding(false);
  };

  const handleWizardComplete = (profile: EventProfile) => {
    setEventProfile(profile);
    setIsEditingEvent(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    localStorage.removeItem('userProfile');
    setUserProfile(null);
    setIsEditingEvent(false);
  };

  if (showLanding) {
    return <LandingPage onStartPlanning={handleStartPlanning} />;
  }

  if (!userProfile) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  if (!eventProfile || isEditingEvent) {
    return (
      <EventWizard
        userProfile={userProfile}
        initialEventType={selectedEventType}
        existingProfile={isEditingEvent ? eventProfile : null}
        onComplete={handleWizardComplete}
        onCancelEdit={isEditingEvent ? () => setIsEditingEvent(false) : undefined}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <PlannerWorkspace
      userProfile={userProfile}
      eventProfile={eventProfile}
      onEditEvent={() => setIsEditingEvent(true)}
      onSignOut={handleSignOut}
      onBackToLanding={handleBackToLanding}
    />
  );
}
