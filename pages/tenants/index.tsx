import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableFooter,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/header/NavBar';
import { Tenants } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import {
  addTenant,
  deleteTenant,
  getTenant,
  getTenants,
} from '@/services/tenant';
import { useToast } from '@/components/ui/use-toast';

const Teants = () => {
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [localizedName, setLocalizedName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [nameSearch, setNameSearch] = useState('');
  const { toast } = useToast();

  const { data: tenantData, refetch } = useQuery({
    queryKey: ['tenants', page, rowsPerPage, nameSearch],
    queryFn: () => getTenants(page, rowsPerPage, nameSearch),
  });
  const clear = () => {
    setId('');
    setName('');
    setLocalizedName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsActive(true);
  };
  const handlePageChange = (page: number) => {
    setPage(page);
  };
  const handleRowsPerPage = (rowsPerPage: number) => {
    setRowsPerPage(rowsPerPage);
    setPage(1);
  };
  const onSearchChange = (value?: string, columnName?: string) => {
    switch (columnName) {
      case 'name':
        setNameSearch(value ?? '');
        break;
      // case 'description':
      //   setDescriptionSearch(value ?? '');
      //   break;
      default:
        break;
    }
    setPage(1);
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // const formData = new FormData();
    // if (id !== '') {
    //   formData.append('Id', id);
    // }
    // formData.append('Name', name);
    // formData.append('LocalizedName', localizedName);
    // formData.append('IsActive', isActive.toString());
    // formData.append('Email', email);
    // formData.append('Password', password);
    // formData.append('ConfirmPassword', confirmPassword);
    let data = {};

    if (id === '') {
        data = {
            name,
            localizedName,
            email,
            password,
            confirmPassword,
            isActive,
        };
    } else {
        data = {
            id: parseInt(id, 10),
            name: name,
            localizedName: localizedName,
            isActive: isActive,
        };
    }
    try {
      const result = await addTenant(data);
      if (result.color === 'success') {
        refetch();
        clear();
        closeModal();
        toast({
          title: result.management,
          description: result.msg,
        });
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const tenantData = await getTenant(id);
      if (Object.keys(tenantData).length !== 0) {
        setName(tenantData.name);
        setLocalizedName(tenantData.localizedName);
        setIsActive(tenantData.isActive);
        setId(id);
        openModal();
      } else {
        console.error(`User with ID ${id} not found.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure to delete this record?')) {
      const result = await deleteTenant(id);
      if (result.color === 'success') {
        refetch();
        toast({
          title: result.management,
          description: result.msg,
        });
      } else {
        console.error(result.error);
      }
    }
  };
  return (
    <>
      <NavBar />
      <section className='my-2 flex items-center justify-center'>
        <div className='container'>
          <div className='flex items-end justify-between gap-3'>
            {/* <Input
              className='h-12 w-full sm:max-w-[44%]'
              placeholder='search'
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            /> */}
            <div className='flex gap-3'>
              <Button onClick={openModal} color='primary'>
                Add New
              </Button>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-default-400 text-small'>
              total {tenantData?.totalRecords} records
            </span>
            <label className='text-default-400 text-small flex items-center'>
              record per page
              <select
                className='text-default-400 text-small bg-transparent outline-none'
                onChange={(e) =>
                  handleRowsPerPage(parseInt(e.target.value, 10))
                }
              >
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='15'>15</option>
              </select>
            </label>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Name
                  <Input
                    type='text'
                    placeholder='Search by Name'
                    value={nameSearch}
                    onChange={(e) => onSearchChange(e.target.value, 'name')}
                  />
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantData?.restaurants?.map((item: Tenants) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    {/* Edit button */}
                    <Button
                      onClick={() => handleEdit(item.id.toString())}
                      variant='secondary'
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id.toString())}
                      variant='destructive'
                      className='ml-6'
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination>
                    <PaginationPrevious
                      onClick={() => setPage(page - 1)}
                      isActive={page !== 1}
                    />
                    <PaginationContent>
                      {[...Array(tenantData?.totalPages)].map(
                        (_, index) => (
                          <PaginationItem key={index}>
                            <PaginationLink
                              onClick={() => handlePageChange(index + 1)}
                              isActive={page === index + 1}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                    </PaginationContent>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      isActive={page !== tenantData?.totalPages}
                    />
                  </Pagination>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          {/* Add Or Update Modal */}
          {isModalOpen && (
            <div className='fixed inset-0 flex items-center justify-center overflow-y-auto overflow-x-hidden'>
              <div className='relative max-h-full w-full max-w-md p-4'>
                <div className='relative rounded-lg shadow default:bg-white dark:bg-gray-700'>
                  <div className='flex items-center justify-between rounded-t border-b p-4 md:p-5 dark:border-gray-600'>
                    <h3 className='text-xl font-semibold default:text-gray-900 dark:text-white'>
                      Add Or Update Record
                    </h3>
                    <button
                      type='button'
                      className='end-2.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
                      onClick={closeModal}
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
                  <div className='p-4 md:p-5'>
                    <form className='space-y-4' onSubmit={handleSubmit}>
                      <label className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                        Name
                      </label>
                      <Input
                        type='text'
                        name='email'
                        id='email'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400'
                        placeholder='name'
                        required
                      />
                      <label className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                        Localized Name
                      </label>
                      <Input
                        type='text'
                        value={localizedName}
                        onChange={(e) => setLocalizedName(e.target.value)}
                        placeholder='Localized Name'
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400'
                        required
                      />
                      {id === '' && (
                      <>
                      <label className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                        Email
                      </label>
                      <Input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='email@example.com'
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400'
                        required
                      />
                      <label className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                        Password
                      </label>
                      <Input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='*******'
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400'
                        required
                      />
                      <label className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                        Confirm Passowrd
                      </label>
                      <Input
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder='*******'
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400'
                        required
                      />
                      </>)}
                      <label className='relative me-5 inline-flex cursor-pointer items-center'>
                        <Input
                          type='checkbox'
                          value=''
                          className='peer sr-only'
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-green-800"></div>
                        <span className='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                          IsActive
                        </span>
                      </label>

                      <Button
                        type='submit'
                        className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                      >
                        Submit
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Teants;
