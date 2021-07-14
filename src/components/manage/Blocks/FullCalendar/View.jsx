import React, { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import { Loader } from 'semantic-ui-react'
import dayGridPlugin from '@fullcalendar/daygrid';
import iCalendarPlugin from '@fullcalendar/icalendar';

import './fullcalendar.css';


const FullCalendarBlockView = (props) => {
  /* server-side rendering with FullCalendar does not work here,
     so we need to render after client-side hydration - as described here:
     https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect
  */
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  const { data } = props;
  const events = data.calendar_url ? {
    url: data.calendar_url,
    format: 'ics'
  } : {};

  /* we cannot use a state variable here to show/hide loading spinner
     since this toggles a re-render,
     which toggles FullCalendar re-render,
     which toggles re-load of resource file in FullCalendar
     -> infinite loop.
     solution: https://stackoverflow.com/a/67437613
  */
  const loader = useRef(null);
  const toggleLoader = useCallback((state) => {
    if (loader.current) {
      if (state) {
        loader.current.classList.remove('hidden');
      }
      else {
        loader.current.classList.add('hidden');
      }
    }
  }, [loader]);

  return isClientSide && (
    <>
      <div ref={loader} className="fc-loader-wrapper hidden">
        <Loader size="massive" />
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, iCalendarPlugin]}
        initialView="dayGridMonth"
        events={events}
        loading={(isLoading) => toggleLoader(isLoading)}
      />
    </>
  );
};

export default FullCalendarBlockView;

