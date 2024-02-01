import { Customer, OrderData, OrderItem } from '@/types/types';
import { Button } from './ui/button';
import { useRouter } from 'next/router';
import en from '@/locales/en';
import ar from '@/locales/ar';
import { XOctagon } from 'lucide-react';
interface OrderSummaryProps {
  orderData: OrderData;
  handleQuantityChange: (index: number, quantity: number) => void;
  handleRemoveItemClick: (index: number) => void;
  handleSettleClick: () => void;
  handleCloseClick: () => void;
}

const Cart: React.FC<OrderSummaryProps> = ({
  orderData,
  handleQuantityChange,
  handleRemoveItemClick,
  handleSettleClick,
  handleCloseClick,
}) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;
  return (
    <div className='mt-2 h-[410px] min-h-[410px] w-[500px] min-w-[500px]'>
      <div className='container relative mx-auto'>
        <div className='flex h-[365px] w-full flex-col justify-between rounded-xl bg-light'>
          <div className='relative overflow-x-auto sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400'>
              <thead className='bg-gray text-xs text-gray-900'>
                <tr className='flex items-center gap-40'>
                  <th scope='col' className='py-3 px-2 pl-2'>
                    <div className='w-36'>{t.table}: {orderData.tableNumber}</div>
                    {orderData.customer?.name && (
                      <div className='w-36'>Customer : {orderData.customer?.name}</div>
                    )}
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    {t.status}: New
                  </th>
                </tr>
              </thead>
              <tbody className='flex flex-col text-gray-900'>
                {orderData.items.map((item, index) => (
                  <tr className='flex flex-row gap-x-4' key={index}>
                    <td className='py-1 w-[100px] px-3 font-medium'>
                      <div className='flex items-center'>
                        <button
                          onClick={() =>
                            handleQuantityChange(index, item.quantity - 1)
                          }
                          className='bg-gray-200 px-2 py-1 text-gray-700'
                        >
                          -
                        </button>
                        {item.quantity}
                        <button
                          onClick={() =>
                            handleQuantityChange(index, item.quantity + 1)
                          }
                          className='bg-gray-200 px-2 py-1 text-gray-700'
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className='flex font-medium w-[170px]'>
                      {item.subCategoryName} ({item.itemName})
                    </td>
                    <td className='flex items-start  px-2 py-1 gap-2'>
                      {item.price}
                      <button
                        onClick={() => handleRemoveItemClick(index)}
                        className='ml-2 bg-red-500 px-2 py-1 text-white'
                      >
                        <XOctagon size={18} color="white" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            {orderData.note && (
              <div className='text-bg-cyan-foreground overflow-y-auto rounded-lg bg-cyan text-xs'>
                <div className='flex flex-row font-semibold'>
                  <div className='px-6 py-2 text-base'>{t.note}:</div>
                  <div className='py-2 text-base'>{orderData.note}</div>
                </div>
              </div>
            )}
            <div className='rounded-lg bg-gray text-xs text-white'>
              <div className='flex items-end gap-60 space-x-2 font-semibold'>
                <div className='px-6 py-1 text-base'>{t.total}</div>
                <div className='mr-5 px-6 py-2'>
                  {orderData.items
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-2 flex items-end gap-44 space-x-2'>
          <Button
            type='button'
            onClick={handleSettleClick}
            className='text-bg-light-foreground h-[30px] w-32 rounded-sm bg-light'
          >
            {t.settle}
          </Button>
          <Button
            type='button'
            onClick={handleCloseClick}
            className='text-bg-light-foreground h-[30px] w-32 rounded-sm bg-destructive px-5 text-sm'
          >
            {t.close}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
