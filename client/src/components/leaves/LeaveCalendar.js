import React, { useState } from 'react';

const LeaveCalendar = ({ approvedLeaves }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get days in current month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Check if a date has approved leaves
  const hasLeavesOnDate = (day) => {
    return approvedLeaves.some(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      
      // Check if the date falls within the leave period
      return checkDate >= leaveStart && checkDate <= leaveEnd;
    });
  };

  // Get leaves for a specific date
  const getLeavesForDate = (date) => {
    return approvedLeaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      
      // Check if the selected date falls within the leave period
      return date >= leaveStart && date <= leaveEnd;
    });
  };

  // Handle date selection
  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get filtered leaves for selected date
  const selectedDateLeaves = getLeavesForDate(selectedDate);

  return (
    <div className="leaves-calendar-container">
      <div className="calendar-card">
        <div className="calendar-header">
          <div className="calendar-navigation">
            <button className="nav-btn" onClick={goToPreviousMonth}>‹</button>
            <span className="month-year">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button className="nav-btn" onClick={goToNextMonth}>›</button>
          </div>
        </div>
        
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-grid">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isSelected = selectedDate.getDate() === day && 
                              selectedDate.getMonth() === currentMonth.getMonth() && 
                              selectedDate.getFullYear() === currentMonth.getFullYear();
            const hasLeaves = hasLeavesOnDate(day);
            
            return (
              <div 
                key={day} 
                className={`calendar-day ${isSelected ? 'selected' : ''} ${hasLeaves ? 'has-leaves' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <span className="day-number">{day}</span>
                {hasLeaves && <span className="day-indicator"></span>}
              </div>
            );
          })}
        </div>
        
        <div className="approved-leaves-list">
          <div className="approved-leaves-title">
            Approved Leaves - {selectedDate.toLocaleDateString()}
          </div>
          {selectedDateLeaves.length === 0 ? (
            <div className="no-approved-leaves">No approved leaves for this date.</div>
          ) : (
            selectedDateLeaves.map(leave => (
              <div key={leave._id} className="approved-leave-item">
                <div className="employee-avatar small">
                  {leave.employee.profileUrl ? (
                    <img src={leave.employee.profileUrl} alt="profile" />
                  ) : (
                    <span>{leave.employee.firstName?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="approved-leave-info">
                  <div className="approved-leave-name">
                    {leave.employee.firstName} {leave.employee.lastName}
                  </div>
                  <div className="approved-leave-date">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </div>
                  <div className="approved-leave-type">
                    {leave.type} ({leave.totalDays} days)
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;
