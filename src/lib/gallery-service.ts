
'use server';

import fs from 'fs/promises';
import path from 'path';

const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];

/**
 * Recursively finds all image files in a directory.
 * @param dir The directory to search in.
 * @param baseDir The base directory (e.g., /path/to/project/public) to calculate relative paths from.
 * @returns A promise that resolves to an array of public paths (e.g., /images/foo.png).
 */
async function findImageFiles(dir: string, baseDir: string): Promise<string[]> {
  let dirents: any[];
  try {
    dirents = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    // If we can't read the directory (e.g. permissions error), just return an empty array for this path.
    console.warn(`Could not read directory ${dir}:`, err);
    return [];
  }
  
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        return findImageFiles(res, baseDir);
      } else if (imageExtensions.includes(path.extname(dirent.name).toLowerCase())) {
        // Return the path relative to the public directory, ensuring it starts with a '/'
        return '/' + path.relative(baseDir, res).replace(/\\/g, '/');
      }
      return null;
    })
  );
  
  // Flatten the array and filter out null values
  return files.flat().filter((file): file is string => file !== null);
}

/**
 * Gets all image paths from the /public directory.
 * @returns A promise that resolves to an array of strings, where each string is a public URL path.
 */
export async function getPublicImages(): Promise<string[]> {
  const publicDir = path.join(process.cwd(), 'public');
  try {
    const images = await findImageFiles(publicDir, publicDir);
    // Sort alphabetically for consistent order
    return images.sort();
  } catch (error) {
    console.error("Error reading public directory:", error);
    return [];
  }
}
