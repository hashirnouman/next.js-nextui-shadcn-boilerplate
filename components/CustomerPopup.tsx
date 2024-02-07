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
    <div className='customer-popup fixed inset-0 flex items-center justify-center'>
      <div className='fixed z-50 h-auto w-full max-w-2xl p-4 md:p-5 bg-white rounded-lg shadow-lg'>
        {/* Modal content */}
        <div className='relative max-h-full w-full max-w-2xl p-4'>
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
            <div className='scrollbar-hide flex max-h-[400px] flex-row justify-center gap-4 overflow-x-auto'>
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
  );
};

export default CustomerPopup;
