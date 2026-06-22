import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '../auth';

export const getUserSession = async () => {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    return session?.user || null;
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
};

// 3. specific role based  session get
export const requireRole = async (role) => {
  const user = await getUserSession();
  if (!user) {
    redirect('/auth/login');
  }
  if (user?.role?.toLowerCase() !== role.toLowerCase()) {
    redirect('/unauthorized');
  }
  return user;
};
