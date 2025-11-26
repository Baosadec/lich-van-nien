import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sun, Moon } from 'lucide-react';

// === THUẬT TOÁN ÂM LỊCH (Đơn giản và Gần đúng) ===
// Cảnh báo: Thuật toán này không phải là Lịch Vạn Niên chính xác (âm dương lịch phức tạp).
// Nó chỉ phục vụ mục đích minh họa UI và sẽ cho kết quả gần đúng.

// Hàm lấy ngày âm lịch (Simplified Lunar Calendar)
const getLunarDate = (date) => {
  // Lấy Julian Day (JD) cho ngày dương lịch
  const time = date.getTime();
  // JD của 01/01/1970 00:00:00 GMT là 2440587.5
  // Số mili giây/ngày: 86400000
  // Đã bù trừ 7 giờ (Việt Nam) trong hằng số này
  const jd = Math.floor((time / 86400000) + 2440587.5);
  
  // Các hằng số cho thuật toán đơn giản
  // Khoảng JD của một ngày âm lịch tham chiếu (gần 01/01/1900)
  const JD_EPOCH = 2415021.076998695; 
  const SYNODIC_MONTH = 29.530588853; // Độ dài trung bình của một tháng âm lịch

  const k = Math.floor((jd - JD_EPOCH) / SYNODIC_MONTH);
  const monthStart = Math.floor(JD_EPOCH + k * SYNODIC_MONTH);
  
  // Tính ngày âm lịch
  const lunarDay = jd - monthStart + 1;
  
  // Tính tháng âm lịch (chỉ là giá trị tương đối)
  let lunarMonth = ((k + 1) % 12) + 1;
  if (lunarMonth > 12) lunarMonth -= 12;

  // Tính năm âm lịch (gần đúng)
  // Tính năm Can Chi từ dương lịch (cần tính lại theo Can Chi ngày)
  let lunarYear = date.getFullYear();

  return { day: Math.floor(lunarDay), month: lunarMonth, year: lunarYear };
};

// Lấy Can Chi năm
const getCanChi = (year) => {
  const can = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
  const chi = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
  
  // Sử dụng Can Chi năm dương lịch (để đơn giản)
  const canIndex = (year + 6) % 10; 
  const chiIndex = (year + 8) % 12;

  return can[canIndex] + ' ' + chi[chiIndex];
};

