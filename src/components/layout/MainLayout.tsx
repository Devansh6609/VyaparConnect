// src/components/layout/MainLayout.tsx
"use client";

import React from 'react';
import NavigationSidebar from './NavigationSidebar';
import CommandPalette from '../ui/CommandPalette';
import { useSession } from 'next-auth/react';
import OnboardingWizard from '../onboarding/OnboardingWizard';
import LoadingSpinner from '../ui/LoadingSpinner';
import VyaparAIFab from '../ai/VyaparAIFab';
import VyaparAIModal from '../ai/VyaparAIModel';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();

  // While the session is loading, show a full-screen spinner.
  // This prevents a flash of the login screen for authenticated users.
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoadingSpinner />
      </div>
    );
  }

  // If the user is authenticated but hasn't completed the wizard, show it.
  if (status === 'authenticated' && !session.user.hasCompletedOnboarding) {
    return <OnboardingWizard />;
  }

  // If the user is authenticated and has completed onboarding, show the main app.
  // The `NavigationSidebar` already hides itself if there's no session.
  return (
    <div className="h-screen w-screen flex bg-[var(--background)] antialiased text-gray-800 dark:text-gray-200">
      <CommandPalette />
      <NavigationSidebar />
      <main className="flex-1 h-full w-full overflow-y-auto">
        {children}
      </main>
      {/* Add AI Components here so they are available globally */}
      {status === 'authenticated' && (
        <>
          <VyaparAIFab />
          <VyaparAIModal />
        </>
      )}
    </div>
  );
};

export default MainLayout;