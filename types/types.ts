export type Tenants = {
  id: string;
  name: string;
};
export type Roles = {
  id: string;
  name: string;
};
export type Category = {
  id: number;
  name: string;
  localizedName: string;
  description: string;
  pic: string;
};
export type SubCategory = {
  id: number;
  name: string;
  localizedName: string;
  pic: string;
};
export type OrderDetails = {
  totalPrice: number;
  pic: string;
};
export type Item = {
  id: number;
  name: string;
  localizedName: string;
  price: number;
  subCategoryName: string;
  pic: string;
};
export type ClientPreference = {
  id: number;
  name: string;
  theme: string;
  language: string;
  logo: string;
};
export type OrderItem = {
  itemId: number;
  itemName: string;
  price: number;
  quantity: number;
  subCategoryName: string;
};
export type OrderData = {
  tableNumber: string;
  status: string;
  paymentType: string;
  customer?: Customer;
  items: OrderItem[];
  discount: number;
  note: string;
};
export type Customer = {
  id: number;
  name: string;
  phone: string;
  address: string;
  accountType: string;
};
export type Coupon = {
  id: string;
  couponValue: string;
  type: string;
  couponFor: string;
  appliesTo: string;
  categories: string;
  codeLimit: number;
  perCustomerLimit: number;
  minimumOrderAmount: number;
};
