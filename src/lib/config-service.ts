
'use server';

import fs from 'fs/promises';
import path from 'path';

export interface HostPattern {
  protocol: 'https';
  hostname: string;
  port: '';
  pathname: '/**';
}

const configPath = path.join(process.cwd(), 'next.config.js');

/**
 * Reads the next.config.js file and returns the remotePatterns array.
 * This version reads the file as a string and parses the array to avoid
 * issues with `require` in the Next.js build process.
 */
export async function getAllowedHosts(): Promise<HostPattern[]> {
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    
    // Regex to find and capture the remotePatterns array string.
    const remotePatternsRegex = /remotePatterns:\s*(\[[\s\S]*?\])/;
    const match = fileContent.match(remotePatternsRegex);

    if (match && match[1]) {
      const arrayString = match[1];
      // Safely evaluate the JavaScript array string from the config file using `new Function`.
      // This is safer than `eval` and can parse the JavaScript object literal format.
      const patterns = new Function(`return ${arrayString}`)();
      return patterns || [];
    }

    // If no match is found, return an empty array.
    return [];
  } catch (error) {
    console.error('Error reading and parsing next.config.js:', error);
    // If any error occurs (e.g., file not found, parsing error), return an empty array.
    return [];
  }
}

/**
 * Saves the updated remotePatterns array to the next.config.js file.
 * This function reads the file as text and uses a regex to replace the array.
 */
export async function saveAllowedHosts(hosts: HostPattern[]): Promise<void> {
    const fileContent = await fs.readFile(configPath, 'utf-8');

    const patternsAsStrings = hosts.map(host => 
`      {
        protocol: 'https',
        hostname: '${host.hostname}',
        port: '',
        pathname: '/**',
      }`
    );

    const newPatternsString = `[
${patternsAsStrings.join(',\n')}
    ]`;

    const regex = /remotePatterns:\s*\[[\s\S]*?\]/s;

    if (!regex.test(fileContent)) {
        throw new Error('Could not find a "remotePatterns" array in next.config.js. Please add one manually first.');
    }
    
    const updatedContent = fileContent.replace(regex, `remotePatterns: ${newPatternsString}`);
    
    await fs.writeFile(configPath, updatedContent, 'utf-8');
}
