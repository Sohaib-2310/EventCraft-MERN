import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Availability = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [bookedDates, setBookedDates] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch availability data from API
  const fetchAvailability = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/availability');
      if (!response.ok) throw new Error('Failed to fetch availability');
      const data = await response.json();
      
      // Convert date strings to Date objects
      const formatDates = (dates) => {
        return dates.map(date => new Date(date));
      };
      
      setBookedDates(formatDates(data.bookedDates));
      setAvailableDates(formatDates(data.availableDates));
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate =>
      bookedDate.getDate() === date.getDate() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getFullYear() === date.getFullYear()
    );
  };

  const isDateAvailable = (date) => {
    return availableDates.some(availableDate =>
      availableDate.getDate() === date.getDate() &&
      availableDate.getMonth() === date.getMonth() &&
      availableDate.getFullYear() === date.getFullYear()
    );
  };

  const isDatePast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === selectedMonth;
      const isBooked = isDateBooked(currentDate);
      const isAvailable = isDateAvailable(currentDate);
      const isPast = isDatePast(currentDate);
      const isToday = currentDate.toDateString() === new Date().toDateString();

      days.push({
        date: new Date(currentDate),
        day: currentDate.getDate(),
        isCurrentMonth,
        isBooked,
        isAvailable,
        isPast,
        isToday,
        isAvailableForBooking: isCurrentMonth && !isBooked && !isPast,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  if (isLoading) {
    return (
      <section id="availability" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Check <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Availability</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Loading availability data...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="availability" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Check <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Availability</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            View our real-time availability calendar to plan your perfect event date. 
            Green dates are available, red dates are already booked.
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl">
              <Calendar className="text-purple-600" size={32} />
              Event Availability Calendar
            </CardTitle>

            <div className="flex justify-center gap-4 mt-6">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                min="2024"
                max="2030"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-gray-700">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="text-red-500" size={20} />
                <span className="text-gray-700">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="text-gray-700">Past/Unavailable</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 max-w-2xl mx-auto">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}

              {calendarDays.map((dayInfo, index) => (
                <div
                  key={index}
                  className={`
                    h-12 flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer transition-all duration-200
                    ${!dayInfo.isCurrentMonth ? 'text-gray-300' : ''}
                    ${dayInfo.isToday ? 'ring-2 ring-purple-500' : ''}
                    ${dayInfo.isAvailable ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                    ${dayInfo.isBooked ? 'bg-red-100 text-red-800' : ''}
                    ${dayInfo.isPast && dayInfo.isCurrentMonth ? 'bg-gray-100 text-gray-500' : ''}
                    ${dayInfo.isAvailableForBooking && !dayInfo.isAvailable && !dayInfo.isBooked ? 'bg-blue-50 text-blue-800 hover:bg-blue-100' : ''}
                  `}
                >
                  {dayInfo.day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {calendarDays.filter(d => d.isAvailable).length}
                  </div>
                  <div className="text-gray-600">Available Days</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {calendarDays.filter(d => d.isBooked && d.isCurrentMonth).length}
                  </div>
                  <div className="text-gray-600">Booked Days</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {months[selectedMonth]} {selectedYear}
                  </div>
                  <div className="text-gray-600">Current Month</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Availability;
