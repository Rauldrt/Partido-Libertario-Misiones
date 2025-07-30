
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
      // This is a safer way to parse a string that looks like a JS array of objects.
      // It avoids using eval() or new Function(). It's not perfect but works for this format.
      const arrayString = match[1]
        .replace(/(\w+):/g, '"$1":') // add quotes to keys
        .replace(/'/g, '"'); // replace single quotes with double quotes

      // A simple eval-like function just for this purpose.
      // This is still risky if the config file has malicious content.
      // A more robust solution would be a proper JS parser like acorn or esprima.
      // For this specific use case, it's a calculated risk.
      try {
        const patterns = JSON.parse(
          arrayString
            .replace(/,\s*\]/g, ']') // remove trailing commas before closing bracket
            .replace(/,\s*}/g, '}') // remove trailing commas before closing brace
        );
        return patterns || [];
      } catch (e) {
         console.warn("Could not parse remotePatterns with JSON.parse, trying regex fallback", e);
         // Fallback to regex for simpler cases if JSON parsing fails
          const hostNameRegex = /hostname:\s*'([^']+)'/g;
          let hostMatch;
          const patterns: HostPattern[] = [];
          while ((hostMatch = hostNameRegex.exec(arrayString)) !== null) {
              patterns.push({
                  protocol: 'https',
                  hostname: hostMatch[1],
                  port: '',
                  pathname: '/**',
              });
          }
          return patterns;
      }
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
