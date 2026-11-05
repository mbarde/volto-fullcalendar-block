import React from 'react';
import loadable from '@loadable/component';
import { Loader } from 'semantic-ui-react';

// Lazy load the components using @loadable/component
const FullCalendarBlockEdit = loadable(
  () => import('./manage/Blocks/FullCalendar/Edit'),
  {
    fallback: (
      <div>
        <Loader active inline="centered" />
        <p>Loading...</p>
      </div>
    ),
  },
);

const FullCalendarBlockView = loadable(
  () => import('./manage/Blocks/FullCalendar/View'),
  {
    fallback: (
      <div>
        <Loader active inline="centered" />
        <p>Loading...</p>
      </div>
    ),
  },
);

const FullCalendarListing = loadable(
  () => import('./manage/Blocks/Listing/FullCalendar'),
  {
    fallback: (
      <div>
        <Loader active inline="centered" />
        <p>Loading...</p>
      </div>
    ),
  },
);

// Export the components with the original names
export { FullCalendarBlockEdit, FullCalendarBlockView, FullCalendarListing };
