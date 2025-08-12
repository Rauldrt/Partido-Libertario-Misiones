
"use client";

import React, { useEffect } from 'react';

export function ThemeManager() {
  useEffect(() => {
    // We are now setting the dark theme via globals.css by default
    // This component can be used in the future to toggle themes
    // For now, we can remove the logic that overrides it based on time.
    document.documentElement.classList.add('dark');
  }, []); // Empty dependency array means this runs once on client mount

  return null; // This component does not render anything
}
