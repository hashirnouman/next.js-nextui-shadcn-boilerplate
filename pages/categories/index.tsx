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
import { Category } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategories,
} from '@/services/category';
import { useToast } from '@/components/ui/use-toast';
import en from '@/locales/en';
import ar from '@/locales/ar';
import { useRouter } from 'next/router';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmationDialog from '@/components/alerts/ConfirmationDialog';

const Categories = () => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;

  const [id, setId] = useState<string>('');
  const [name, setName] = useState('');
  const [localizedName, setLocalizedName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [nameSearch, setNameSearch] = useState('');
  const [descriptionSearch, setDescriptionSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string>('');

  const { toast } = useToast();

  const { data: categoryData, refetch } = useQuery({
    queryKey: [
      'categories',
      page,
      rowsPerPage,
      nameSearch,
      descriptionSearch,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      getCategories(
        page,
        rowsPerPage,
        nameSearch,
        descriptionSearch,
        sortBy,
        sortOrder
      ),
  });
  console.log(categoryData);
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
      case 'description':
        setDescriptionSearch(value ?? '');
        break;
      default:
        break;
    }
    setPage(1);
  };
  const handleSort = (columnName: string) => {
    debugger;
    const newSortOrder =
      columnName === sortBy && sortOrder === 'asc' ? 'desc' : 'asc';

    setSortBy(columnName);
    setSortOrder(newSortOrder);
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
    const formData = new FormData();
    if (id !== '') {
      formData.append('Id', id);
    }
    formData.append('Name', name);
    formData.append('LocalizedName', localizedName);
    formData.append('Description', description);
    if (image) {
      formData.append('Image', image);
    }

    try {
      const result = await addCategory(formData);
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
      const userData = await getCategory(id);
      if (Object.keys(userData).length !== 0) {
        setName(userData.name);
        setDescription(userData.description);
        setLocalizedName(userData.localizedName);
        setId(id);
        openModal();
      } else {
        console.error(`User with ID ${id} not found.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleDelete = async (id: string) => {
  //   if (window.confirm('Are you sure to delete this record?')) {
  //     const result = await deleteCategory(id);
  //     if (result.color === 'success') {
  //       refetch();
  //       toast({
  //         title: result.management,
  //         description: result.msg,
  //       });
  //     } else {
  //       console.error(result.error);
  //     }
  //   }
  // };
  const handleDelete = (id: string) => {
    setRecordToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    if (recordToDelete) {
      const result = await deleteCategory(recordToDelete);
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
    setRecordToDelete('');
    setDeleteConfirmationOpen(false);
  };

  const handleCancelDelete = () => {
    setRecordToDelete('');
    setDeleteConfirmationOpen(false);
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
                {t.addNew}
              </Button>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-default-400 text-small'>
              {t.total + ' ' + categoryData?.totalRecords + ' ' + t.records}
            </span>
            <label className='text-default-400 text-small flex items-center'>
              {t.recordsPerPage}
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
                  <div
                    className='flex items-center'
                    onClick={() => handleSort('name')}
                  >
                    {t.name}
                    {sortBy === 'name' ? (
                      <span className='ml-2'>
                        {sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />}
                      </span>
                    ) : (
                      <span className='ml-2'>
                        <ChevronDown />
                      </span>
                    )}
                  </div>
                  <Input
                    type='text'
                    placeholder={t.search}
                    value={nameSearch}
                    onChange={(e) => onSearchChange(e.target.value, 'name')}
                    className={`search-box w-[50%] ${
                      sortBy !== 'name' && 'hidden'
                    }`}
                  />
                </TableHead>
                <TableHead>
                  <div
                    className='flex items-center'
                    onClick={() => handleSort('description')}
                  >
                    {t.description}
                    {sortBy === 'description' ? (
                      <span className='ml-2'>
                        {sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />}
                      </span>
                    ) : (
                      <span className='ml-2'>
                        <ChevronDown />
                      </span>
                    )}
                  </div>
                  <Input
                    type='text'
                    placeholder={t.search}
                    value={descriptionSearch}
                    onChange={(e) =>
                      onSearchChange(e.target.value, 'description')
                    }
                    className={`w-[50%] ${
                      sortBy !== 'description' && 'hidden'
                    }`}
                  />
                </TableHead>
                <TableHead>{t.action}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryData?.clientPreferences?.map((item: Category) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {locale === 'ar' ? item.localizedName : item.name}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className='gap-2'>
                    {/* Edit button */}
                    <Button
                      onClick={() => handleEdit(item.id.toString())}
                      variant='secondary'
                    >
                      {t.edit}
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id.toString())}
                      variant='destructive'
                      className='ml-6'
                    >
                      {t.delete}
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
                    >
                      {t.previous}
                    </PaginationPrevious>
                    <PaginationContent>
                      {[...Array(categoryData?.totalPages)].map((_, index) => (
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
                      isActive={page !== categoryData?.totalPages}
                    >
                      {t.next}
                    </PaginationNext>
                  </Pagination>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          {/* Add Or Update Modal */}
          {isModalOpen && (
            <div className='fixed inset-0 flex items-center justify-center overflow-y-auto overflow-x-hidden'>
              <div className='relative max-h-full w-full max-w-md p-4'>
                <div className='relative rounded-lg bg-background'>
                  <div className='flex items-center justify-between rounded-t border-b p-4 md:p-5 dark:border-gray-600'>
                    <h3 className='text-xl font-semibold text-secondary-foreground'>
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
                      <label className='mb-2 block text-sm font-medium text-secondary-foreground'>
                        Name
                      </label>
                      <Input
                        type='text'
                        name='name'
                        id='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='name'
                        required
                      />
                      <label className='mb-2 block text-sm font-medium text-secondary-foreground'>
                        Localized Name
                      </label>
                      <Input
                        type='text'
                        name='localizedName'
                        id='localizedName'
                        value={localizedName}
                        onChange={(e) => setLocalizedName(e.target.value)}
                        placeholder='Localized Name'
                        required
                      />
                      <label className='mb-2 block text-sm font-medium text-secondary-foreground'>
                        Description
                      </label>
                      <Input
                        type='text'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='description'
                        required
                      />
                      <label className='mb-2 block text-sm font-medium text-secondary-foreground'>
                        Upload Image
                      </label>
                      <Input
                        type='file'
                        accept='image/*'
                        className='text-secondary-foreground'
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
          {/* Confirmation Dialog */}
          <ConfirmationDialog
            onConfirmed={handleDeleteConfirmation}
            onCancel={handleCancelDelete}
            isOpen={isDeleteConfirmationOpen}
            title={t.confirmationTitle}
            description={t.confirmationDelete}
          />
        </div>
      </section>
    </>
  );
};

export default Categories;
