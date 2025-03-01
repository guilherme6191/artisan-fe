const SkeletonRow = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-4 whitespace-nowrap">
        <Skeleton.Checkbox />
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="h-5 w-32 rounded bg-gray-200 animate-pulse"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="h-5 w-24 rounded bg-gray-200 animate-pulse"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="h-5 w-16 rounded bg-gray-200 animate-pulse"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="h-5 w-20 rounded bg-gray-200 animate-pulse"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="h-5 w-24 rounded bg-gray-200 animate-pulse"></div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="h-5 w-8 rounded bg-gray-200 animate-pulse ml-auto"></div>
      </td>
    </tr>
  );
};

const SkeletonCheckbox = () => (
  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
);

const Skeleton = {
  Row: SkeletonRow,
  Checkbox: SkeletonCheckbox,
};

export default Skeleton;
