import { Customer, OrderItem } from '@/types/types';
import { useRouter } from 'next/router';
import en from '@/locales/en';
import ar from '@/locales/ar';
import { Button } from './ui/button';
interface SelectTableProps {
  tableData: any;
  handleTableClick: (tableName: string) => void;
}

const SelectTable: React.FC<SelectTableProps> = ({
  tableData,
  handleTableClick,
}) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;
  return (
    <>
      <div className='max-w-screen flex flex-row bg-[#fff]'>
        <div className='flex w-56 flex-col gap-20 lg:ml-10 lg:mt-2'>
          <div className='mt-16 flex rotate-90 items-center'>
            <div className='mx-2 h-2 w-2 rounded-full bg-yellow'></div>
            <span className='font-bold text-yellow'>{t.pending}</span>
          </div>
          <div className='flex rotate-90 items-center'>
            <div className='mx-2 h-2 w-2 rounded-full bg-primary'></div>
            <span className='font-bold text-primary'>{t.delivered}</span>
          </div>
          <div className='flex rotate-90 items-center'>
            <div className='mx-2 h-2 w-2 rounded-full bg-gray'></div>
            <span className='font-bold text-gray'>{t.locked}</span>
          </div>
          <div className='flex rotate-90 items-center'>
            <div className='mx-2 h-2 w-2 rounded-full bg-destructive'></div>
            <span className='font-bold text-destructive'>{t.due}</span>
          </div>
        </div>
        <div className='mx-16 mt-2 flex flex-row flex-wrap gap-6'>
          {tableData.map((item: any) => (
            <Button
              key={item.id}
              className={`flex h-28 w-52 items-center justify-center overflow-hidden rounded-lg border shadow-md ${
                item.tableState === 'pending' ? 'bg-yellow'
                : item.tableState === 'delivered' ? 'bg-primary'
                : item.tableState === 'locked' ? 'bg-gray disabled'
                : item.tableState === 'due' ? 'bg-destructive'
                : ''
              }`}
              onClick={() => handleTableClick(item.name)}
              disabled={item.tableState === 'locked'}
            >
              <div className='p-1'>
                <h1 className='text-center text-2xl font-bold text-white'>
                  {item.name}
                </h1>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SelectTable;
