import { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/auth';

interface StoredAccount {
  user: User;
  password: string;
}

const LOCAL_ACCOUNTS_KEY = 'local_auth_accounts';
const LOCAL_SESSION_USER_KEY = 'local_session_user';

const canUseStorage = (): boolean => typeof window !== 'undefined';

const readAccounts = (): StoredAccount[] => {
  if (!canUseStorage()) return [];

  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredAccount[];
  } catch {
    return [];
  }
};

const writeAccounts = (accounts: StoredAccount[]): void => {
  if (!canUseStorage()) return;
  localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
};

const setSessionUser = (user: User): void => {
  if (!canUseStorage()) return;
  localStorage.setItem(LOCAL_SESSION_USER_KEY, JSON.stringify(user));
};

export const localAuth = {
  register: (data: RegisterRequest): { user: User; message: string } => {
    const accounts = readAccounts();
    const normalizedEmail = data.email.trim().toLowerCase();
    const alreadyExists = accounts.some(
      (account) => account.user.email.toLowerCase() === normalizedEmail
    );

    if (alreadyExists) {
      throw new Error('An account with this email already exists');
    }

    const user: User = {
      id: Date.now(),
      email: normalizedEmail,
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      date_joined: new Date().toISOString(),
    };

    accounts.push({ user, password: data.password });
    writeAccounts(accounts);
    return { user, message: 'Account created successfully' };
  },

  login: (credentials: LoginRequest): LoginResponse => {
    const accounts = readAccounts();
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const found = accounts.find(
      (account) =>
        account.user.email.toLowerCase() === normalizedEmail &&
        account.password === credentials.password
    );

    if (!found) {
      throw new Error('Invalid email or password');
    }

    setSessionUser(found.user);

    return {
      user: found.user,
      tokens: {
        access: `local-access-${found.user.id}`,
        refresh: `local-refresh-${found.user.id}`,
      },
    };
  },

  getSessionUser: (): User | null => {
    if (!canUseStorage()) return null;

    try {
      const raw = localStorage.getItem(LOCAL_SESSION_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  clearSession: (): void => {
    if (!canUseStorage()) return;
    localStorage.removeItem(LOCAL_SESSION_USER_KEY);
  },
};
