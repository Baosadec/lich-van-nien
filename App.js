import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import ReactDOM from 'react-dom/client'; // Đã loại bỏ dòng này để sử dụng global ReactDOM được tải trong index.html
import { onAuthStateChanged } from 'firebase/auth'; // Chỉ nhập những gì cần thiết từ firebase

/**
 * Utility functions for date and calendar manipulation.
 * NOTE: The complex Vietnamese Lunar Calendar conversion logic is omitted here for brevity
 * and will need to be implemented separately (e.g., using a library or custom logic).
 */
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0 for Sunday, 6 for Saturday

const MONTHS_VN = [
  'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
  'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
];
const WEEKDAYS_VN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/**
 * Main Application Component: Lịch Vạn Niên
 */
const App = () => {
  // --- Firebase/Auth State (MANDATORY SETUP) ---
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // --- Calendar State ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 1. Firebase Initialization and Authentication Listener
  useEffect(() => {
    // Access global variables set in index.html
    const dbInstance = window.db;
    const authInstance = window.auth;

    if (dbInstance && authInstance) {
      setDb(dbInstance);
      setAuth(authInstance);

      // Listener for Auth State Changes
      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId('anonymous'); // Use a placeholder if not fully signed in
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe(); // Cleanup listener
    } else {
      setIsAuthReady(true); // Treat as ready if no Firebase is available
    }
  }, []);

  // Placeholder for future data fetching (e.g., events from Firestore)
  useEffect(() => {
    if (isAuthReady && userId && db) {
      console.log(`Firebase is ready. User ID: ${userId}.`);
      // Future logic for onSnapshot to fetch user calendar events goes here.
    }
  }, [isAuthReady, userId, db]);


  // --- Calendar Logic ---

  const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const startDay = useMemo(() => getFirstDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getTime());
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getTime());
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }, []);

  // Generates the array of calendar cells (day numbers and empty spaces)
  const renderCalendarDays = () => {
    const dayCells = [];

    // Add empty cells for the leading days of the week
    for (let i = 0; i < startDay; i++) {
      dayCells.push(<div key={`empty-${i}`} className="p-2 text-center text-gray-400"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      // Logic for Lunar Day/Event display would go here
      const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

      dayCells.push(
        <div 
          key={day} 
          className={`p-1 flex flex-col items-center justify-start h-20 border border-gray-100 cursor-pointer transition duration-150 hover:bg-indigo-50 ${isToday ? 'bg-indigo-100 border-indigo-500 shadow-lg' : 'bg-white'}`}
        >
          {/* Solar Day (Dương Lịch) */}
          <span className={`text-lg font-semibold ${isToday ? 'text-indigo-800' : 'text-gray-900'}`}>{day}</span>
          
          {/* Lunar Day (Âm Lịch) - Placeholder */}
          <span className="text-xs text-red-500 mt-0.5">
            {/* Replace with actual Lunar Day calculation */}
            Âm: {day % 10 + 1}
          </span>
          
          {/* Event/Good Day indicator - Placeholder */}
          {day % 7 === 0 && <div className="text-xs text-green-600 font-medium mt-1">Ngày Tốt</div>}
        </div>
      );
    }

    return dayCells;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden">
        
        {/* Header and User Info */}
        <header className="p-4 bg-indigo-600 text-white flex justify-between items-center rounded-t-xl">
          <h1 className="text-2xl font-bold">Lịch Vạn Niên 2024</h1>
          <div className="text-sm">
             {/* MANDATORY: Display User ID for debugging/sharing in collaborative apps */}
            <span className='font-light opacity-80'>User: {isAuthReady ? (userId || 'N/A') : 'Loading...'}</span>
          </div>
        </header>

        {/* Calendar Navigation */}
        <div className="flex justify-between items-center p-4 border-b">
          <button 
            onClick={goToPrevMonth}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-bold"
          >
            &lt; Tháng Trước
          </button>
          <h2 className="text-2xl font-extrabold text-indigo-700">
            {MONTHS_VN[currentMonth]} {currentYear}
          </h2>
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-bold"
          >
            Tháng Sau &gt;
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center font-bold text-sm bg-gray-100 text-gray-600 border-b">
          {WEEKDAYS_VN.map(day => (
            <div key={day} className="p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>

        {/* Footer for Lunar/Solar Info (Placeholder for detail) */}
        <footer className="p-4 bg-gray-50 text-sm text-gray-600 border-t">
          <p className="text-center">Dương Lịch (Solar): {currentDate.toLocaleDateString('vi-VN')} | Âm Lịch (Lunar): Sẽ cập nhật sau.</p>
        </footer>
      </div>
    </div>
  );
};

// Render the App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Export App for testing purposes (not strictly necessary for the single file setup)
export default App;