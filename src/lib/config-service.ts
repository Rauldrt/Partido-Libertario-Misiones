
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
 * It invalidates the require cache to try and get the latest version of the file.
 */
export async function getAllowedHosts(): Promise<HostPattern[]> {
  try {
    delete require.cache[require.resolve(configPath)];
    const config = require(path.resolve(configPath));
    return config.images?.remotePatterns || [];
  } catch (error) {
    console.error('Error reading next.config.js:', error);
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
