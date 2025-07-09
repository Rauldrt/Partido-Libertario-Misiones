
"use client";

import React, { useEffect } from 'react';

export function SocialWidget() {
  useEffect(() => {
    // This script is required to load the Elfsight widget platform
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.setAttribute('data-use-service-core', '');
    script.defer = true;
    
    // Append the script to the document head
    document.head.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // The class name is the unique ID for your Elfsight widget.
  return (
    <div className="elfsight-app-d34ae5a8-4286-4552-87f4-a521eda6780c" data-elfsight-app-lazy></div>
  );
}
