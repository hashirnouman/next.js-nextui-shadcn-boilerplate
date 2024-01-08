import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import en from '@/locales/en';
import fr from '@/locales/ar';
import Nav from '@/components/Nav';
//import ViewSource from '../components/github';
const index = () => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : fr;
  return (
    <>
    <Nav />
    <div>
        <h1>
            {locale}
        </h1>
        <br />
    <h1 className="text-5xl text-white text-shadow font-bold px-8 text-center">
            {t.welcome}
          </h1>
    </div>
    </>
  )
}

export default index