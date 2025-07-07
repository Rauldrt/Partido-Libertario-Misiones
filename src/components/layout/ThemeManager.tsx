
"use client";

import React, { useEffect } from 'react';

export function ThemeManager() {
  useEffect(() => {
    const currentHour = new Date().getHours();
    
    // Set dark mode from 7 PM (19) to 6 AM (5)
    const isNightTime = currentHour >= 19 || currentHour < 6;
    
    if (isNightTime) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // Empty dependency array means this runs once on client mount

  return null; // This component does not render anything
}