// Lấy tên con giáp (12 con giáp)
const getZodiac = (year) => {
  const zodiacs = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  // Dùng năm dương lịch để tính con giáp
  return zodiacs[(year - 4) % 12];
};

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLunar, setShowLunar] = useState(true);

  // Helper functions
  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  // Lấy thứ của ngày đầu tiên trong tháng (0: CN, 1: T2, ..., 6: T7)
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay(); 

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    // Lấy thứ của ngày đầu tiên trong tháng (0 = CN, 1 = T2, ...)
    const firstDay = firstDayOfMonth(currentDate);
    const prevMonthDays = daysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

    // Ngày tháng trước (tô xám)
    // Sửa lỗi hiển thị ngày cuối tuần đầu tiên bị lỗi (cần đảm bảo 0 <= i < firstDay)
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i)
      });
    }

    // Ngày tháng hiện tại
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      });
    }

    // Ngày tháng sau (tô xám) - Đảm bảo lịch luôn có 6 hàng (42 ô)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      });
    }

    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const changeMonth = (delta) => {
    // Đặt lại ngày là 1 để tránh lỗi khi chuyển từ tháng 31 ngày sang tháng 30/28 ngày
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };
  
  goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  // Lấy thông tin lịch âm cho ngày được chọn
  const lunar = getLunarDate(selectedDate);
  const canChi = getCanChi(selectedDate.getFullYear()); 
  const zodiac = getZodiac(selectedDate.getFullYear());

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-inter">
      <div className="max-w-4xl mx-auto">
        {/* Header and Info Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-6 border-t-4 border-purple-500 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-extrabold text-gray-800">Lịch Vạn Niên</h1>
            </div>
            <button
              onClick={() => setShowLunar(!showLunar)}
              className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-medium hover:bg-pink-200 transition shadow-md active:scale-95"
            >
              {showLunar ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {showLunar ? 'Ẩn Lịch Âm' : 'Hiện Lịch Âm'}
            </button>
          </div>
          
          {/* Thông tin lịch âm ngày được chọn */}
          {showLunar && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6 shadow-inner mt-4 animate-fadeIn">
              <p className="text-xl font-bold text-gray-700 mb-2">
                Ngày Dương: {selectedDate.toLocaleDateString('vi-VN', { 
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                })}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-3 border-purple-200">
                <div className="p-2 bg-white rounded-lg shadow-md border-b-2 border-purple-300">
                  <p className="text-sm text-gray-500">Âm lịch</p>
                  <p className="text-lg font-bold text-purple-700">
                    Ngày {lunar.day} tháng {lunar.month}
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg shadow-md border-b-2 border-purple-300">
                  <p className="text-sm text-gray-500">Năm Âm</p>
                  <p className="text-lg font-bold text-purple-700">
                    Năm {lunar.year}
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg shadow-md border-b-2 border-purple-300">
                  <p className="text-sm text-gray-500">Can Chi (Năm)</p>
                  <p className="text-lg font-bold text-purple-700">
                    {canChi} ({zodiac})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => changeMonth(-1)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition shadow-md active:scale-95"
              aria-label="Tháng trước"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 tracking-wider">
              {monthNames[currentDate.getMonth()]} <span className="text-purple-600">{currentDate.getFullYear()}</span>
            </h2>
            
            <button
              onClick={() => changeMonth(1)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition shadow-md active:scale-95"
              aria-label="Tháng sau"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {weekDays.map((day, i) => (
              <div
                key={i}
                className={`text-center font-bold py-2 text-sm sm:text-base rounded-lg ${
                  i === 0 ? 'text-red-500 bg-red-50' : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {generateCalendarDays().map((dayObj, i) => {
              const lunarInfo = getLunarDate(dayObj.date);
              const isTodayDate = isToday(dayObj.date);
              const isSelectedDate = isSelected(dayObj.date);
              
              // Chủ nhật là ngày đầu tiên (index 0)
              const isSunday = i % 7 === 0;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(dayObj.date)}
                  disabled={!dayObj.isCurrentMonth}
                  className={`
                    flex flex-col items-center justify-center h-16 sm:h-20 p-1 sm:p-2 rounded-xl transition-all duration-200
                    ${!dayObj.isCurrentMonth 
                        ? 'text-gray-300 pointer-events-none' 
                        : 'hover:bg-purple-50 hover:scale-[1.02] active:scale-95 cursor-pointer'
                    }
                    ${isTodayDate 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-300 transform scale-105 z-10' 
                        : ''
                    }
                    ${isSelectedDate && !isTodayDate 
                        ? 'bg-purple-100 border-2 border-purple-600 font-semibold text-purple-800' 
                        : ''
                    }
                    ${!isTodayDate && isSunday && dayObj.isCurrentMonth 
                        ? 'text-red-600' 
                        : ''
                    }
                    ${dayObj.isCurrentMonth && !isSunday && !isTodayDate && !isSelectedDate
                        ? 'text-gray-800' : ''
                    }
                  `}
                >
                  {/* Ngày Dương */}
                  <div className={`text-base sm:text-lg font-bold ${isTodayDate ? 'text-white' : ''}`}>
                    {dayObj.day}
                  </div>
                  {/* Ngày Âm */}
                  {showLunar && dayObj.isCurrentMonth && (
                    <div className={`text-xs mt-0.5 ${isTodayDate ? 'text-purple-200' : (isSunday ? 'text-red-400' : 'text-gray-500')}`}>
                      {lunarInfo.day}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Today button */}
          <div className="mt-8 text-center">
            <button
              onClick={goToToday}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-xl active:scale-100"
            >
              Hôm nay
            </button>
          </div>
        </div>
        
        {/* CSS Animations for better visual experience */}
        {/* Đã loại bỏ thuộc tính 'jsx' không chuẩn để khắc phục cảnh báo React */}
        <style>{`
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default App;