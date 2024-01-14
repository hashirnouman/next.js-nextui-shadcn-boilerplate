/**
 * Routes that are not allowed without logging in
 */
const protectedRoutes = [
  '/',
  '/onboarding',
  '/authenticate',
  '/creator-dashboard',
  '/notifications',
  '/settings',
  '/admin',
];
export default protectedRoutes;
