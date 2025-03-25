// services/api/index.ts
import apiClient from './client';

// Export the API client and services
export { default as apiClient } from './client';
export { authAPI } from './auth';
export { projectsAPI } from './projects';
export { teamsAPI } from './teams';
export { tasksAPI } from './tasks';
export { userAPI } from './user';
export { analyticsAPI } from './analytics';
export { reportsAPI } from './reports';
// Export default for convenience
export default apiClient;