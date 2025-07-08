
"use client";

import React, { useEffect, useRef } from 'react';

// This is to prevent typescript errors for platform-specific global objects
declare global {
    interface Window {
        instgrm?: { Embeds: { process: () => void } };
        twttr?: { widgets: { load: (element?: HTMLElement) => void } };
    }
}

export function EmbedDisplay({ embedCode }: { embedCode: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        
        // Clear previous content before adding new
        container.innerHTML = '';
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = embedCode;
        
        // Append all non-script nodes to the container
        Array.from(tempDiv.childNodes).forEach(node => {
            container.appendChild(node.cloneNode(true));
        });

        // Find script tags in the original embed code and re-create them to execute
        const scripts = tempDiv.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            const newScript = document.createElement('script');
            
            // Copy all attributes
            for (let j = 0; j < script.attributes.length; j++) {
                const attr = script.attributes[j];
                newScript.setAttribute(attr.name, attr.value);
            }
            newScript.innerHTML = script.innerHTML; // For inline scripts
            
            // Append to body to ensure it loads and runs, then remove if it's not async/defer
            document.body.appendChild(newScript);
        }

        // After scripts are potentially loaded, trigger platform-specific processing functions
        // which scan the DOM for embeds to initialize.
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
        if (window.twttr) {
            window.twttr.widgets.load(container);
        }

    }, [embedCode]);

    // Add a key to ensure React re-mounts the component if the embed code changes.
    // This is crucial for useEffect to run again reliably.
    return <div key={embedCode} ref={containerRef} />;
}
