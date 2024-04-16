export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='grid grid-cols-4 gap-2 bg-white p-2 rounded-md'>
      <div className='bg-gray-200 animate-pulse p-6'></div>
      <div className='bg-gray-200 animate-pulse p-6'></div>
      <div className='bg-gray-200 animate-pulse p-6'></div>
      <div className='bg-gray-200 animate-pulse p-6'></div>
    </div>
  )
}
