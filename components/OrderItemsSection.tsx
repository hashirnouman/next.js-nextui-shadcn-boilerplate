import { Item } from "@/types/types";
import { Input } from "./ui/input";
import { useRouter } from "next/router";

interface OrderControlsProps {
  itemData: Item[];
  handleItemClick: (item: Item) => void;
}

const OrderItemSection: React.FC<OrderControlsProps> = ({
  itemData,
  handleItemClick,
}) => {
  const router = useRouter();
  const { locale } = router;
  return (
    <div className=' mt-2 h-[400px] w-[500px] min-h-[400px] min-w-[500px] rounded-xl bg-[#f9f9f9]'>
      <div className='container mx-auto mt-1'>
        <div className='scrollbar-hide flex max-h-[210px] flex-wrap justify-center gap-2 gap-x-6 overflow-x-auto'>
          {itemData.map((item) => (
            <div
              key={item.id}
              className='h-16 w-32 overflow-hidden border bg-cyan shadow-md'
              onClick={() => handleItemClick(item)}
            >
              <div>
                <h4 className='text-center font-bold'>{locale === 'en' ? item.name : item.localizedName}</h4>
                <h4 className='text-center font-bold'>{item.price}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderItemSection;
