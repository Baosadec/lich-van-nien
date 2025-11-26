import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Moon, Sun } from 'lucide-react';

// Thuật toán chuyển đổi Dương lịch sang Âm lịch (đơn giản hóa)
const getLunarDate = (solarDate) => {
  const day = solarDate.getDate();
  const month = solarDate.getMonth() + 1;
  const year = solarDate.getFullYear();
  
  // Sử dụng công thức tính gần đúng
  const jd = Math.floor((solarDate.getTime() / 86400000) + 2440587.5);
  const k = Math.floor((jd - 2415021.076998695) / 29.530588853);
  const monthStart = Math.floor(2415021.076998695 + k * 29.530588853);
  const lunarDay = jd - monthStart + 1;
  const lunarMonth = ((k + 1) % 12) + 1;
  const lunarYear = year;
  
  return {
    day: Math.floor(lunarDay),
    month: lunarMonth,
    year: lunarYear
  };
};

// Lấy Can Chi của năm
const getCanChi = (year) => {
  const can = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
  const chi = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
  return can[year % 10] + ' ' + chi[year % 12];
};

// Lấy con giáp
const getZodiac = (year) => {
  const zodiacs = ['🐒 Khỉ', '🐓 Gà', '🐕 Chó', '🐖 Lợn', '🐀 Tý', '🐂 Sửu', '🐅 Dần', '🐇 Mão', '🐉 Rồng', '🐍 Tỵ', '🐴 Ngựa', '🐑 Mùi'];
  return zodiacs[year % 12];
};

// Component chính
function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLunar, setShowLunar] = useState(true);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Tạo mảng ngày cho lịch
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ngày tháng trước
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: date,
        lunar: getLunarDate(date)
      });
    }

    // Ngày tháng hiện tại
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      date.setHours(0, 0, 0, 0);
      const isToday = date.getTime() === today.getTime();
      const isSelected = date.getTime() === selectedDate.getTime();

      days.push({
        day: i,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        date: date,
        lunar: getLunarDate(date)
      });
    }

    // Ngày tháng sau
    const remainingDays = 42 - days.length; // 6 hàng x 7 cột
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      days.push({
        day: i,
        isCurrentMonth: false,
        date: date,
        lunar: getLunarDate(date)
      });
    }

    return days;
  }, [currentYear, currentMonth, daysInMonth, firstDayOfMonth, selectedDate]);

  const renderDayCell = (dayObj, index) => {
    const baseClass = "relative p-2 border rounded-lg transition-all duration-200 cursor-pointer h-16 sm:h-20";
    
    let colorClass = "";
    if (dayObj.isToday) {
      colorClass = "bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold shadow-lg scale-105";
    } else if (dayObj.isSelected) {
      colorClass = "bg-purple-100 border-2 border-purple-500";
    } else if (!dayObj.isCurrentMonth) {
      colorClass = "text-gray-300 bg-gray-50";
    } else if (dayObj.isWeekend) {
      colorClass = "text-red-600 hover:bg-red-50";
    } else {
      colorClass = "text-gray-800 hover:bg-purple-50";
    }

    return (
      <div
        key={index}
        className={`${baseClass} ${colorClass}`}
        onClick={() => setSelectedDate(dayObj.date)}
      >
        {/* Ngày Dương */}
        <div className="text-base sm:text-lg font-semibold">
          {dayObj.day}
        </div>
        
        {/* Ngày Âm */}
        {showLunar && (
          <div className={`text-xs mt-1 ${dayObj.isToday ? 'text-purple-100' : 'text-purple-600'}`}>
            {dayObj.lunar.day}/{dayObj.lunar.month}
          </div>
        )}
      </div>
    );
  };

  const selectedLunar = getLunarDate(selectedDate);
  const canChi = getCanChi(selectedLunar.year);
  const zodiac = getZodiac(selectedLunar.year);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Lịch Vạn Niên
              </h1>
            </div>
            
            <button
              onClick={() => setShowLunar(!showLunar)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition"
            >
              {showLunar ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {showLunar ? 'Lịch Âm' : 'Lịch Dương'}
            </button>
          </div>
          
          {/* Thông tin ngày được chọn */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Dương lịch</p>
              <p className="text-lg font-bold text-purple-700">
                {selectedDate.toLocaleDateString('vi-VN', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Âm lịch</p>
              <p className="text-lg font-bold text-purple-700">
                Ngày {selectedLunar.day} tháng {selectedLunar.month} năm {selectedLunar.year}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Năm</p>
              <p className="text-lg font-bold text-purple-700">
                {canChi} - {zodiac}
              </p>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-3 hover:bg-purple-100 rounded-full transition"
            >
              <ChevronLeft className="w-6 h-6 text-purple-600" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            
            <button
              onClick={handleNextMonth}
              className="p-3 hover:bg-purple-100 rounded-full transition"
            >
              <ChevronRight className="w-6 h-6 text-purple-600" />
            </button>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map((name, i) => (
              <div
                key={i}
                className={`text-center font-semibold py-2 ${
                  i === 0 ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {name}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(renderDayCell)}
          </div>

          {/* Today button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleToday}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              📅 Hôm nay
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>© 2025 Lịch Vạn Niên - Âm Dương</p>
          <p className="mt-1">Thuật toán chuyển đổi lịch âm dương đơn giản hóa</p>
        </div>
      </div>
    </div>
  );
}

export default App;