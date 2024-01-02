import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Inter } from 'next/font/google';
import React from 'react';
import { useTranslation, } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const inter = Inter({ subsets: ['latin'] });

const languages = [
  { code: 'en', translateKey: 'english' },
  { code: 'pt', translateKey: 'portuguese' },
  { code: 'es', translateKey: 'spanish' },
]
export default function Home() {
  const [date, setDate] = React.useState<Date>();
  const { t, i18n, } = useTranslation('common')
  const changeLanguage = (language: string) => {

    i18n.changeLanguage(language)
  }

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='grid gap-8'>
        <DatePicker date={date} setDate={setDate} />
        <Button variant='destructive'>hello</Button>
      </div>
      <Select>
        <SelectTrigger className="w-[180px]">
      
        </SelectTrigger>
        <SelectContent>
          {languages.map((language, index) => (
            <SelectItem onSelect={() => changeLanguage(language.code)} key={index} value={language.code} defaultChecked={language.code == 'en'}  >{t(language.translateKey)}</SelectItem>
          ))}


        </SelectContent>
      </Select>
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
      <div>{t('welcome')}</div>
    </div>
  );
}
