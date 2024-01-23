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
import { Button } from '@/components/ui/button';
import NavBar from '@/components/header/NavBar';
import { Category } from '@/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Search, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import ConfirmationDialog from '@/components/alerts/ConfirmationDialog';
import { PaginationSection } from '@/components/PaginationSection';

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
  const [isModalOpen, setModalOpen] = useState(false);

  const { toast } = useToast();

  const queryClient = useQueryClient();
  const { mutate: addOrEditRecord, isPending } = useMutation({
    mutationFn: async () => {
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
      const result = await addCategory(formData);
      return result;
    },
    onError: (error) => {
      console.log('Error', error.message);
    },
    onSuccess: (data) => {
      clear();
      setModalOpen(false);
      toast({
        title: data.management,
        description: data.msg,
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const { mutate: deleteRecord, isPending: deletePending } = useMutation({
    mutationFn: async () => {
      if (recordToDelete) {
        const result = await deleteCategory(recordToDelete);
        return result;
      }
    },
    onError: (error, variable, context) => {
      toast({
        title: 'Error',
        description: error.message,
      });
    },
    onSuccess: (data, variable, context) => {
      setRecordToDelete('');
      setDeleteConfirmationOpen(false);
      toast({
        title: data.management,
        description: data.msg,
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
  const { mutate: handleEdit, isPending: editPending } = useMutation({
    mutationFn: async (id: string) => {
      return await getCategory(id);
    },
    onError: (error) => {
      console.log('Error', error.message);
    },
    onSuccess: (data) => {
      setName(data.name);
      setDescription(data.description);
      setLocalizedName(data.localizedName);
      setId(data.id);
      setModalOpen(true);
    },
  });
  const { data: categoryData, isLoading } = useQuery({
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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };
  const clear = () => {
    setName('');
    setLocalizedName('');
    setDescription('');
    setImage(null);
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
    const newSortOrder =
      columnName === sortBy && sortOrder === 'asc' ? 'desc' : 'asc';

    setSortBy(columnName);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    setRecordToDelete(id);
    setDeleteConfirmationOpen(true);
  };
  const handleCancelDelete = () => {
    setRecordToDelete('');
    setDeleteConfirmationOpen(false);
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={3}>
            <div className='flex justify-center'>
              <Loader2 className='mr-2 h-10 w-10 animate-spin' />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (!categoryData || categoryData.totalRecords === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} className='text-center'>
            No data found !
          </TableCell>
        </TableRow>
      );
    }

    // Render table rows when data is available
    return categoryData?.clientPreferences?.map((item: Category) => (
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
            disabled={editPending}
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
    ));
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
              <Button onClick={() => setModalOpen(true)} color='primary'>
                {t.addNew}
              </Button>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-default-400 text-small'>
              {t.total +
                ' ' +
                (categoryData?.totalRecords ?? 0) +
                ' ' +
                t.records}
            </span>
            <label className='text-default-400 text-small flex items-center'>
              {t.recordsPerPage}
              <select
                className='text-default-400 text-small bg-transparent outline-none'
                onChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(1);
                }}
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
            <TableBody>{renderTableBody()}</TableBody>
            {categoryData?.totalRecords > 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>
                    <PaginationSection
                      totalPosts={categoryData?.totalRecords}
                      postsPerPage={rowsPerPage}
                      currentPage={page}
                      setCurrentPage={setPage}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
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
                      onClick={() => {setModalOpen(false); clear();}}
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
                    <form
                      className='space-y-4'
                      onSubmit={(e) => {
                        e.preventDefault();
                        addOrEditRecord();
                      }}
                    >
                      {' '}
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
                        isLoading={isPending}
                        disabled={isPending}
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
            onConfirmed={deleteRecord}
            onCancel={handleCancelDelete}
            isOpen={isDeleteConfirmationOpen}
            title={t.confirmationTitle}
            description={t.confirmationDelete}
            isLoading={deletePending}
          />
        </div>
      </section>
    </>
  );
};

export default Categories;
