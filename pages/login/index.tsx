import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import React, { FormEventHandler, useState } from 'react';
import Jwt from 'jsonwebtoken';
import { Input } from '@/components/ui/input';
import nookies, { parseCookies, destroyCookie } from 'nookies';
import { API_CONFIG } from '@/constants/api-config';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientPreference } from '@/types/types';

const Login = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async () => {
      let obj = {
        email: userInfo.email,
        password: userInfo.password,
      };
      const fetchResponse = await fetch(
        `${API_CONFIG.BASE_URL}api/Auth/Authenticate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(obj),
        }
      );
      const resp = await fetchResponse.json();
      return resp;
    },
    onError: (error) => {
      console.log('Error', error.message);
    },
    onSuccess: (data) => {
      if(!data.errors){
        setUserCookies(data.response.token, userInfo.email || '', false, data.response.clientPreferences);
        window.location.href = '/';
      }
    },
  });
  // const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
  //   e.preventDefault();

  //   let obj = {
  //     email: userInfo.email,
  //     password: userInfo.password,
  //   };

  //   try {
  //     const fetchResponse = await fetch(
  //       `${API_CONFIG.BASE_URL}api/Auth/Authenticate`,
  //       {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(obj),
  //       }
  //     );
  //     const resp = await fetchResponse.json();
  //     console.log(resp);
  //     if (!fetchResponse.ok) {
  //       if (resp.errors) {
  //         setEmailError(resp.errors.Email);
  //         setPasswordError(resp.errors.Password);
  //       } else {
  //         setEmailError('');
  //         setPasswordError('');
  //       }
  //       setError(resp.response);
  //       throw new Error(`Request failed with status: ${fetchResponse.status}`);
  //     }
  //     const json = Jwt.decode(resp.response) as { [key: string]: string };
  //     setUserCookies(resp.response, userInfo.email || '', false);
  //     router.push('/');
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //   }
  // };
  function setUserCookies(
    //twoFAEnabled: boolean,
    token: string,
    //guid: string,
    username: string,
    //onboarding: string,
    rememberMe: boolean = true,
    clientPreference : ClientPreference
  ) {
    // Set the cookie with an explicit expiration time (e.g., 30 days)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    const DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

    const expiration = rememberMe
      ? {
        maxAge: DAYS_IN_SECONDS, // Cookie will expire in 30 days (in seconds)
        expires: expirationDate, // Sets the explicit expiration date
        path: '/', // Cookie will be accessible from all paths
        secure: true,
        httpOnly: false,
      }
      : {
        path: '/', // Cookie will be accessible from all paths
        secure: true,
        httpOnly: false,
      };

    nookies.set(undefined, 'token', token, expiration);
    //nookies.set(undefined, "guid", guid, expiration);
    nookies.set(undefined, 'username', username, expiration);
    //nookies.set(undefined, "onboarding", onboarding, expiration);
    nookies.set(undefined, 'rememberMe', rememberMe + '', expiration);
    const clientPreferenceString = JSON.stringify(clientPreference);

    nookies.set(undefined, 'clientPreference', clientPreferenceString, expiration);
  }
  return (
    <div className='flex min-h-screen items-center justify-center bg-[#f5f6f9]'>
      <Image
        className='fixed left-0 float-left ml-10 mt-10 hidden h-[450px] md:block'
        src='/public/POS.png'
        alt='image'
        width={100}
        height={100}
      />
      <div className='fixed right-0 flex h-screen w-full flex-col items-center justify-center rounded-bl-2xl rounded-tl-2xl bg-white shadow-md md:w-[500px] dark:bg-gray-900'>
        <div className='w-full max-w-md px-4 py-8 md:px-8 lg:px-16'>
          <h2 className='mb-6 text-left text-3xl text-[#01c1d2]'>
            Login to POS
          </h2>
          <hr className='my-4 border-t border-gray-300' />
          {error && (
            <div
              className='mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400'
              role='alert'
            >
              <span className='font-medium'>Error!</span> {error}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className='mb-6'>
              <Input
                autoFocus
                //endContent={<MailIcon className="text-2xl text-default-400" />}
                onChange={({ target }) =>
                  setUserInfo({ ...userInfo, email: target.value })
                }
                type='text'
                placeholder='Enter your email'
              />
            </div>
            <div className='mb-6'>
              <Input
                onChange={({ target }) =>
                  setUserInfo({ ...userInfo, password: target.value })
                }
                placeholder='Enter your password'
                type='password'
              />
              {/* <div className="flex items-center justify-between mt-2">
                <Checkbox className="text-sm">Remember me</Checkbox>
                <Link color="primary" href="#" size="sm">
                  Forgot password?
                </Link>
              </div> */}
            </div>
            <div className='grid'>
              <Button variant='secondary' isLoading={isPending} disabled={isPending} type='submit'>
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
