export const ROLES = {
  ADMIN: 'admin',
  TEAMLEAD: 'teamlead',
  INTERN: 'intern'
};

export const STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const ROLE_PATHS = {
  admin: '/admin/dashboard',
  teamlead: '/teamlead/dashboard',
  intern: '/intern/dashboard'
};

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  USERS: '/intern/',
  TASKS: '/task/',
  TASKS_MY: '/task/my',
  REPORTS: '/report',
  EVALUATIONS: '/evaluation',
  LEADERBOARD: '/evaluation/leaderboard'
};

