import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Inter } from 'next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });
export default function Home() {
  const [date, setDate] = React.useState<Date>();
  console.log(date)
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='grid gap-8'>
        <DatePicker date={date} setDate={setDate} />
        <Button variant='destructive'>hello</Button>
      </div>
    </div>
  );
}
