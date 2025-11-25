import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sun, Moon } from 'lucide-react';

const LunarCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLunar, setShowLunar] = useState(true);

  // Hàm tính lịch âm (thuật toán đơn giản hóa)
  const getLunarDate = (date) => {
    // Sử dụng thuật toán chuyển đổi lịch âm dương
    const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
    const k = Math.floor((jd - 2415021.076998695) / 29.530588853);
    const monthStart = Math.floor(2415021.076998695 + k * 29.530588853);
    const lunarDay = jd - monthStart + 1;
    const lunarMonth = ((k + 1) % 12) + 1;
    const lunarYear = 2000 + Math.floor((k + 1) / 12);
    
    return { day: Math.floor(lunarDay), month: lunarMonth, year: lunarYear };
  };

  // Lấy Can Chi
  const getCanChi = (year) => {
    const can = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
    const chi = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
    return can[year % 10] + ' ' + chi[year % 12];
  };

  // Lấy tên con giáp
  const getZodiac = (year) => {
    const zodiacs = ['Khỉ', 'Gà', 'Chó', 'Lợn', 'Tý', 'Sửu', 'Dần', 'Mão', 'Rồng', 'Rắn', 'Ngựa', 'Dê'];
    return zodiacs[year % 12];
  };

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const prevMonthDays = daysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

    // Ngày tháng trước
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

    // Ngày tháng sau
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
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const lunar = getLunarDate(selectedDate);
  const canChi = getCanChi(lunar.year);
  const zodiac = getZodiac(lunar.year);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-800">Lịch Vạn Niên</h1>
            </div>
            <button
              onClick={() => setShowLunar(!showLunar)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
            >
              {showLunar ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {showLunar ? 'Lịch Âm' : 'Lịch Dương'}
            </button>
          </div>
          
          {/* Thông tin lịch âm */}
          {showLunar && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Âm lịch</p>
                  <p className="text-lg font-bold text-purple-700">
                    Ngày {lunar.day} tháng {lunar.month} năm {lunar.year}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Năm</p>
                  <p className="text-lg font-bold text-purple-700">
                    {canChi} - {zodiac}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day, i) => (
              <div
                key={i}
                className={`text-center font-semibold py-2 ${
                  i === 0 ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {generateCalendarDays().map((dayObj, i) => {
              const lunar = getLunarDate(dayObj.date);
              const isTodayDate = isToday(dayObj.date);
              const isSelectedDate = isSelected(dayObj.date);
              
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(dayObj.date)}
                  className={`
                    relative p-3 rounded-lg transition-all hover:scale-105
                    ${!dayObj.isCurrentMonth ? 'text-gray-300' : ''}
                    ${isTodayDate ? 'bg-purple-600 text-white font-bold' : ''}
                    ${isSelectedDate && !isTodayDate ? 'bg-purple-100 border-2 border-purple-600' : ''}
                    ${!isTodayDate && !isSelectedDate ? 'hover:bg-gray-100' : ''}
                    ${i % 7 === 0 && dayObj.isCurrentMonth && !isTodayDate ? 'text-red-600' : ''}
                  `}
                >
                  <div className="text-lg font-semibold">{dayObj.day}</div>
                  {showLunar && dayObj.isCurrentMonth && (
                    <div className={`text-xs mt-1 ${isTodayDate ? 'text-purple-200' : 'text-gray-500'}`}>
                      {lunar.day}/{lunar.month}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Today button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                const today = new Date();
                setCurrentDate(today);
                setSelectedDate(today);
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              Hôm nay
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600">
          <p className="text-sm">© 2025 Lịch Vạn Niên - Âm Dương</p>
        </div>
      </div>
    </div>
  );
};

export default LunarCalendar;