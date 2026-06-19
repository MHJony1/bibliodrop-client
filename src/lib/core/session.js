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

// 2. current user session token get
// export const getUserToken = async () => {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });
//     return session?.session?.token || null;
//   } catch (error) {
//     console.error('Token retrieval error:', error);
//     return null;
//   }
// };



// 3. specific role based  session get
// export const requireRole = async (allowedRoles) => {
//   const user = await getUserSession();

//   if (!user) {
//     redirect('/login'); 
//   }

//   // allowedRoles যদি অ্যারে হয় (যেমন: ['librarian', 'admin']) অথবা সিঙ্গেল স্ট্রিং হয়
//   const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

//   if (!rolesArray.includes(user?.role)) {
//     redirect('/unauthorized'); 
//   }

//   return user;
// };