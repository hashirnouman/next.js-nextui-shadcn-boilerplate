import { Customer, OrderItem } from '@/types/types';
import { useRouter } from 'next/router';
import en from '@/locales/en';
import ar from '@/locales/ar';
import { Button } from './ui/button';
import SelectTable from './SelectTable';
import { table } from 'console';
interface PosProps {
  tableData: any;
  handleTableClick: (tableName: string) => void;

}


const Pos : React.FC<PosProps> = (
  {
    tableData,
    handleTableClick,
  }
) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;
  return (
    <>
      <div className='h-[100px] border border-b-2 bg-[#fff] px-1'>a</div>
      <SelectTable
      tableData={tableData}
      handleTableClick={handleTableClick}
      />
    </>
  );
};

export default Pos;
