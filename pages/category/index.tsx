import React, { useEffect, useState } from 'react';
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
} from '@/components/ui/pagination'; // Adjust the path accordingly
import { Button } from '@/components/ui/button';
import NavBar from '@/components/header/NavBar';
import { Category } from '@/types/types';
import axios from 'axios';
import { API_CONFIG } from '@/constants/api-config';

const Categories = () => {
  const [id, setId] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const [data, setData] = useState<Category[]>([]);
  const [pages, setPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const getData = (page = 1, pageSize = 5, search = '') => {
    axios
      .get(
        `${API_CONFIG.BASE_URL}api/Category?page=${page}&pageSize=${pageSize}&search=${search}`
      )
      .then((response) => {
        setData(response.data.clientPreferences);
        setPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };
  const clear = () => {
    setName('');
    setDescription('');
    setImage(null);
  };
  useEffect(() => {
    getData(page, rowsPerPage, search);
  }, [page, rowsPerPage, search]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };
  const handleRowsPerPage = (rowsPerPage: number) => {
    setRowsPerPage(rowsPerPage);
    setPage(1);
  };
  const onSearchChange = (value?: string) => {
    setSearch(value ?? '');
    setPage(1);
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const url = `${API_CONFIG.BASE_URL}api/Category`;
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    let data = {};
    if (id === '') {
      data = {
        name: name,
        description: description,
        image: image,
      };
    } else {
      data = {
        id: parseInt(id, 10),
        name: name,
        description: description,
      };
    }

    axios
      .post(url, data, config)
      .then((result) => {
        getData(page, rowsPerPage, search);
        clear();
        closeModal();
        alert('Record has been saved.');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleEdit = (id: string) => {
    axios
      .get(`${API_CONFIG.BASE_URL}api/Category/GetById?id=${id}`)
      .then((result) => {
        setName(result.data.name);
        setDescription(result.data.description);
        setId(id);
        openModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure to delete this record?')) {
      axios
        .delete(`${API_CONFIG.BASE_URL}api/Category?id=${id}`)
        .then(() => {
          alert('Record has been deleted.');
          getData(page, rowsPerPage, search);
        })
        .catch((error) => {
          console.error(error);
          alert('Error occurred while deleting record.');
        });
    }
  };
  return (
    <>
      <NavBar />
      <section className='my-2 flex items-center justify-center'>
        <div className='container'>
          <div className='flex items-end justify-between gap-3'>
            <Input
              className='h-12 w-full sm:max-w-[44%]'
              placeholder='search'
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className='flex gap-3'>
              <Button onClick={openModal} color='primary'>
                Add New
              </Button>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-default-400 text-small'>
              total {totalRecords} records
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
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
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
                      {[...Array(pages)].map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => handlePageChange(index + 1)}
                            isActive={page === index + 1}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    </PaginationContent>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      isActive={page !== pages}
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
                <div className='relative rounded-lg bg-white shadow dark:bg-gray-700'>
                  <div className='flex items-center justify-between rounded-t border-b p-4 md:p-5 dark:border-gray-600'>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
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
                        Description
                      </label>
                      <Input
                        type='text'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='description'
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400'
                        required
                      />
                      <label className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                        Upload Image
                      </label>
                      <Input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                      />

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

export default Categories;
