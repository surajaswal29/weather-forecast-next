"use client"

import DataTable from "@/components/DataTable"
const Home = () => {

  return (
    <div className='w-full'>
      <div className='w-full px-4 md:px-8 lg:px-24 xl:px-36 py-10'>
        <div className='w-full mt-6'>
          <DataTable />
        </div>
      </div>
    </div>
  )
}

export default Home
