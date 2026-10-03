import { useRouter } from 'expo-router';

import { AppText, Button, Card, ErrorState, Loader, Screen } from '@/components/ui';
import { FileInfoCard } from '@/features/import/FileInfoCard';
import { ImportSummary } from '@/features/import/ImportSummary';
import { useCsvImport } from '@/features/import/useCsvImport';
import { ValidationPreview } from '@/features/import/ValidationPreview';
import { useTheme } from '@/theme/useTheme';

export default function UploadScreen() {
  const router = useRouter();
  const { spacing } = useTheme();
  const { step, file, parsed, validation, summary, error, pickFile, importValid, reset } =
    useCsvImport();

  const validCount = validation?.valid.length ?? 0;
  const importLabel =
    validCount === 0
      ? 'Nothing to import'
      : `Import ${validCount} valid ${validCount === 1 ? 'task' : 'tasks'}`;

  return (
    <Screen scroll style={{ gap: spacing.md }}>
      <AppText variant="title">Bulk Upload</AppText>

      {step === 'idle' ? (
        <>
          <Card style={{ gap: spacing.sm }}>
            <AppText>Import many tasks at once from a CSV file.</AppText>
            <AppText variant="muted">
              Columns: id, title, description, category, priority, start_date, due_date, status. The
              header line is optional. Dates as YYYY-MM-DD or DD-MM-YYYY.
            </AppText>
          </Card>
          <Button label="Choose CSV file" onPress={pickFile} />
        </>
      ) : null}

      {step === 'picking' || step === 'parsing' ? (
        <Card style={{ height: spacing.xxl * 4 }}>
          <Loader label={step === 'picking' ? 'Choosing a file' : 'Reading the file'} />
        </Card>
      ) : null}

      {step === 'preview' || step === 'importing' ? (
        <>
          <FileInfoCard
            name={file.name}
            size={file.size}
            rowCount={parsed.rows.length}
            hasHeader={parsed.hasHeader}
          />
          <ValidationPreview validation={validation} />
          <Button
            label={importLabel}
            loading={step === 'importing'}
            disabled={validCount === 0}
            onPress={importValid}
          />
          <Button label="Choose another file" variant="secondary" onPress={pickFile} />
        </>
      ) : null}

      {step === 'done' ? (
        <>
          <FileInfoCard name={file.name} size={file.size} />
          <ImportSummary summary={summary} />
          <Button label="View tasks" onPress={() => router.push('/tasks?status=all')} />
          <Button label="Upload another" variant="secondary" onPress={reset} />
        </>
      ) : null}

      {step === 'error' ? (
        <>
          {file ? <FileInfoCard name={file.name} size={file.size} /> : null}
          <Card>
            <ErrorState
              title="Can't use this file"
              message={error}
              retryLabel="Choose another file"
              onRetry={pickFile}
            />
          </Card>
          <Button label="Cancel" variant="ghost" onPress={reset} />
        </>
      ) : null}
    </Screen>
  );
}
