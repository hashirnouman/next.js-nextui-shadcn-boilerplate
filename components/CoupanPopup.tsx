import { Customer } from '@/types/types';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface CustomerPopupProps {
  customerData: Customer[];
  handleApplyCoupon: (couponCode: string) => void;
  setIsCouponPopupOpen: (isOpen: boolean) => void;
  couponError: string;
}

const CouponPopup: React.FC<CustomerPopupProps> = ({
  customerData,
  handleApplyCoupon,
  setIsCouponPopupOpen,
  couponError,
}) => {
  const [couponCode, setCouponCode] = useState('');

  const handleNumberClick = (num: number) => {
    // Append the clicked number to the current couponCode
    setCouponCode((prevCode) => prevCode + num.toString());
  };

  const handleBackspaceClick = () => {
    // Remove the last digit from the couponCode
    setCouponCode((prevCode) => prevCode.slice(0, -1));
  };

  const handleClearClick = () => {
    // Clear the couponCode
    setCouponCode('');
  };

  return (
    <div className='customer-popup'>
      <div
        id='default-modal'
        className='fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform p-4 md:p-5'
      >
        <div className='relative max-h-full w-full max-w-2xl p-4'>
          {/* Modal content */}
          <div className='relative bg-background'>
            {/* Modal header */}
            <div className='flex items-center justify-between rounded-t p-2 md:p-3'>
              <h1 className=' font-bold'>Enter Coupon Value</h1>
              <button
                type='button'
                onClick={() => setIsCouponPopupOpen(false)}
                className='ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-black hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
                data-modal-hide='default-modal'
              >
                <svg
                  className='h-3 w-3'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className='space-y-4 p-4 md:p-5'>
              <div className='scrollbar-hide flex max-h-[500px] flex-col justify-center gap-4 overflow-x-auto'>
                <Input value={couponCode} readOnly />
                {couponError && (
                  <div className='text-red-500'>{couponError}</div>
                )}
                <div className='grid grid-cols-3 gap-2'>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                      key={num}
                      variant='default'
                      onClick={() => handleNumberClick(num)}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button variant='default' onClick={handleClearClick}>
                    Clear
                  </Button>
                  <Button variant='default' onClick={() => handleNumberClick(0)}>
                    0
                  </Button>
                  <Button variant='default' onClick={handleBackspaceClick}>
                    Backspace
                  </Button>
                  <Button variant='destructive' onClick={() => setIsCouponPopupOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant='default'
                    onClick={() => handleApplyCoupon(couponCode)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponPopup;
