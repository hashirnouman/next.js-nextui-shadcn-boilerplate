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
  getOrders,
} from '@/services/order';
import { useToast } from '@/components/ui/use-toast';
import en from '@/locales/en';
import ar from '@/locales/ar';
import { useRouter } from 'next/router';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmationDialog from '@/components/alerts/ConfirmationDialog';

const ViewOrders = () => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [descriptionSearch, setDescriptionSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string>('');

  const { toast } = useToast();

  const { data: orderData, refetch } = useQuery({
    queryKey: [
      'orders',
      page,
      rowsPerPage,
      descriptionSearch,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      getOrders(
        page,
        rowsPerPage,
        descriptionSearch,
        sortBy,
        sortOrder
      ),
  });
  const handlePageChange = (page: number) => {
    setPage(page);
  };
  const handleRowsPerPage = (rowsPerPage: number) => {
    setRowsPerPage(rowsPerPage);
    setPage(1);
  };
  const onSearchChange = (value?: string, columnName?: string) => {
    switch (columnName) {
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

  const handleEdit = async (id: string) => {
  };
  const handleDelete = (id: string) => {
    setRecordToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    if (recordToDelete) {
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
              <Button onClick={()=> router.push('/order')} color='primary'>
                {t.addNew}
              </Button>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-default-400 text-small'>
              {t.total + ' ' + orderData?.totalRecords + ' ' + t.records}
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
                  >
                    Order Number
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className='flex items-center'
                    onClick={() => handleSort('name')}
                  >
                    {t.total}
                    {sortBy === 'total' ? (
                      <span className='ml-2'>
                        {sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />}
                      </span>
                    ) : (
                      <span className='ml-2'>
                        <ChevronDown />
                      </span>
                    )}
                  </div>
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
              {orderData?.orders?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.id}
                  </TableCell>
                  <TableCell>
                    {item.total}
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
                <TableCell colSpan={4}>
                  <Pagination>
                    <PaginationPrevious
                      onClick={() => setPage(page - 1)}
                      isActive={page !== 1}
                    >
                      {t.previous}
                    </PaginationPrevious>
                    <PaginationContent>
                      {[...Array(orderData?.totalPages)].map((_, index) => (
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
                      isActive={page !== orderData?.totalPages}
                    >
                      {t.next}
                    </PaginationNext>
                  </Pagination>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
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

export default ViewOrders;
