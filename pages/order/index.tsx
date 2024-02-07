import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { layouts } from '@/constants/layouts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import axios from 'axios';
import {
  Category,
  Customer,
  Floor,
  Item,
  OrderData,
  SubCategory,
  Table,
} from '@/types/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { API_CONFIG } from '@/constants/api-config';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CheckOutForm from '@/components/CheckOutForm';
import CustomerPopup from '@/components/CustomerPopup';
import { useReactToPrint } from 'react-to-print';
import Receipt from '@/components/Receipt';
import CouponPopup from '@/components/CoupanPopup';
import { getCouponByCode } from '@/services/order';
import {
  getFloors,
  getTables
} from '@/services/floorTable';
import TicketNote from '@/components/TicketNote';
import OrderItemSection from '@/components/OrderItemsSection';
import Cart from '@/components/Cart';
import en from '@/locales/en';
import ar from '@/locales/ar';
import SelectTable from '@/components/SelectTable';
const Order = () => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;
  const printRef = useRef<any>(null);

  const [layout, setLayout] = useState<keyof typeof layouts.order>('default');
  const layoutsList = [
    { key: 'default', value: 'default' },
    { key: 'epos', value: 'epos' },
  ];
  const handleChange = (value: string) => {
    setLayout(value as keyof typeof layouts.order);
  };
  const OrderScreen = layouts.order[layout];

  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [subCategoryData, setSubCategoryData] = useState<SubCategory[]>([]);
  const [itemData, setItemData] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [tabIndex, setTabIndex] = useState(0);
  const [orderData, setOrderData] = useState<OrderData>({
    tableNumber: '',
    status: 'New',
    paymentType: '',
    items: [],
    discount: 0,
    note: '',
  });
  const [middleComponent, setMiddleComponent] = useState('');
  const [isCustomerPopupOpen, setIsCustomerPopupOpen] = useState(false);
  const [isCouponPopupOpen, setIsCouponPopupOpen] = useState(false);
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [couponError, setCouponError] = useState('');
  const [floorData, setFloorData] = useState<Floor[]>([]);
  const [selectTableOpen, setSelectTableOpen] = useState(false);
  const [tableData, setTableData] = useState<Table[]>([]);
  const { toast } = useToast();
  const getCategoryData = () => {
    axios
      .get(`${API_CONFIG.BASE_URL}api/Category`)
      .then((response) => {
        setCategoryData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getCustomerData = () => {
    axios
      .get(`${API_CONFIG.BASE_URL}api/Customer`)
      .then((response) => {
        setCustomerData(response.data);
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
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getCategoryData();
    getFloorData();
    getTableData('0');
  }, []);
  const handleCategoryClick = (categoryId: number) => {
    getSubCategoryData(categoryId);
    setSelectedCategory(
      categoryData.find((category) => category.id === categoryId) || null
    );
    setTabIndex(1);
    setItemData([]);
  };

  const handleSubCategoryClick = (subCategoryId: number) => {
    getItemData(subCategoryId);
    //setIsModalOpen(true);
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
  const handleSelectCustomerClick = () => {
    getCustomerData();
    setIsCustomerPopupOpen(true);
  };
  const handleAddCustomer = (customer: Customer) => {
    setOrderData((prevOrderData) => {
      return {
        ...prevOrderData,
        customer: customer,
      };
    });

    setIsCustomerPopupOpen(false);
  };
  const handleApplyCoupon = async (couponCode: string) => {
    var response = await getCouponByCode(couponCode);

    if (!response.ok) {
      setCouponError('Coupon code is not valid.');
    } else {
      setCouponError('');
      const couponData = await response.json();
      let discountAmount = 0;
      if (couponData.type === 'pound') {
        discountAmount = parseFloat(couponData.couponValue);
      } else if (couponData.type === 'percentage') {
        discountAmount =
          (orderData.items.reduce((total, item) => total + item.price, 0) /
            100) *
          parseFloat(couponData.couponValue);
      }
      const orderTotal = orderData.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      if (orderTotal >= couponData.minimumOrderAmount) {
        setOrderData({
          ...orderData,
          discount: discountAmount,
        });
      } else {
        setCouponError('Order amount is less then minimum order amount.');
      }
    }
  };

  const handleUpdateOrderData = (updatedOrderData: OrderData) => {
    setOrderData(updatedOrderData);
  };

  const handleSettleClick = async () => {
    setMiddleComponent('checkoutform');
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const handleSaveClick = async () => {
    try {
      const apiRequestData = {
        id: 0,
        tableNumber: orderData.tableNumber,
        status: orderData.status,
        paymentType: orderData.paymentType,
        CustomerId: orderData.customer?.id,
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
        clearOrderData();
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

    handlePrint();
    //setCheckOutOpen(false);
  };
  const handlePrintBillClick = async () => {
    handlePrint();
  };
  const handleDiscountClick = async () => {
    setIsCouponPopupOpen(true);
  };
  const handleCloseClick = () => {
    clearOrderData();
    setIsModalOpen(false);
    setMiddleComponent('');
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
  const clearOrderData = () => {
    setOrderData({
      tableNumber: '',
      status: 'New',
      paymentType: '',
      items: [],
      discount: 0,
      note: '',
    });
  };
  const tableData2 = [
    {
      id: 1,
      name: 'A1',
      color: 'bg-cyan',
      tableState : 'pending',
    },
    {
      id: 2,
      name: 'A2',
      color: 'bg-primary',
      tableState : 'due',
    },
    {
      id: 3,
      name: 'A3',
      color: 'bg-destructive',
      tableState : 'pending',

    },
    {
      id: 4,
      name: 'A4',
      color: 'bg-yellow',
      tableState : 'delivered',

    },
    {
      id: 5,
      name: 'A5',
      color: 'bg-gray',
      tableState : 'due',
    },
    {
      id: 6,
      name: 'A6',
      color: 'bg-cyan',
      tableState : 'locked',
    },
    {
      id: 7,
      name: 'A7',
      color: 'bg-primary',
      tableState : 'locked',
    },
    {
      id: 8,
      name: 'A8',
      color: 'bg-destructive',
      tableState : 'pending',
    },
    {
      id: 9,
      name: 'A9',
      color: 'bg-yellow',
      tableState : 'due',
    },
    {
      id: 10,
      name: 'A10',
      color: 'bg-gray',
      tableState : 'locked',
    },
    {
      id: 11,
      name: 'A11',
      color: 'bg-cyan',
      tableState : 'pending',
    },
    {
      id: 12,
      name: 'A12',
      color: 'bg-primary',
      tableState : 'delivered',
    },
    {
      id: 13,
      name: 'A13',
      color: 'bg-destructive',
      tableState : 'due',
    },
    {
      id: 14,
      name: 'A14',
      color: 'bg-yellow',
      tableState : 'delivered',
    },
    {
      id: 15,
      name: 'A15',
      color: 'bg-gray',
      tableState : 'due',
    },
  ];
  const handleTableClick = (tableName: string) => {
    setOrderData({
      ...orderData,
      tableNumber: tableName,
    });
    setSelectTableOpen(false);
  };
  const getFloorData = async () => {
    try {
      const floors = await getFloors();
      setFloorData(floors);
    } catch (error) {
      console.error('Error fetching floor data:', error);
    }
  };
  const getTableData = async (floorId: string) => {
    try {
      const tables = await getTables(floorId);
      setTableData(tables);
      console.log(tableData);
    } catch (error) {
      console.error('Error fetching floor data:', error);
    }
  };
  return (
    <>
      <div className='max-h-screen w-full min-w-[500px] bg-white'>
        <nav className='w-full min-w-[500px] border-gray-200 bg-[#f5f6f9] p-2'>
          <div className='mx-auto flex max-w-screen-xl items-center justify-between'>
            <Button
              onClick={() => router.push('/')}
              className='bg-cyan text-sm font-medium text-white'
            >
              {t.mainMenu}
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
        {selectTableOpen ?(
          <SelectTable
          tableData={tableData}
          floorData={floorData}
          handleTableClick={handleTableClick}
          getTableData={getTableData}
           />
        ):(
        <div>
          <div>
            <Tabs
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList>
                <Tab>{t.categories}</Tab>
                {selectedCategory && <Tab>{t.subCategories}</Tab>}
              </TabList>

              <TabPanel>
                <div className='bg-[#efefef] px-1'>
                  <div className='scrollbar-hide flex max-h-[100px] flex-row gap-x-4 overflow-x-auto'>
                    {categoryData.map((item) => (
                      <div
                        key={item.id}
                        className='my-1 flex w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-cyan shadow-md'
                        onClick={() => handleCategoryClick(item.id)}
                      >
                        <img
                          src={item.pic}
                          alt={item.name}
                          className='mt-1 h-8 w-8 object-cover'
                        />
                        <div className='p-1'>
                          <h4 className='text-center font-bold text-white'>
                            {locale === 'en' ? item.name : item.localizedName}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabPanel>

              {selectedCategory && (
                <TabPanel>
                  <div className='bg-[rgb(239,239,239)] px-1'>
                    <div className='scrollbar-hide flex max-h-[100px] flex-row gap-x-4 overflow-x-auto'>
                      {subCategoryData.map((item) => (
                        <div
                          key={item.id}
                          className='my-1 flex w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-cyan shadow-md'
                          onClick={() => handleSubCategoryClick(item.id)}
                        >
                          <img
                            src={item.pic}
                            alt={item.name}
                            className='mt-1 h-8 w-8 object-cover'
                          />
                          <div className='p-1'>
                            <h4 className='text-center font-bold text-white'>
                              {locale === 'en' ? item.name : item.localizedName}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabPanel>
              )}
            </Tabs>
          </div>
          <div className='flex flex-col gap-x-8 lg:flex-row'>
            <div className='flex flex-row lg:ml-10 lg:mt-2 lg:flex-col'>
              <Button 
              onClick={()=> setSelectTableOpen(true)}
              className='mb-4 flex h-16 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-yellow text-yellow-foreground shadow-md md:flex-row'>
                {t.changeTable}
              </Button>
              <Button
                onClick={() => handleSelectCustomerClick()}
                className='mb-4 flex h-16 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-primary text-primary-foreground shadow-md'
              >
                {t.selectCustomer}
              </Button>
              <Button
                onClick={() => setMiddleComponent('ticketNote')}
                className='mb-4 flex h-16 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-gray text-gray-foreground shadow-md'
              >
                {t.ticketNote}
              </Button>
              <Button
                variant='destructive'
                className='mb-4 flex h-16 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border shadow-md'
              >
                {t.printBill}
              </Button>
              <Button
                onClick={handleSaveClick}
                className='mb-2 flex h-16 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-light text-light-foreground shadow-md'
              >
                {t.addTicket}
              </Button>
            </div>
            {middleComponent == 'checkoutform' ? (
              <CheckOutForm
                orderData={orderData}
                onUpdateOrderData={handleUpdateOrderData}
                handlePrintBillClick={handlePrintBillClick}
                handleDiscountClick={handleDiscountClick}
              />
            ) : middleComponent == 'ticketNote' ? (
              <TicketNote
                orderData={orderData}
                setOrderData={setOrderData}
                setMiddleComponent={setMiddleComponent}
              />
            ) : (
              <OrderItemSection
                itemData={itemData}
                handleItemClick={handleItemClick}
              />
            )}
            <Cart
              orderData={orderData}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItemClick={handleRemoveItemClick}
              handleSettleClick={handleSettleClick}
              handleCloseClick={handleCloseClick}
            />
          </div>
          <div>
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
          </div>
        </div>
        )}
      </div>
      {isCustomerPopupOpen && (
        <CustomerPopup
          customerData={customerData}
          onAddCustomer={handleAddCustomer}
          setIsCustomerPopupOpen={setIsCustomerPopupOpen}
        />
      )}
      {isCouponPopupOpen && (
        <CouponPopup
          customerData={customerData}
          handleApplyCoupon={handleApplyCoupon}
          setIsCouponPopupOpen={setIsCouponPopupOpen}
          setCouponError={setCouponError}
          couponError={couponError}
        />
      )}
      <div className='hidden'>
        <Receipt ref={printRef} orderData={orderData} />
      </div>
    </>
  );
};

export default Order;
