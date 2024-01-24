import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Inter } from 'next/font/google';
import React from 'react';
import { parseCookies } from 'nookies';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/router';
import en from '@/locales/en';
import ar from '@/locales/ar';
import NavBar from '@/components/header/NavBar';
import { ClientPreference } from '@/types/types';
const inter = Inter({ subsets: ['latin'] });

const themes = [
  { code: 'default', translateKey: 'default' },
  { code: 'dark', translateKey: 'dark' },
];
export default function Home() {
  const cookies = parseCookies();
  const logedinuser = cookies.username;
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;

  const { resolvedTheme, theme, setTheme } = useTheme();
  const [date, setDate] = React.useState<Date>();
  const changeTheme = (theme: string) => {
    document.querySelector('html')?.setAttribute('data-theme', theme);
  };
  
  return (
    <>
      <NavBar />
      <div
        className='direction-rtl flex h-screen w-full max-w-full items-center justify-center'
      >
        <div className='place-items-center'>
          <div>
            <Button
              className='m-2 px-8 py-2'
              onClick={() => changeTheme('default')}
            >
              default
            </Button>
            <Button
              className='m-2 px-8 py-2'
              onClick={() => changeTheme('dark')}
              isLoading = {true}
            >
              dark
            </Button>
          </div>
          <div className='flex flex-row gap-3'>
            {/* <Select
            value={locale}
            onValueChange={(newValue) => {
              route.push('', undefined, {
                locale: newValue,
              }).then(() => {
                //route.reload();
              });
            }}
          >
            <SelectTrigger>
              {languages.find((op) => op.code === locale)?.translateKey}
            </SelectTrigger>
            <SelectContent>
              {languages.map((op) => (
                <SelectItem value={op.code} key={op.code}>
                  {op.translateKey}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

            <Select
              value={theme}
              onValueChange={(newValue) => {
                changeTheme(newValue);
              }}
            >
              <SelectTrigger>{theme}</SelectTrigger>
              <SelectContent>
                {themes.map((op) => (
                  <SelectItem value={op.code} key={op.code}>
                    {op.translateKey}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='grid gap-8'>
          <DatePicker date={date} setDate={setDate} />
          <Button variant='destructive'>hello</Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className='w-[180px]'></DropdownMenuTrigger>
          <DropdownMenuContent>
            {themes.map((theme, index) => (
              <DropdownMenuItem
                onChange={() => changeTheme(theme.code)}
                onSelect={() => changeTheme(theme.code)}
                key={index}
                defaultChecked={theme.code == 'default'}
              >
                {theme.translateKey}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div>
          {/* {languages.map((language) => (
          <button
            data-id={`${language.code}-button`}
            className={i18n.language === language.code ? 'active' : undefined}
            onClick={() => changeLanguage(language.code)}
            key={language.code}
          >
            {t(language.translateKey)}
          </button>
        ))} */}
        </div>
        <div>
          <h1 className='text-shadow px-8 text-center text-5xl font-bold text-white'>
            {t.welcome}
          </h1>
          <br />
          <div></div>
        </div>
      </div>
    </>
  );
}
