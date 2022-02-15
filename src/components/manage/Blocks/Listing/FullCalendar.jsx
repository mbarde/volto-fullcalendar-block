import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import allLocales from '@fullcalendar/core/locales-all';
import { flattenToAppURL } from '@plone/volto/helpers';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { RRule, rrulestr } from 'rrule';

/* returns all events, computed by the reccurence rule of an Event item */
const expand = (item) => {
  let recurrence = item.recurrence;
  if (item.recurrence.indexOf('DTSTART') < 0) {
    var dtstart = RRule.optionsToString({
      dtstart: new Date(item.start),
    });
    recurrence = dtstart + '\n' + recurrence;
  }

  const rrule = rrulestr(recurrence, { unfold: true, forceset: true });

  return rrule.all().map((date) => {
    /* rrule.all() only gives us dates, so we add time part of
       our original event: item.start (`2022-03-01T09:00:00+00:00`) */
    let startStr = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    startStr = startStr + item.start.slice(10);
    /* and return full object for FullCalendar */
    return {
      title: item.title,
      start: startStr,
      url: flattenToAppURL(item['@id']),
    };
  });
};

const FullCalendarListing = ({ items, moment: momentlib }) => {
  const intl = useIntl();

  const moment = momentlib.default;
  moment.locale(intl.locale);

  /* server-side rendering with FullCalendar does not work here,
     so we need to render after client-side hydration - as described here:
     https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect
  */
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  let recurrences = [];

  let events = items
    .filter((i) => {
      if (i['@type'] !== 'Event') return false;
      if (i.recurrence) {
        recurrences = recurrences.concat(expand(i));
        /* expand returns initial event as well, so we skip it here */
        return false;
      }
      return true;
    })
    .map((i) => {
      return {
        title: i.title,
        start: i.start,
        end: i.end,
        url: flattenToAppURL(i['@id']),
      };
    });

  events = events.concat(recurrences);

  const fcOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locales: allLocales,
    locale: intl.locale ?? 'en',
  };

  return isClientSide && <FullCalendar events={events} {...fcOptions} />;
};

export default injectLazyLibs(['moment'])(FullCalendarListing);
