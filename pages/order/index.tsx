import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { layouts } from '@/constants/layouts';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

const Order = () => {
  const [layout, setLayout] = useState<keyof typeof layouts.order>('default');
  const router = useRouter();
  const layoutsList = [
    { key: 'default', value: 'default' },
    { key: 'epos', value: 'epos' },
  ];
  const handleChange = (value: string) => {
    setLayout(value as keyof typeof layouts.order);
  };
  const OrderScreen = layouts.order[layout];
  return (
    <>
      <div className=' bg-white'>
        <nav className='border-gray-200 bg-[#f5f6f9] p-4'>
          <div className='mx-auto flex max-w-screen-xl items-center justify-between'>
            <Button
              onClick={() => router.push('/')}
              className='bg-cyan px-5 py-1 text-sm font-medium text-white'
            >
              Main Menu
            </Button>
            <div className='flex flex-row items-center'>
              <ul className='flex space-x-4'>
                <li>
                  <Select value={layout} onValueChange={handleChange}>
                    <SelectTrigger>{layout}</SelectTrigger>
                    <SelectContent>
                      {layoutsList.map((op) => (
                        <SelectItem value={op.key} key={op.key}>
                          {op.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </li>
                <li>Date</li>
              </ul>
            </div>
          </div>
        </nav>
        <OrderScreen />
      </div>
    </>
  );
};

export default Order;
