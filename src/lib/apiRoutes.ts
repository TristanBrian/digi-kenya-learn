export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email'
  },
  STUDENTS: {
    BASE: '/api/students',
    PROFILE: '/api/students/profile',
    COURSES: '/api/students/courses',
    GRADES: '/api/students/grades',
    TIMETABLE: '/api/students/timetable',
    FEES: '/api/students/fees',
    PAYMENTS: '/api/students/payments',
    DOCUMENTS: '/api/students/documents'
  },
  ADMIN: {
    STUDENTS: '/api/admin/students',
    STAFF: '/api/admin/staff',
    COURSES: '/api/admin/courses',
    PROGRAMS: '/api/admin/programs',
    DEPARTMENTS: '/api/admin/departments',
    ENROLLMENTS: '/api/admin/enrollments',
    GRADES: '/api/admin/grades',
    FEES: '/api/admin/fees',
    PAYMENTS: '/api/admin/payments',
    ANNOUNCEMENTS: '/api/admin/announcements',
    REPORTS: '/api/admin/reports'
  },
  PUBLIC: {
    ANNOUNCEMENTS: '/api/public/announcements',
    PROGRAMS: '/api/public/programs'
  }
} as const;

