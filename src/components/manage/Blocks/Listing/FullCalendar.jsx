import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import allLocales from '@fullcalendar/core/locales-all';
import { flattenToAppURL } from '@plone/volto/helpers';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import config from '@plone/volto/registry';
import { RRule, rrulestr } from 'rrule';
import messages from '../FullCalendar/messages';

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
    let dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    let startStr = dateStr + item.start.slice(10);
    let endStr = dateStr + item.end.slice(10);
    /* and return full object for FullCalendar */
    return {
      title: item.title,
      start: startStr,
      end: endStr,
      url: flattenToAppURL(item['@id']),
      groupId: item['@id'],
    };
  });
};

const FullCalendarListing = ({ items, moment: momentlib, ...props }) => {
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
      if (!i.start) return false;
      if (i.recurrence) {
        recurrences = recurrences.concat(expand(i));
        /* expand returns initial event as well, so we skip it here */
        return false;
      }
      return true;
    })
    .map((i) => {
      return {
        ...i,
        title: i.title,
        start: i.start,
        end: i.end || false,
        url: flattenToAppURL(i['@id']),
      };
    });

  events = events.concat(recurrences);

  events = events.map((event) => {
    let start = new Date(event.start);
    let end = new Date(event.end);
    if (
      start.getHours() === 0 &&
      start.getMinutes() === 0 &&
      end.getHours() === 23 &&
      end.getMinutes() === 59
    ) {
      /* full day event */
      event.allDay = true;
    }
    if (
      /* open end event */
      end.getHours() === 23 &&
      end.getMinutes() === 59
    ) {
      delete event.end;
    }
    return event;
  });

  const fcOptions = {
    initialDate: props.initial_date || null,
    plugins: [dayGridPlugin, listPlugin, timeGridPlugin],
    buttonText: {
      dayGridMonth: intl.formatMessage(messages.labelDayGridMonth),
      timeGridWeek: intl.formatMessage(messages.labelTimeGridWeek),
      timeGridDay: intl.formatMessage(messages.labelTimeGridDay),
      listDay: intl.formatMessage(messages.labelListDay),
      listWeek: intl.formatMessage(messages.labelListWeek),
      listMonth: intl.formatMessage(messages.labelListMonth),
      today: intl.formatMessage(messages.labelToday),
    },
    headerToolbar: {
      left: props.toolbar_left?.join(','),
      center: props.toolbar_center?.join(','),
      right: props.toolbar_right?.join(','),
    },
    initialView: props.initial_view ?? 'dayGridMonth',
    titleFormat: {
      year: props.title_format_year,
      month: props.title_format_month,
      day: props.title_format_day,
    },
    locales: allLocales,
    locale: intl.locale ?? 'en',
    didMount: (info) => {
      applyAccessibilityFixes(info.el);
    },
    viewDidMount: (info) => {
      applyAccessibilityFixes(info.el);
    },
    ...(config.settings.fullcalendar?.additionalOptions || {}),
  };

  // Helper function to apply accessibility fixes to the calendar
  const applyAccessibilityFixes = (calendarEl) => {
    // Add scope attributes and unique IDs to table headers for accessibility
    const tableHeaders = calendarEl.querySelectorAll('th');
    tableHeaders.forEach((th, index) => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
      // Always ensure a unique ID exists, even for aria-hidden headers
      if (!th.id || th.id === '') {
        const uniqueId = `fc-header-${Math.random().toString(36).substr(2, 9)}-${index}`;
        th.setAttribute('id', uniqueId);
      }
    });

    // Handle non-functional anchor tags (links without href)
    const fixAnchors = () => {
      const nonFunctionalLinks = calendarEl.querySelectorAll('a:not([href])');
      nonFunctionalLinks.forEach((link) => {
        const parent = link.parentElement;
        if (!parent) return;

        // Check if there's already a span with the same content in the same container
        const spans = Array.from(parent.querySelectorAll('span'));
        const matchingSpan = spans.find(
          (span) => span.textContent.trim() === link.textContent.trim(),
        );

        if (matchingSpan) {
          // If a span already exists, transfer the ID if the span doesn't have one
          if (link.id && !matchingSpan.id) {
            matchingSpan.id = link.id;
          }
          // Remove the redundant anchor
          link.remove();
        } else {
          // If no span exists, convert the anchor to a span to preserve the content
          const span = document.createElement('span');
          Array.from(link.attributes).forEach((attr) => {
            // Include ID when converting, as this replaces the unique element
            span.setAttribute(attr.name, attr.value);
          });
          span.innerHTML = link.innerHTML;
          link.parentNode.replaceChild(span, link);
        }
      });
    };

    fixAnchors();

    // Use MutationObserver for dynamic updates, but ensure we don't loop
    const observer = new MutationObserver((mutations) => {
      // Disconnect temporarily to avoid infinite loop when we modify the DOM
      observer.disconnect();
      fixAnchors();
      fixRedundantTables();
      observer.observe(calendarEl, {
        childList: true,
        subtree: true,
      });
    });

    // Handle redundant one-column tables by turning them into lists semantically
    const fixRedundantTables = () => {
      // Find all tables, including those within fc-scroller or fc-scrollgrid
      const tables = calendarEl.querySelectorAll('table');
      tables.forEach((table) => {
        // If it's already marked as a list, skip it (avoid double processing)
        if (table.getAttribute('role') === 'list') return;

        // Find all rows in the table
        const rows = Array.from(table.querySelectorAll('tr'));
        if (rows.length === 0) return;

        // Check if the table is effectively a single-column table
        let maxCells = 0;
        rows.forEach((row) => {
          const cells = row.querySelectorAll('td, th');
          if (cells.length > maxCells) {
            maxCells = cells.length;
          }
        });

        const isScrollerTable = table.closest('.fc-scroller') !== null;
        const isScrollgrid = table.classList.contains('fc-scrollgrid');

        if (
          maxCells <= 1 ||
          (maxCells > 0 && (isScrollerTable || isScrollgrid) && rows.length > 0)
        ) {
          if (maxCells <= 1) {
            table.setAttribute('role', 'list');
            table.removeAttribute('aria-labelledby');

            rows.forEach((row) => {
              const cells = row.querySelectorAll('td, th');
              if (cells.length === 1) {
                row.setAttribute('role', 'listitem');
                cells[0].setAttribute('role', 'presentation');
              } else if (cells.length === 0) {
                row.setAttribute('role', 'presentation');
              }
            });
          }
        }
      });

      // Special handling for the main scrollgrid if it's being problematic
      const scrollGrids = calendarEl.querySelectorAll('.fc-scrollgrid');
      scrollGrids.forEach((grid) => {
        const topLevelRows = grid.querySelectorAll(
          ':scope > tbody > tr, :scope > thead > tr',
        );
        if (topLevelRows.length > 0) {
          let isSingleColGrid = true;
          topLevelRows.forEach((row) => {
            if (row.querySelectorAll(':scope > td, :scope > th').length > 1) {
              isSingleColGrid = false;
            }
          });

          if (isSingleColGrid) {
            grid.setAttribute('role', 'list');
            topLevelRows.forEach((row) => {
              row.setAttribute('role', 'listitem');
              const cell = row.querySelector(':scope > td, :scope > th');
              if (cell) cell.setAttribute('role', 'presentation');
            });
          }
        }
      });
    };

    fixAnchors();
    fixRedundantTables();

    observer.observe(calendarEl, {
      childList: true,
      subtree: true,
    });
  };

  return isClientSide && <FullCalendar events={events} {...fcOptions} />;
};

export default injectLazyLibs(['moment'])(FullCalendarListing);
