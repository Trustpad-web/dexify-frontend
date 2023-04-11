export default function ChartSkeleton() {
  return (
    <div
      role="status"
      className="p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
    >
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
      <div className="w-full h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      <div className="flex items-baseline mt-4 space-x-6">
        <div className="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-700"></div>
        <div className="w-full h-56 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
        <div className="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-700"></div>
        <div className="w-full h-64 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
        <div className="w-full bg-gray-200 rounded-t-lg h-80 dark:bg-gray-700"></div>
        <div className="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-700"></div>
        <div className="w-full bg-gray-200 rounded-t-lg h-80 dark:bg-gray-700"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
