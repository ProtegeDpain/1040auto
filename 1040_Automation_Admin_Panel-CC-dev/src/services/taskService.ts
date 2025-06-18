import axiosInstance from "@/providers/axiosInstance";

export const getTasksById = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const response = await axiosInstance.get(`/api/tasks/${userId}`);
  // Check if the response is successful
  if (response.status !== 200) {
    throw new Error("Failed to fetch tasks");
  }
  return response.data;
};

export const createTask = async (taskData: Record<string, any>, files: File[]) => {
  if (!taskData.client_id || !taskData.sub_client_id || !taskData.tax_year) {
    throw new Error("client_id, sub_client_id, and tax_year are required");
  }

  const formData = new FormData();
  // Append all fields as strings, except tax_year as integer
  Object.entries(taskData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'tax_year') {
        formData.append(key, String(Number(value)));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  // Append files
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await axiosInstance.post(`/api/tasks/add`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  if (response.status !== 201) {
    throw new Error("Failed to create task");
  }
  return response.data;
};
