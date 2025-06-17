export const API_ENDPOINTS = {
  PUBLIC_INFO: "/public/",
  LOGIN: "/login/",
  REGISTER: "/register/",
  PROFILE: "/profile/",
  TASKS: "/tasks/",
}

export const TASK_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
}

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: "Pending",
  [TASK_STATUS.PROCESSING]: "Processing",
  [TASK_STATUS.COMPLETED]: "Completed",
  [TASK_STATUS.FAILED]: "Failed",
}
