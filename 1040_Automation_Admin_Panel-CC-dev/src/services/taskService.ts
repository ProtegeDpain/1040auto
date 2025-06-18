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

interface CreateTaskData {
  userId: string;
  title: string;
  description: string;
  client_id: number;
  sub_client_id: number;
  tax_year: number;
  task_uid?: string; // Make task_uid optional
}

export const createTask = async (taskData: CreateTaskData) => {
  if (!taskData.client_id || !taskData.sub_client_id || !taskData.tax_year) {
    throw new Error("client_id, sub_client_id, and tax_year are required");
  }

  // Send empty string as task_uid to satisfy API requirement while effectively making it optional
  const payload = {
    ...taskData,
    task_uid: taskData.task_uid || "", // Provide empty string as default
  };

  const response = await axiosInstance.post(`/api/tasks/add`, payload);
  // Check if the response is successful
  if (response.status !== 201) {
    throw new Error("Failed to create task");
  }
  return response.data;
};
