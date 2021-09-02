import React, { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import { Dimmer, Loader } from 'semantic-ui-react';
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

  /* https://stackoverflow.com/a/43467144 */
  function isValidURL(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  }

  const { data } = props;
  const remoteEvents =
    data.calendar_url && isValidURL(data.calendar_url)
      ? {
          url: data.calendar_url,
          format: 'ics',
        }
      : {};

  const calendarRef = useRef(null);

  /* store events in component state after FullCalendar retrieved them initially,
     otherwise FullCalendar would reload them on every re-render of this component
  */
  const [storedEvents, setStoredEvents] = useState([]);
  const onLoading = (isLoading) => {
    if (isLoading === false) {
      setTimeout(() => {
        let events = calendarRef.current.getApi().getEvents();
        if (events.length > 0) {
          setStoredEvents(events);
        }
      });
    }
  };

  return (
    isClientSide && (
      <div class="calendar-wrapper">
        {storedEvents.length === 0 && (
          <>
            <Dimmer active inverted>
              <Loader inverted size="massive" />
            </Dimmer>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, iCalendarPlugin]}
              initialView="dayGridMonth"
              events={remoteEvents}
              loading={(isLoading) => onLoading(isLoading)}
            />
          </>
        )}
        {storedEvents.length > 0 && (
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, iCalendarPlugin]}
            initialView="dayGridMonth"
            events={storedEvents}
          />
        )}
      </div>
    )
  );
};

export default FullCalendarBlockView;
