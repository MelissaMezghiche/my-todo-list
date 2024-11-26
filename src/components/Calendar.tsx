import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Styles de base

const CalendarComponent = () => {
  // L'état de la date sélectionnée reste local mais n'est pas affiché
  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    // Pas de popup ou d'affichage
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        onChange={handleDateChange} // Appelle la fonction mais ne fait rien visuellement
        value={date}
        locale="en-US" // Changez en "fr-FR" pour le français
      />
    </div>
  );
};

export default CalendarComponent;
