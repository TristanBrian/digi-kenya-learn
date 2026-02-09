// Demo credentials for marketplace testing
export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@eaic.ac.ke',
    password: 'Admin@2024',
    role: 'admin',
    name: 'Dr. Patrick Kipchoge'
  },
  student: {
    email: 'student@eaic.ac.ke',
    password: 'Student@2024',
    role: 'student',
    name: 'John Kipchoge',
    studentId: 'EAIC/2024/001'
  }
};

export interface DemoUser {
  id: string;
  email: string;
  role: 'admin' | 'student';
  name: string;
  studentId?: string;
}

export interface DemoSession {
  user: DemoUser;
  token: string;
}

const DEMO_SESSION_KEY = 'eaic_demo_session';

export const demoAuth = {
  // Sign in with demo credentials
  signIn: (email: string, password: string): DemoSession | null => {
    if (email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password) {
      const session: DemoSession = {
        user: {
          id: 'admin-001',
          email: DEMO_CREDENTIALS.admin.email,
          role: 'admin',
          name: DEMO_CREDENTIALS.admin.name
        },
        token: 'demo-admin-token-' + Date.now()
      };
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
      return session;
    }

    if (email === DEMO_CREDENTIALS.student.email && password === DEMO_CREDENTIALS.student.password) {
      const session: DemoSession = {
        user: {
          id: 'student-001',
          email: DEMO_CREDENTIALS.student.email,
          role: 'student',
          name: DEMO_CREDENTIALS.student.name,
          studentId: DEMO_CREDENTIALS.student.studentId
        },
        token: 'demo-student-token-' + Date.now()
      };
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
      return session;
    }

    return null;
  },

  // Get current session
  getSession: (): DemoSession | null => {
    const stored = localStorage.getItem(DEMO_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Sign out
  signOut: (): void => {
    localStorage.removeItem(DEMO_SESSION_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return demoAuth.getSession() !== null;
  },

  // Get current user
  getCurrentUser: (): DemoUser | null => {
    const session = demoAuth.getSession();
    return session ? session.user : null;
  }
};
