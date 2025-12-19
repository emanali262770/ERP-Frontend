// src/components/ChartSkeleton.jsx
const ChartSkeleton = ({ type = "line", count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case "sales":
        return (
          <div className="bg-white rounded-xl shadow p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-100 rounded"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Chart with Y-axis */}
            <div className="h-60">
              <div className="flex items-start h-full">
                {/* Y-axis */}
                <div className="w-8 mr-2 flex flex-col justify-between h-full">
                  {[100, 75, 50, 25, 0].map((item, i) => (
                    <div key={i} className="h-4 w-6 bg-gray-200 rounded"></div>
                  ))}
                </div>

                {/* Bars */}
                <div className="flex-1 flex items-end justify-between h-full">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center flex-1 h-full"
                    >
                      <div className="h-full flex flex-col justify-end items-center">
                        <div className="mb-1 h-4 w-10 bg-gray-200 rounded"></div>
                        <div
                          className="w-9 bg-gray-200 rounded-t-lg"
                          style={{ height: `${40 + i * 10}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 h-3 w-6 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
                  <div className="h-5 w-20 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        );

      case "summary":
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-100">
            {/* Header */}
            <div className="h-6 w-40 bg-gray-300 rounded mb-6 border-b border-blue-200/50 pb-3"></div>

            <div className="flex items-center justify-center mt-10">
              {/* Circular Progress */}
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                <div className="absolute inset-8 rounded-full bg-gray-100"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="h-12 w-20 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Status List */}
              <div className="ml-6 flex-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between mb-3"
                  >
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-6 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-blue-200/50">
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        );

      case "progress":
        return (
          <div className="bg-white rounded-xl shadow p-6">
            {/* Header */}
            <div className="flex justify-start items-center mb-6 border-b border-blue-200/50 pb-3">
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
            </div>

            {/* Progress Items */}
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-gray-300 h-2.5 rounded-full"
                      style={{ width: `${30 + i * 15}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
                    <div className="h-5 w-12 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100/50 to-transparent" />

      {/* Render skeletons based on count */}
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="relative">
          {renderSkeleton()}
        </div>
      ))}

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ChartSkeleton;
