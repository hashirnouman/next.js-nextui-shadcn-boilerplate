import { Floor } from '@/types/types';
import { useRouter } from 'next/router';
import en from '@/locales/en';
import ar from '@/locales/ar';
import { Button } from './ui/button';
import { Tab, TabList, Tabs } from 'react-tabs';
import { useEffect, useState } from 'react';

interface SelectTableProps {
  tableData: any;
  floorData: Floor[];
  handleTableClick: (tableName: string) => void;
  getTableData: (floorId: string) => void;
}

const SelectTable: React.FC<SelectTableProps> = ({
  tableData,
  floorData,
  handleTableClick,
  getTableData,
}) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    getTableData('0');
  }, []);

  return (
    <>
      <div className='h-[100px] border border-b-2 bg-[#fff] px-1'>
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
          <TabList>
            <Tab onClick={() => getTableData('0')}>All</Tab>
            {floorData.map((item: Floor) => (
              <Tab key={item.id} onClick={() => getTableData(item.id)}>
                {item.name}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </div>
      <div className='max-w-screen flex flex-row bg-[#fff]'>
        <div className='my-8 items-center sticky flex min-w-40 flex-col gap-20'>
          <div className='flex rotate-90 items-center'>
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
        <div>
        <div className='mx-16 mt-2 items-start h-auto flex flex-row flex-wrap gap-6'>
          {tableData.map((item: any) => (
            <Button
              key={item.id}
              className={`flex h-28 w-44 items-center justify-center overflow-hidden rounded-lg border shadow-md ${
                item.status === 'pending'
                  ? 'bg-yellow'
                  : item.status === 'delivered'
                  ? 'bg-primary'
                  : item.status === 'locked'
                  ? 'disabled bg-gray'
                  : item.status === 'due'
                  ? 'bg-destructive'
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
      </div>
    </>
  );
};

export default SelectTable;
