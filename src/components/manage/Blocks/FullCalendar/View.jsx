import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import FullCalendar from '@fullcalendar/react';
import { Dimmer, Loader } from 'semantic-ui-react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import iCalendarPlugin from '@fullcalendar/icalendar';
import allLocales from '@fullcalendar/core/locales-all';
import config from '@plone/volto/registry';
import './fullcalendar.less';
import messages from './messages';

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

const FullCalendarBlockView = (props) => {
  const intl = useIntl();

  /* server-side rendering with FullCalendar does not work here,
     so we need to render after client-side hydration - as described here:
     https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect
  */
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

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
  const [storedEvents, setStoredEvents] = useState([]);

  useEffect(() => {
    if (data.calendar_url && isValidURL(data.calendar_url)) {
      setStoredEvents(null);
    }
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
    initialDate: data.initial_date || null,
    plugins: [dayGridPlugin, iCalendarPlugin, listPlugin, timeGridPlugin],
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
      left: data.toolbar_left?.join(','),
      center: data.toolbar_center?.join(','),
      right: data.toolbar_right?.join(','),
    },
    initialView: data.initial_view ?? 'dayGridMonth',
    titleFormat: {
      year: data.title_format_year,
      month: data.title_format_month,
      day: data.title_format_day,
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
    if (!calendarEl) return;

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
        // We look at the maximum number of cells in any row
        let maxCells = 0;
        rows.forEach((row) => {
          const cells = row.querySelectorAll('td, th');
          if (cells.length > maxCells) {
            maxCells = cells.length;
          }
        });

        // If it's a single column table (maxCells <= 1)
        // OR if it's a specific FullCalendar table that behaves like a list in this view
        const isScrollerTable = table.closest('.fc-scroller') !== null;
        const isScrollgrid = table.classList.contains('fc-scrollgrid');

        if (
          maxCells <= 1 ||
          (maxCells > 0 && (isScrollerTable || isScrollgrid) && rows.length > 0)
        ) {
          // If it's single column, we definitely want it as a list
          // If it's a scroller/scrollgrid table and only has one column in this specific instance
          if (maxCells <= 1) {
            table.setAttribute('role', 'list');
            // Remove grid specific attributes if they exist
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
        // If the scrollgrid itself is being flagged as redundant (one main column of content)
        // verify its structure.
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

  return (
    isClientSide && (
      <div className="calendar-wrapper">
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
