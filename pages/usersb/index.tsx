import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useQuery, useIsFetching } from '@tanstack/react-query'
import { User, columns } from './columns'
import { DataTable } from '@/components/table/data-table'
const inter = Inter({ subsets: ['latin'] })
interface ToDo {
  userId: number;
  id: number
  title: string;
  completed : boolean;
}
export default function Home() {
  const { data: usersData , isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => 
    fetch('https://jsonplaceholder.typicode.com/comments').then((res)=> res.json()),
    select:(users)=> users.map((user : any)=> ({id : user.id, name:user.name})),
  });
  console.log(usersData);
  if(isLoading){
    return(
      <main className='mt-4 flex min-h-screen flex-col items-center'>
        It is Loading ... . .  .
      </main>
    )
  }
  return (
    <section className='py-24'>
      <div className='container'>
        <h1 className='mb-6 text-3xl font-bold'>All Users</h1>
        <DataTable columns={columns} data={usersData} />
      </div>
    </section>
  )
}
