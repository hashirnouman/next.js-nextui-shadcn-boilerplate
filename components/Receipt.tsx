import React, { useEffect, useState } from 'react';
import {
  OrderData,
  Customer,
  OrderItem,
  ClientPreference,
} from '@/types/types';
import { parseCookies } from 'nookies';
//import './Receipt.css'; // Import your stylesheet

interface ReceiptProps {
  orderData: OrderData;
}

const Receipt: React.ForwardRefRenderFunction<any, ReceiptProps> = (
  { orderData },
  ref
) => {
  const cookies = parseCookies();
  const [logo, setLogo] = useState('');
  useEffect(() => {
    const clientPreferenceString = cookies.clientPreference || '{}';
    const clientPreference: ClientPreference = JSON.parse(
      clientPreferenceString
    );
    setLogo(clientPreference.logo);
  }, []);
  return (
    <div
      ref={ref}
      className=' mx-auto w-[300px] max-w-md border border-gray-300 bg-white p-4 shadow-md'
    >
      {/* Restaurant Logo */}
      <div className='flex justify-center'>
        <div className='mb-4 flex w-28 items-center justify-center rounded-full'>
          <img
            src={logo}
            alt='Restaurant Logo'
            className='h-auto max-w-full rounded-full'
          />
        </div>
      </div>
      {/* Customer Details */}
      {orderData.customer ? (
        <div>
          <table className='w-full'>
            <tbody>
              <tr className='flex'>
                <td className='flex-1'>
                  <h2 className='text-xl font-bold'>
                    {orderData.customer.name}
                  </h2>
                </td>
                <td>
                  <p>Lebanita</p>
                </td>
              </tr>
              <tr className='flex'>
                <td className='flex-1'>
                  <p>Phone: {orderData.customer.phone}</p>
                </td>
                <td>
                  <p>03004002525</p>
                </td>
              </tr>
              <tr className='flex'>
                <td className='flex-1'>
                  <p>Address: {orderData.customer.address}</p>
                </td>
                <td>
                  <p>Sunderland Uk</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className='flex'>
          <div className='flex-1'>
            <img
              src={logo}
              alt='Image'
              className=' h-20 w-20 max-w-full rounded-full'
            />
          </div>
          <div>
            <table className='w-full'>
              <tbody>
                <tr>
                  <td>
                    <p>Lebanita</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>03004002525</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Sunderland Uk</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className='order-details mt-4'>
        <h3 className='mb-2 text-lg font-bold'>Order Details</h3>
        <table className='mb-4 w-full'>
          <thead>
            <tr className='border-b'>
              <th className='py-2'>Qty</th>
              <th>Item</th>
              <th className='py-2'>Price</th>
              <th className='py-2'>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderData.items.map((item, index) => (
              <tr key={index} className='border-b'>
                <td className='py-2'>{item.quantity}</td>
                <td>
                  {item.subCategoryName} - {item.itemName}
                </td>
                <td className='py-2'>${item.price.toFixed(2)}</td>
                <td className='py-2'>
                  ${(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className='total text-right text-lg font-bold'>
          <h4>Total: ${calculateTotal(orderData.items).toFixed(2)}</h4>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate the total amount
const calculateTotal = (items: OrderItem[]) => {
  return items.reduce((total, item) => total + item.quantity * item.price, 0);
};

export default React.forwardRef(Receipt);
