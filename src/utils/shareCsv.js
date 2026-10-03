import { File, Paths } from 'expo-file-system';
import { cacheDirectory, writeAsStringAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

/**
 * Saves text as a .csv file in the app's cache folder and opens the phone's share sheet.
 * Kept apart from csvExport.js, which only builds text and so can be unit tested.
 * @param {string} text  the CSV content
 * @param {string} fileName  e.g. 'taskflow_export_20261003.csv'
 * @returns {Promise<void>}  rejects with a readable message if it cannot share
 */
export async function shareCsvFile(text, fileName) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.');
  }

  const uri = await writeCacheFile(text, fileName);

  await Sharing.shareAsync(uri, {
    mimeType: 'text/csv',
    dialogTitle: 'Export tasks',
    UTI: 'public.comma-separated-values-text',
  });
}

// Writes the file and gives back its address. Tries the newer File API first and,
// as with reading in Session 12, falls back to the legacy writer inside Expo Go.
async function writeCacheFile(text, fileName) {
  try {
    const file = new File(Paths.cache, fileName);
    if (file.exists) {
      file.delete(); // an export from earlier today: replace it
    }
    file.create();
    file.write(text);
    return file.uri;
  } catch {
    const uri = `${cacheDirectory}${fileName}`;
    await writeAsStringAsync(uri, text);
    return uri;
  }
}
