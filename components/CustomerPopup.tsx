import { Customer } from '@/types/types';
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableFooter,
} from '@/components/ui/table';
import { Button } from './ui/button';

interface CustomerPopupProps {
  customerData: Customer[];
  onAddCustomer: (customer: Customer) => void;
  setIsCustomerPopupOpen: (isOpen: boolean) => void;
}

const CustomerPopup: React.FC<CustomerPopupProps> = ({
  customerData,
  onAddCustomer,
  setIsCustomerPopupOpen,
}) => {
  return (
    <div className='customer-popup'>
      <div
        id='default-modal'
        className='fixed left-1/2 top-1/2 z-50 h-auto w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform p-4 md:p-5'
      >
        <div className='relative max-h-full w-full max-w-2xl p-4'>
          {/* Modal content */}
          <div className='relative bg-background'>
            {/* Modal header */}
            <div className='flex items-center justify-between rounded-t p-2 md:p-3'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <button
                type='button'
                onClick={() => setIsCustomerPopupOpen(false)}
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
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className='space-y-4 p-4 md:p-5'>
              <div className='scrollbar-hide flex max-h-[100px] flex-row justify-center gap-4 overflow-x-auto'>
                <Table>
                  <TableBody>
                    {customerData.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>
                          <Button onClick={() => onAddCustomer(customer)}>
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPopup;
