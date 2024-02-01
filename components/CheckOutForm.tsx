import { OrderData } from '@/types/types';
import { Input } from './ui/input';
import { useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/router';
import en from '@/locales/en';
import ar from '@/locales/ar';

interface CheckOutFormProps {
  orderData: OrderData;
  onUpdateOrderData: (updatedOrderData: OrderData) => void;
  handlePrintBillClick: () => void;
  handleDiscountClick: () => void;
}

const CheckOutForm: React.FC<CheckOutFormProps> = ({
  orderData,
  onUpdateOrderData,
  handlePrintBillClick,
  handleDiscountClick
}) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;
  const [chargedValue, setChargedValue] = useState('');
  const [paymentType, setPaymentType] = useState('');

  const handleDigitButtonClick = (digit: string) => {
    if (digit === '.' && chargedValue.includes('.')) {
      return;
    }

    setChargedValue((prevValue) => prevValue + digit);
  };

  const handleRemoveLastDigit = () => {
    setChargedValue((prevValue) => prevValue.slice(0, -1));
  };
  const handlePaymentTypeClick = (selectedPaymentType: string) => {
    setPaymentType(selectedPaymentType);

    // Update orderData through the prop function
    onUpdateOrderData({
      ...orderData,
      paymentType: selectedPaymentType,
    });
  };
  return (
    <div className=' mt-2 h-[400px] w-[520px] min-h-[400px] min-w-[520px] rounded-xl bg-[#f9f9f9]'>
      <div className='container relative mx-auto'>
        <div className='mx-10 my-2 flex flex-row gap-x-16'>
          <h1 className='mt-2 flex-1 font-bold'>{t.total}:</h1>
          <Input
            className='mx-10 block h-10 w-56 p-2.5'
            value={(
              orderData.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              ) - orderData.discount
            ).toFixed(2)}
            disabled
          />
        </div>
        <div className='mx-10 my-2 flex flex-row gap-x-16'>
          <h1 className='mt-4 font-bold'>{t.charged}:</h1>
          <Input
            onChange={(e) => setChargedValue(e.target.value)}
            className='mx-10 block h-10 w-56 p-2.5'
            value={chargedValue}
            required
          />
        </div>
        <div className='mx-10 my-2 flex flex-row gap-16'>
          <h1 className='mt-4 font-bold'>{t.paymentType}:</h1>
          <div className='flex gap-x-4'>
            <Button
              onClick={() => handlePaymentTypeClick('Cash')}
              className={`h-12 flex-1 rounded-lg px-6 font-semibold text-white ${
                paymentType === 'Cash'
                  ? 'bg-green-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              {t.cash}
            </Button>
            <Button
              onClick={() => handlePaymentTypeClick('Credit')}
              className={`h-12 flex-1 rounded-lg px-6 font-semibold text-white ${
                paymentType === 'Credit'
                  ? 'bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              {t.credit}
            </Button>
          </div>
        </div>
      </div>
      <div className='container mt-2 flex items-center justify-center'>
        <div className='relative flex w-[56.5%] items-center'>
          <Input
            type='search'
            id='search-dropdown'
            className='z-20 ml-2 h-8 w-full rounded-lg p-2.5'
            placeholder=''
            required
          />
        </div>
      </div>

      <div className='container mx-auto mt-1'>
        <div className='mx-2 flex max-w-[500px] flex-wrap justify-center'>
        <div dir='ltr' className='flex max-w-[500px] flex-wrap justify-center'>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('10')}
            className=' mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 bg-[#636363] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            10
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('1')}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            1
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('2')}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            2
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('3')}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            3
          </button>
          <button
            type='button'
            className=' mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 bg-[#3471ff] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            All
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('20')}
            className=' mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 bg-[#636363] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            20
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('4')}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            4
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('5')}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            5
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('6')}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            6
          </button>
          <button
            type='button'
            className=' mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 bg-[#3471ff] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            1/n
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('50')}
            className=' mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 bg-[#636363] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            50
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('7')}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            7
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('8')}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            8
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('9')}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            9
          </button>
          <button
            type='button'
            className=' mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 bg-[#3471ff] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            Split
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('100')}
            className=' mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 bg-[#636363] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            100
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('.')}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            .
          </button>
          <button
            type='button'
            onClick={() => handleDigitButtonClick('0')}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            0
          </button>
          <button
            type='button'
            onClick={handleRemoveLastDigit}
            className=' bg-color-Light mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            X
          </button>
          <button
            type='button'
            className=' mb-2 me-2 h-8 w-20 rounded-lg border border-gray-200 bg-[#3471ff] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            bal
          </button>
          </div>
          <button
          onClick={handleDiscountClick}
            type='button'
            className=' mb-1 me-2 h-8 w-32 rounded-lg border border-gray-200 bg-[#019706] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            {t.discount}%
          </button>
          <button
            type='button'
            className=' mb-1 me-2 h-8 w-32 rounded-lg border border-gray-200 bg-[#ffb534] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            {t.round}
          </button>
          <button
            type='button'
            onClick={handlePrintBillClick}
            className=' mb-1 me-2 h-8 w-32 rounded-lg border border-gray-200 bg-[#ff4155] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
          >
            {t.printBill}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutForm;
