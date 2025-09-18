const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr
          key={rowIdx}
          className={`${
            rowIdx % 2 === 0 ? "" : "bg-gray-50"
          } border-b border-gray-200`}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <td key={colIdx} className="px-6 py-4">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
