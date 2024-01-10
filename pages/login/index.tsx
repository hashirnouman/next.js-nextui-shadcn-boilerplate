import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router';
import React, { FormEventHandler, useState } from 'react'
import Jwt from "jsonwebtoken";
import { Input } from '@/components/ui/input';
import nookies, { parseCookies, destroyCookie } from "nookies";
import { API_CONFIG } from '@/constants/api-config';

const index = () => {
    const router = useRouter();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    let obj = {
      "email": userInfo.email,
      "password": userInfo.password
    }

    try {
      const fetchResponse = await fetch(`${API_CONFIG.BASE_URL}api/Auth/Authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      });
      const resp = await fetchResponse.json();
      console.log(resp);
      if (!fetchResponse.ok) {
        debugger;
        if(resp.errors){
          setEmailError(resp.errors.Email)
          setPasswordError(resp.errors.Password)
        }
        else{
          setEmailError('');
          setPasswordError('');
        }
        setError(resp.response)
        throw new Error(`Request failed with status: ${fetchResponse.status}`);
      }
      const json = Jwt.decode(resp.response) as { [key: string]: string };
      setUserCookies(
        resp.response,
        userInfo.email || "",
        false
      );
      router.push('/');
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  function setUserCookies(
    //twoFAEnabled: boolean,
    token: string,
    //guid: string,
    username: string,
    //onboarding: string,
    rememberMe: boolean = true
  ) {
    // Set the cookie with an explicit expiration time (e.g., 30 days)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
  
    const DAYS_IN_SECONDS = 30 * 24 * 60 * 60;
  
    const expiration = rememberMe
      ? {
          maxAge: DAYS_IN_SECONDS, // Cookie will expire in 30 days (in seconds)
          expires: expirationDate, // Sets the explicit expiration date
          path: "/", // Cookie will be accessible from all paths
          secure: true,
          httpOnly: false,
        }
      : {
          path: "/", // Cookie will be accessible from all paths
          secure: true,
          httpOnly: false,
        };
        
        
    nookies.set(undefined, "token", token, expiration);
    //nookies.set(undefined, "guid", guid, expiration);
    nookies.set(undefined, "username", username, expiration);
    //nookies.set(undefined, "onboarding", onboarding, expiration);
    nookies.set(undefined, "rememberMe", rememberMe + "", expiration);
  }
  return (
    <div className='bg-[#f5f6f9] min-h-screen flex items-center justify-center'>
      <img className='hidden md:block float-left mt-10 ml-10 fixed left-0 h-[450px]' src='/POS.png' />
      <div className='bg-white dark:bg-gray-900 rounded-tl-2xl rounded-bl-2xl shadow-md w-full md:w-[500px] h-screen fixed right-0 items-center justify-center flex flex-col'>
        <div className="py-8 px-4 md:px-8 lg:px-16 max-w-md w-full">
          <h2 className="text-3xl mb-6 text-left text-[#01c1d2]">Login to POS</h2>
          <hr className="my-4 border-t border-gray-300" />
          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <span className="font-medium">Error!</span> {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Input
                autoFocus
                //endContent={<MailIcon className="text-2xl text-default-400" />}
                onChange={({ target }) => setUserInfo({ ...userInfo, email: target.value })}
                type="text"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <Input
                onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })}
                placeholder="Enter your password"
                type="password"
              />
              {/* <div className="flex items-center justify-between mt-2">
                <Checkbox className="text-sm">Remember me</Checkbox>
                <Link color="primary" href="#" size="sm">
                  Forgot password?
                </Link>
              </div> */}
            </div>
            <div className="grid">
            <Button variant='secondary' type="submit">
              Login
            </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default index