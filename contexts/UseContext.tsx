import { updateClientPreference } from '@/services/clientPreference';
import { ClientPreference } from '@/types/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { parseCookies, setCookie } from 'nookies';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UseContextType = {
  lang: string;
  changeLanguage: (dir: string) => void;
  theme : string;
  changeTheme: (theme: string) => void;
};

const UseContext = createContext<UseContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const cookies = parseCookies();
  const [direction, setDirection] = useState('ltr');
  const [lang, setLang] = useState('en');

  const [theme, setTheme] = useState<string>('default');

  useEffect(() => {
    getCookies();
  }, []); // Run only on mount

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const getCookies = () => {
    const clientPreferenceString = cookies.clientPreference || '{}';
    const clientPreference: ClientPreference = JSON.parse(clientPreferenceString);
    setTheme(clientPreference.theme || 'default');
    if(clientPreference.language === 'ar'){
      setDirection('rtl');
    }
    else{
      setDirection('ltr');
    }
    router.push(router.pathname, router.asPath, { locale: clientPreference.language });
  };
  const changeLanguage = (lang: string) => {
    setLang(lang);
    if(lang === 'ar'){
      setDirection('rtl');
    }
    else{
      setDirection('ltr');
    }
    router.push(router.pathname, router.asPath, { locale: lang });
    const clientPreferenceString = cookies.clientPreference || '{}';
    const clientPreference: ClientPreference = JSON.parse(clientPreferenceString);
    clientPreference.language = lang;
    setCookie(undefined, 'clientPreference', JSON.stringify(clientPreference), {
      path: '/',
      secure: true,
      httpOnly: false,
    });
    updateDb({ id: clientPreference.id, theme: '', language: lang });
  };
  const changeTheme = (theme: string) => {
    setTheme(theme);
    const clientPreferenceString = cookies.clientPreference || '{}';
    const clientPreference: ClientPreference = JSON.parse(clientPreferenceString);
    clientPreference.theme = theme;
    setCookie(undefined, 'clientPreference', JSON.stringify(clientPreference), {
      path: '/',
      secure: true,
      httpOnly: false,
    });
    updateDb({ id: clientPreference.id, theme: clientPreference.theme, language: '' });
  };
  const { mutate: updateDb } = useMutation({
    mutationFn: async ({ id, theme, language }: { id: number; theme: string; language: string }) => {
      const result = await updateClientPreference(id, theme, language);
      return result;
    },
    onError: (error) => {
      console.log('Error', error.message);
    },
    onSuccess: (data) => {
    },
  });
  
  return (
    <UseContext.Provider value={{ lang, changeLanguage, theme, changeTheme }}>
      {children}
    </UseContext.Provider>
  );
};

export const Context = () => {
  const context = useContext(UseContext);
  if (!context) {
    throw new Error('Context must be used within a ContextProvider');
  }
  return context;
};
