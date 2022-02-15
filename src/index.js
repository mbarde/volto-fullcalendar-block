import calendarSVG from '@plone/volto/icons/calendar.svg';
import {
  FullCalendarBlockView,
  FullCalendarBlockEdit,
  FullCalendarListing,
} from './components';

const applyConfig = (config) => {
  config.blocks.blocksConfig.fullcalendar = {
    id: 'fullcalendar',
    title: 'FullCalendar',
    icon: calendarSVG,
    group: 'common',
    view: FullCalendarBlockView,
    edit: FullCalendarBlockEdit,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  config.blocks.blocksConfig.listing.variations = [
    ...config.blocks.blocksConfig.listing.variations,
    {
      id: 'fullcalendar',
      isDefault: false,
      title: 'FullCalendar',
      template: FullCalendarListing,
    },
  ];
  return config;
};

export default applyConfig;
