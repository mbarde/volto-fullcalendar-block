import React, { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import { Dimmer, Loader } from 'semantic-ui-react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
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
     (btw we let FullCalendar do the loading since it handles CORS quite well)
  */
  const [storedEvents, setStoredEvents] = useState(null);
  useEffect(() => {
    setStoredEvents(null);
  }, [data.calendar_url]);

  /* since FullCalendar fires the `loading` callback multiple times
     we need to introduce this flag to avoid prematurely switching to `storedEvents`:
  */
  var isFullCalendarLoading = false;

  const onLoading = (isLoading) => {
    if (isLoading === false) {
      isFullCalendarLoading = false;
      setTimeout(() => {
        if (!isFullCalendarLoading && calendarRef.current) {
          let events = calendarRef.current.getApi().getEvents();
          setStoredEvents(events);
        }
      });
    } else {
      isFullCalendarLoading = true;
    }
  };

  const fcOptions = {
    plugins: [
      dayGridPlugin,
      iCalendarPlugin,
      listPlugin,
      timeGridPlugin,
    ],
    buttonText: {
      listWeek: 'List week',
      listMonth: 'List month'
    },
    headerToolbar: {
      left: 'dayGridMonth,timeGridWeek,timeGridDay',
      center: 'listWeek,listMonth',
      right: 'prev,next today',
    },
    initialView: 'dayGridMonth'
  };

  return (
    isClientSide && (
      <div class="calendar-wrapper">
        {storedEvents === null && (
          <>
            <Dimmer active inverted>
              <Loader inverted size="massive" />
            </Dimmer>
            <FullCalendar
              ref={calendarRef}
              events={remoteEvents}
              loading={(isLoading) => onLoading(isLoading)}
              {...fcOptions}
            />
          </>
        )}
        {storedEvents !== null && (
          <FullCalendar
            ref={calendarRef}
            events={storedEvents}
            {...fcOptions}
          />
        )}
      </div>
    )
  );
};

export default FullCalendarBlockView;
