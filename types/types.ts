export type Tenants = {
    id: string
    name: string
  }
export type Roles = {
    id: string
    name: string
  }
export type Category = {
    id: number
    name: string
    pic: string
  }
export type SubCategory = {
    id: number
    name: string
    pic: string
  }
export type Item = {
    id: number
    name: string
    price: number
    subCategoryName:string
  }