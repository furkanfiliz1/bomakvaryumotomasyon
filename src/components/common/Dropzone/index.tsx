import { Icon, useNotice } from '@components';
import { fileValidate } from '@helpers';
import { Box, Typography, styled, useTheme } from '@mui/material';
import { ChangeEvent, DragEvent, memo, useEffect, useRef, useState } from 'react';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';
import FileCards from './_partials/FileCards';

interface DropzoneProps {
  name: string;
  form: UseFormReturn<FieldValues>;
  accept?: string;
  multiple: boolean;
  loading: boolean;
  hideFileList?: boolean;
  supportedFormat?: string[];
  maxSize?: number;
  maxSizeType?: string;
  onEdit?: (file: File) => void;
  canEdit?: boolean;
  title?: string;
}

export interface IFile extends File {
  lastModifiedDate: string;
}

const DropzoneStyle = styled(Box)(() => ({
  flex: 1,
  border: '2px dashed black',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 16,
  borderRadius: 4,
  background: '#ecf1fe',
  cursor: 'pointer',
}));

const Row = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary[700],
}));

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Image preview component for single file mode - moved outside to prevent re-renders
interface ImagePreviewProps {
  file: File;
  title?: string;
  canEdit?: boolean;
  onEdit?: (file: File) => void;
  onDelete: (fileName: string) => void;
}

const ImagePreview = memo(({ file, canEdit, onEdit, onDelete }: ImagePreviewProps) => {
  const [base64Url, setBase64Url] = useState<string | null>(null);
  const theme = useTheme();
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';

  // Convert file to base64 on component mount or file change
  useEffect(() => {
    if (isImage) {
      fileToBase64(file)
        .then(setBase64Url)
        .catch(() => setBase64Url(null));
    }
  }, [file, isImage]);

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'space-between',
        ml: 1,
        p: 1,
      }}>
      <Box display="flex" flexDirection={isImage ? 'column' : 'row'} alignItems="center" gap={2}>
        {isImage ? (
          <Box
            component="img"
            src={base64Url || ''}
            alt="Preview"
            sx={{
              width: '100%',
              objectFit: 'cover',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.100',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              minHeight: 80,
              width: 80,
              background: isPdf ? theme.palette.error[700] : theme.palette.success[800],
            }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: 'common.white',
              }}>
              {file.name.split('.').pop() || 'FILE'}
            </Typography>
          </Box>
        )}
      </Box>
      <Box display="flex" justifyContent="space-between" ml={1} sx={{ position: 'relative' }}>
        <Box display="flex" sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
          {canEdit && onEdit && isImage && (
            <Icon
              icon="edit-02"
              width={20}
              height={20}
              onClick={() => onEdit(file)}
              style={{ cursor: 'pointer', marginBottom: 8 }}
              color={theme.palette.primary[800]}
            />
          )}
          <Icon
            icon="trash-01"
            width={20}
            height={20}
            onClick={() => onDelete(file.name)}
            style={{ cursor: 'pointer' }}
            color={theme.palette.error[800]}
          />
        </Box>
      </Box>
    </Box>
  );
});

ImagePreview.displayName = 'ImagePreview';

const Dropzone = (props: DropzoneProps) => {
  const notice = useNotice();
  const { name, form, accept, multiple, loading, supportedFormat, hideFileList, onEdit, canEdit, title } = props;
  const fileInput = useRef<HTMLInputElement | null>(null);

  const file = form.watch(name) as File | null | undefined;
  const files = form.watch(name) as File[] | undefined;

  const theme = useTheme();
  const [isEntered, setIsEntered] = useState(false);

  const handleDropzone = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsEntered(false);

    if (!multiple) {
      const file = e.dataTransfer.items[0].getAsFile();
      form.setValue(name, file);
    } else {
      const fileList = e.dataTransfer.files;
      const newFiles = Array.from(fileList);

      form.setValue(name, [...newFiles, ...(files || [])]);
    }
  };

  const onDelete = (fileName: string) => {
    if (multiple) {
      const newFiles = files?.filter((f) => f.name !== fileName);
      form.setValue(name, newFiles);
    } else {
      form.setValue(name, null);
    }
  };

  const isUploaded = multiple ? files && files.length > 0 : !!file;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <>
          {multiple ? (
            <Box display="flex" sx={{ flexWrap: 'wrap', gap: '5px' }}>
              {!hideFileList &&
                files?.map((file) => (
                  <Box key={file.name} width={350}>
                    <FileCards disabled={loading} file={file} onDelete={() => onDelete(file.name)} />
                  </Box>
                ))}
            </Box>
          ) : (
            <>
              {!hideFileList && file && (
                <ImagePreview file={file} title={title} canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} />
              )}
            </>
          )}
          {(!isUploaded || multiple) && (
            <DropzoneStyle
              id={name}
              onClick={() => fileInput?.current?.click()}
              sx={{
                borderColor: isEntered
                  ? theme.palette.primary[700]
                  : error
                    ? theme.palette.error[600]
                    : theme.palette.primary[400],
              }}
              onDragEnter={() => setIsEntered(true)}
              onDragLeave={() => setIsEntered(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropzone}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: 1,
                  py: 2,
                  textAlign: 'center',
                }}>
                <Row>
                  <Icon icon="plus" width={18} height={18} />
                  Yükle
                </Row>
                {supportedFormat && supportedFormat?.length !== 0 && (
                  <Typography
                    fontSize={12}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}>
                    (Desteklenen formatlar:{' '}
                    {supportedFormat
                      .map((type) => type)
                      ?.toString()
                      .toUpperCase()}
                    )
                  </Typography>
                )}
              </Box>
            </DropzoneStyle>
          )}
          <Box
            component="input"
            multiple
            ref={fileInput}
            type="file"
            accept={accept}
            sx={{ display: 'none' }}
            id={`${name}-input`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const selectedFiles = e.currentTarget.files;

              // First validate file types
              const typeValidate = fileValidate(selectedFiles, supportedFormat, notice);

              if (typeValidate) {
                if (multiple) {
                  onChange(e.currentTarget.files ? [...e.currentTarget.files, ...(files || [])] : []);
                } else {
                  onChange(e?.currentTarget?.files?.[0]);
                }
              }

              if (fileInput.current) {
                fileInput.current.value = '';
              }
            }}
          />
          {error && (
            <Typography sx={{ display: 'flex ', mt: 1 }} variant="caption" color={theme.palette.error[600]}>
              {error?.message}
            </Typography>
          )}
        </>
      )}
    />
  );
};

export default Dropzone;
