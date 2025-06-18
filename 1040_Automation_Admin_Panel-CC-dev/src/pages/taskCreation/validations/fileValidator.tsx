import { toast } from 'react-toastify';
export function validateFiles(
  files: File[],
  maxSizeMB = 30
): boolean {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];

  if (!files || files.length === 0) {
    toast.error("Please upload at least one supporting document.");
    return false;
  }

  const invalidFile = files.find((file) => !allowedTypes.includes(file.type));
  if (invalidFile) {
    toast.error(`Invalid file type: ${invalidFile.name}`);
    return false;
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalMB = totalSize / (1024 * 1024);
  if (totalMB > maxSizeMB) {
    toast.error(`Total file size must not exceed ${maxSizeMB} MB.`);
    return false;
  }

  return true;
}
