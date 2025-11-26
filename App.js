import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Hàm đơn giản hóa chuyển đổi lịch Âm (chỉ mang tính minh họa)
// LƯU Ý: Chuyển đổi lịch Âm chính xác rất phức tạp và cần thư viện chuyên biệt.
// Đoạn code này chỉ là mô phỏng để có nội dung hiển thị.
const getLunarDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Tạo một key duy nhất cho ngày
  const key = `${year}-${month}-${day}`;

  // Dữ liệu mô phỏng: Lịch Âm đơn giản
  const mockLunarData = {
    // 26/11/2025 (Ngày 26 tháng 11 Dương lịch)
    '2025-11-26': { lunarDay: 6, lunarMonth: 10, lunarYear: 2025, canChi: 'Giáp Thìn' },
    // Dữ liệu mô phỏng một vài ngày khác
    '2025-11-25': { lunarDay: 5, lunarMonth: 10, lunarYear: 2025, canChi: 'Quý Mão' },
    '2025-11-27': { lunarDay: 7, lunarMonth: 10, lunarYear: 2025, canChi: 'Ất Tỵ' },
    '2025-11-28': { lunarDay: 8, lunarMonth: 10, lunarYear: 2025, canChi: 'Bính Ngọ' },
    '2025-11-29': { lunarDay: 9, lunarMonth: 10, lunarYear: 2025, canChi: 'Đinh Mùi' },
    '2025-11-30': { lunarDay: 10, lunarMonth: 10, lunarYear: 2025, canChi: 'Mậu Thân' },
    '2025-12-1': { lunarDay: 11, lunarMonth: 10, lunarYear: 2025, canChi: 'Kỷ Dậu' },
  };

  const data = mockLunarData[key];

  if (data) {
    return {
      day: data.lunarDay,
      month: data.lunarMonth,
      canChi: data.canChi,
    };
  }

  // Fallback cho các ngày không có dữ liệu mô phỏng
  const randomDay = (day % 29) + 1;
  const randomMonth = (month % 12) + 1;
  return {
    day: randomDay,
    month: randomMonth,
    canChi: ['Giáp Tý', 'Ất Sửu', 'Bính Dần', 'Đinh Mão'][randomDay % 4],
  };
};

// Component chính
function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday, 1 = Monday

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Logic chuyển tháng
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Tạo mảng ngày cho lịch
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Thêm ngày trống đầu tháng
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // Thêm ngày trong tháng
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      date.setHours(0, 0, 0, 0);
      const isToday = date.getTime() === today.getTime();
      const lunar = getLunarDate(date);

      days.push({
        day: i,
        isCurrentMonth: true,
        isToday,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        lunarDay: lunar.day,
        lunarMonth: lunar.month,
        canChi: lunar.canChi,
      });
    }

    return days;
  }, [currentYear, currentMonth, daysInMonth, firstDayOfMonth]);


  // Hàm render ô ngày
  const renderDayCell = (dayObj, index) => {
    if (!dayObj.day) {
      return <div key={`empty-${index}`} className="p-1 h-20 sm:h-24"></div>;
    }

    const dayClass = dayObj.isToday
      ? 'bg-red-500 text-white shadow-lg font-bold'
      : dayObj.isWeekend
        ? 'text-red-600 dark:text-red-400'
        : 'text-gray-800 dark:text-gray-200';

    return (
      <div
        key={dayObj.day}
        className={`p-1 border border-gray-200 dark:border-gray-700 rounded-lg h-20 sm:h-24 transition duration-150 ease-in-out hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer flex flex-col justify-start items-start`}
      >
        {/* Ngày Dương Lịch */}
        <div className={`text-lg sm:text-xl leading-none ${dayClass}`}>
          {dayObj.day}
        </div>
        {/* Ngày Âm Lịch */}
        <div className={`text-xs sm:text-sm mt-1 leading-none ${dayObj.isToday ? 'text-white' : 'text-indigo-600 dark:text-indigo-400 font-semibold'}`}>
          {dayObj.lunarDay}
        </div>
        {/* Chi tiết Âm Lịch (Can Chi) */}
        <div className={`text-[10px] sm:text-xs leading-none mt-1 ${dayObj.isToday ? 'text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {dayObj.canChi}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 flex justify-center items-center font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 transition"
            aria-label="Tháng trước"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white select-none">
            {monthNames[currentMonth]} {currentYear}
          </h1>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 transition"
            aria-label="Tháng sau"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Bảng Ngày */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-sm font-semibold mb-3">
          {dayNames.map(name => (
            <div
              key={name}
              className={`py-2 rounded-lg ${name === 'CN' ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Lịch */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map(renderDayCell)}
        </div>

        {/* Footer/Ghi chú */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <p>LƯU Ý: Chức năng Lịch Âm trong ứng dụng này chỉ là mô phỏng. Để có Lịch Vạn Niên chính xác, cần sử dụng các thuật toán hoặc API chuyển đổi lịch phức tạp hơn.</p>
          <p className="mt-1 font-medium">Ngày hôm nay: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </div>
    </div>
  );
}

export default App;