import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Category, Item, SubCategory } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { API_CONFIG } from '@/constants/api-config';
import { useRouter } from 'next/router';

const Order = () => {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [subCategoryData, setSubCategoryData] = useState<SubCategory[]>([]);
  const [itemData, setItemData] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    tableNumber: 'A1',
    status: 'New',
    items: [] as Array<{
      itemId: number;
      itemName: string;
      price: number;
      quantity: number;
      subCategoryName: string;
    }>,
  });
  const { toast } = useToast();
  const router = useRouter();
  const getCategoryData = () => {
    axios
      .get(`${API_CONFIG.BASE_URL}api/Category`)
      .then((response) => {
        setCategoryData(response.data);
        debugger;
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getSubCategoryData = (id = 0) => {
    axios
      .get(
        `${API_CONFIG.BASE_URL}api/SubCategory/GetSubCategoriesByCategoryId?categoryId=${id}`
      )
      .then((response) => {
        setSubCategoryData(response.data);
        debugger;
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getItemData = (id = 0) => {
    axios
      .get(
        `${API_CONFIG.BASE_URL}api/Item/GetItemsBySubCategoryId?subCategoryId=${id}`
      )
      .then((response) => {
        setItemData(response.data);
        debugger;
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getCategoryData();
  }, []);
  const handleCategoryClick = (categoryId: number) => {
    getSubCategoryData(categoryId);
  };
  const handleSubCategoryClick = (subCategoryId: number) => {
    getItemData(subCategoryId);
    setIsModalOpen(true);
  };

  const handleItemClick = (item: Item) => {
    const existingItemIndex = orderData.items.findIndex(
      (orderItem) => orderItem.itemId === item.id
    );

    if (existingItemIndex !== -1) {
      setOrderData((prevOrderData) => {
        const updatedItems = [...prevOrderData.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...prevOrderData, items: updatedItems };
      });
    } else {
      setOrderData((prevOrderData) => ({
        ...prevOrderData,
        items: [
          ...prevOrderData.items,
          {
            itemId: item.id,
            itemName: item.name,
            price: item.price,
            quantity: 1,
            subCategoryName: item.subCategoryName,
          },
        ],
      }));
    }
  };
  const handleSettleClick = async () => {
    try {
      debugger;
      const apiRequestData = {
        id: 0,
        tableNumber: orderData.tableNumber,
        status: orderData.status,
        orderDetails: orderData.items.map((item) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          price: item.price,
          quantity: item.quantity,
          subCategoryName: item.subCategoryName,
        })),
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}api/Order`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequestData),
      });
      var result = await response.json();
      if (result.color === 'success') {
        setOrderData({
          tableNumber: 'A1',
          status: 'New',
          items: [],
        });
        setIsModalOpen(false);
        toast({
          title: result.management,
          description: result.msg,
        });
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseClick = () => {
    setOrderData({
      tableNumber: 'A1',
      status: 'New',
      items: [],
    });
    setIsModalOpen(false);
  };
  const handleQuantityChange = (index: number, newQuantity: number) => {
    setOrderData((prevOrderData) => {
      const updatedItems = [...prevOrderData.items];
      updatedItems[index].quantity = newQuantity;
      return { ...prevOrderData, items: updatedItems };
    });
  };

  const handleRemoveItemClick = (index: number) => {
    setOrderData((prevOrderData) => {
      const updatedItems = [...prevOrderData.items];
      updatedItems.splice(index, 1);
      return { ...prevOrderData, items: updatedItems };
    });
  };
  return (
    <>
      <div className=' bg-white'>
        <nav className='border-gray-200 bg-[#f5f6f9] p-4'>
          <div className='mx-auto flex max-w-screen-xl items-center justify-between'>
            <Button onClick={() => router.push('/')} className='bg-cyan px-5 py-1 text-sm font-medium text-white'>
              Main Menu
            </Button>
            <div id='navbar-default'>
              <ul>
                <li>Date</li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='bg-[#efefef] px-1'>
          <div className='scrollbar-hide flex max-h-[100px] flex-row gap-4 overflow-x-auto'>
            {categoryData.map((item) => (
              <div
                key={item.id}
                className=' my-2 flex w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-cyan shadow-md'
                onClick={() => handleCategoryClick(item.id)}
              >
                <img
                  src={item.pic}
                  alt={item.name}
                  className='mt-2 h-10 w-10 object-cover'
                />
                <div className='p-1'>
                  <h3 className='text-center font-bold text-white'>
                    {item.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='flex h-full flex-row items-start justify-start gap-16'>
          <div className='ml-10 mt-2 flex h-full flex-col'>
            <Button className='mb-4 flex h-16 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-yellow text-yellow-foreground shadow-md'>
              Change Table
            </Button>
            <Button className='mb-4 flex h-16 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-primary text-primary-foreground shadow-md'>
              Select Customer
            </Button>
            <Button className='mb-4 flex h-16 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-gray text-gray-foreground shadow-md'>
              Ticket Note
            </Button>
            <Button
              variant='destructive'
              className='mb-4 flex h-16 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border shadow-md'
            >
              Print bill
            </Button>
            <Button className='mb-4 flex h-16 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-light text-light-foreground shadow-md'>
              Add ticket
            </Button>
          </div>
          <div className=' mt-2 h-[430px] w-[500px] rounded-xl bg-[#f9f9f9]'>
            <div className='container mx-auto mt-1'>
              <div className='scrollbar-hide flex max-h-[210px] flex-wrap justify-center gap-2 gap-x-6 overflow-x-auto'>
                {subCategoryData.map((item) => (
                  <div
                    key={item.id}
                    className='w-32 overflow-hidden border shadow-md'
                    onClick={() => handleSubCategoryClick(item.id)}
                  >
                    <img
                      src={item.pic}
                      alt={item.name}
                      className='h-16 w-full object-cover'
                    />
                    <div>
                      <h4 className='text-center font-bold'>{item.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='container mx-auto mt-1'>
              <div className='mr-2 flex flex-row gap-12'>
                <div className='relative ml-6 flex w-[56.5%] items-center'>
                  <Input
                    type='search'
                    id='search-dropdown'
                    className='z-20 ml-2 block h-8 w-full rounded-bl-lg rounded-tl-lg p-2.5 sm:text-xs'
                    placeholder=''
                    required
                  />
                  <button
                    type='submit'
                    className=' h-8 rounded-e-lg bg-[#bebebe] px-3 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                  >
                    <svg
                      className='h-4 w-4'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 20 20'
                    >
                      <path
                        stroke='currentColor'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='2'
                        d='m6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>

                <button
                  type='button'
                  className=' bg-color-Cyan h-8 w-28 rounded-lg border border-gray-200 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  Enter
                </button>
              </div>
            </div>
            <div className='mx-auto mt-1'>
              <div className='mx-2 flex max-w-[500px] flex-wrap justify-center gap-x-10'>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  1
                </button>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  2
                </button>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  3
                </button>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  4
                </button>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  5
                </button>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  6
                </button>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  7
                </button>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  8
                </button>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  9
                </button>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  .
                </button>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  0
                </button>
                <button
                  type='button'
                  className=' bg-color-Light mb-2 me-2 h-8 w-28 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  '
                >
                  X
                </button>
              </div>
            </div>
          </div>
          <div className='mt-2 h-[430px] w-[500px]'>
            <div className='container relative mx-auto'>
              <div className='flex h-[385px] w-full flex-col justify-between rounded-xl bg-light'>
                <div className='relative overflow-x-auto sm:rounded-lg'>
                  <table className='w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400'>
                    <thead className='bg-gray text-xs text-gray-900'>
                      <tr>
                        <th scope='col' className='px-6 py-3'>
                          Table: A1
                        </th>
                        <th scope='col' className='absolute right-0 px-6 py-3'>
                          Status: New
                        </th>
                      </tr>
                    </thead>
                    <tbody className='text-gray-900'>
                      {orderData.items.map((item, index) => (
                        <tr key={index}>
                          <th
                            className='pl-6 py-1 font-medium'
                          >
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
                            
                          </th>
                          <th className=' pr-20 left-0 font-medium'>
                          {item.subCategoryName} ({item.itemName})
                          </th>
                          <td className='absolute right-0 mr-5 px-2 py-1'>
                            {item.price}
                            <button
                              onClick={() => handleRemoveItemClick(index)}
                              className='ml-2 bg-red-500 px-2 py-1 text-white'
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className=' rounded-lg bg-gray text-xs text-white'>
                  <div className='flex flex-row font-semibold'>
                    <div className='px-6 py-1 text-base'>Total</div>
                    <div className='absolute right-0 mr-5 px-6 py-2'>
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

              <Button
                type='button'
                onClick={handleSettleClick}
                className='bg-light text-bg-light-foreground mb-2 me-2 mt-1 h-[30px] w-32 rounded-sm'
              >
                Settle
              </Button>
              <Button
                type='button'
                onClick={handleCloseClick}
                className='bg-destructive text-bg-light-foreground absolute right-0 mb-2 me-2 mt-1 h-[30px] w-32 rounded-sm px-5 text-sm'
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          id='default-modal'
          className='fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform p-4 md:p-5'
        >
          <div className='relative max-h-full w-full max-w-2xl p-4'>
            {/* Modal content */}
            <div className='relative bg-background'>
              {/* Modal header */}
              <div className='flex items-center justify-between rounded-t p-2 md:p-3'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
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
                  {itemData.map((item) => (
                    <div
                      key={item.id}
                      className=' my-2 flex h-20 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-cyan shadow-md'
                      onClick={() => handleItemClick(item)}
                    >
                      <div className='flex flex-col p-1'>
                        <h3 className='text-center font-bold text-white'>
                          {item.name}
                        </h3>
                        <h4 className='text-center font-bold text-white'>
                          {'(' + item.price + ')'}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Order;
