import { OrderData } from '@/types/types';
import { Input } from './ui/input';
import { useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/router';
import en from '@/locales/en';
import ar from '@/locales/ar';

interface CheckOutFormProps {
  orderData: OrderData;
  setOrderData: (orderData: OrderData) => void;
  setMiddleComponent : (middleComponent : string) => void;

}

const TicketNote: React.FC<CheckOutFormProps> = ({
  orderData,
  setOrderData,
  setMiddleComponent,
}) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;
  const [ticketNote, setTicketNote] = useState('');
  return (
    <div className='relative mt-2 h-[400px] w-[520px] rounded-xl bg-[#f9f9f9]'>
      <div className='container relative mx-auto flex h-full flex-col justify-end'>
        <div className='mx-10 my-10 flex items-center justify-center gap-16'>
          <Input
            value={ticketNote}
            onChange={(e) => {
              setTicketNote(e.target.value);
            }}
            className='absolute right-0 top-0 mx-8 mt-4 block h-14 w-[450px] p-2.5'
          />
          <div className='absolute bottom-0 flex w-full justify-between p-4'>
            <Button
              onClick={() => {
                setOrderData({
                  ...orderData,
                  note: ticketNote,
                });
                setMiddleComponent('')
              }}
              variant='default'
              className='w-36'
            >
              {t.add}
            </Button>
            <Button onClick={() => setMiddleComponent('')} variant='destructive' className='w-36'>
              {t.close}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketNote;
