import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
const Logout = () => null;
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookieOptions = {
    httpOnly: false,
    maxAge: 0,
  };
  nookies.set(context, 'token', '', cookieOptions);
  nookies.set(context, 'username', '', cookieOptions);
  nookies.set(context, 'rememberMe', '', cookieOptions);
  nookies.set(context, 'clientPreference', '', cookieOptions);

  // Redirect to login page
  return {
    redirect: {
      destination: '/',
    },
  };
};

export default Logout;
