import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { readAsStringAsync } from 'expo-file-system/legacy';
import { useState } from 'react';

import { useTaskStore } from '@/store/taskStore';

import { parseCsv } from './csvParser';
import { validateRows } from './csvValidator';

// What the file chooser may offer. '*/*' is included because some Android phones
// do not label .csv files as CSV; the file name is checked after picking instead.
const CSV_TYPES = ['text/csv', 'text/comma-separated-values', '*/*'];

/**
 * Reads a picked file as text.
 * Tries the newer File API first. Inside Expo Go it can refuse picked files with
 * "Missing 'READ' permission", so the older (legacy) reader, which can read
 * Android content:// addresses, is tried next.
 * @param {string} uri  the file's location, from the document picker
 * @returns {Promise<string>}
 */
async function readFileText(uri) {
  try {
    return await new File(uri).text();
  } catch {
    return await readAsStringAsync(uri);
  }
}

/**
 * Runs the Bulk Upload steps and remembers where the user is.
 * step: 'idle' → 'picking' → 'parsing' → 'preview' → 'importing' → 'done' (or 'error').
 */
export function useCsvImport() {
  const [step, setStep] = useState('idle');
  const [file, setFile] = useState(null); // { name, size } of the chosen file
  const [parsed, setParsed] = useState(null); // what parseCsv gave: { hasHeader, rows }
  const [error, setError] = useState(null); // the message shown in the 'error' step
  const [validation, setValidation] = useState(null); // { valid, invalid, duplicates }
  const [summary, setSummary] = useState(null); // { imported, skipped, failed } after importing

  const fail = (message) => {
    setError(message);
    setStep('error');
  };

  const pickFile = async () => {
    setError(null);
    setStep('picking');

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: CSV_TYPES,
        // No copy: inside Expo Go the copy lands in a folder the app may not read.
        // Without it, Android gives a content:// address with permission to read the original.
        copyToCacheDirectory: false,
        multiple: false,
      });

      // The user closed the file chooser without choosing: back to the start, no error.
      if (result.canceled) {
        setStep('idle');
        return;
      }

      const asset = result.assets[0];
      setFile({ name: asset.name, size: asset.size ?? 0 });

      if (!asset.name.toLowerCase().endsWith('.csv')) {
        fail('Please choose a .csv file.');
        return;
      }

      setStep('parsing');
      const text = await readFileText(asset.uri);
      const parsedFile = parseCsv(text);

      if (parsedFile.error) {
        fail(parsedFile.error);
        return;
      }
      if (parsedFile.rows.length === 0) {
        fail('The file has a header line but no tasks.');
        return;
      }

      // The ids already in the app, read once, right now, to find "Already exists".
      const existingIds = new Set(useTaskStore.getState().tasks.map((task) => task.id));

      setParsed(parsedFile);
      setValidation(validateRows(parsedFile.rows, existingIds));
      setStep('preview');
    } catch (readError) {
      // While developing, also show the technical reason, to help find the cause.
      const detail = __DEV__ ? ` (${readError?.message ?? readError})` : '';
      fail(`The file could not be read. Please try again.${detail}`);
    }
  };

  // Puts the valid rows into the store. Duplicates and invalid rows are left out.
  const importValid = () => {
    setStep('importing');

    // Check the app once more: a task with one of these ids may have been added
    // (e.g. in another tab) since the preview was made.
    const existingIds = new Set(useTaskStore.getState().tasks.map((task) => task.id));
    const toImport = validation.valid.filter((task) => !existingIds.has(task.id));
    const alreadyAdded = validation.valid.length - toImport.length;

    useTaskStore.getState().importTasks(toImport);

    setSummary({
      imported: toImport.length,
      skipped: validation.duplicates.length + alreadyAdded,
      failed: validation.invalid.length,
    });
    setStep('done');
  };

  // Back to the start, forgetting the file.
  const reset = () => {
    setFile(null);
    setParsed(null);
    setValidation(null);
    setSummary(null);
    setError(null);
    setStep('idle');
  };

  return {
    step,
    file,
    parsed,
    validation,
    summary,
    error,
    pickFile,
    importValid,
    reset,
  };
}
