import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import iCalendarPlugin from '@fullcalendar/icalendar';


const FullCalendarBlockView = (props) => {
  /* server-side rendering with FullCalendar does not work here,
     so we need to render after client-side hydration - as described here:
     https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect
  */
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    setShowCalendar(true);
  }, []);

  if (!showCalendar) {
    /* placeholder? */
    return null;
  }

  const { data } = props;
  const events = data.calendar_url ? {
    url: data.calendar_url,
    format: 'ics'
  } : {};

  return (
    <FullCalendar
      plugins={[dayGridPlugin, iCalendarPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default FullCalendarBlockView;

