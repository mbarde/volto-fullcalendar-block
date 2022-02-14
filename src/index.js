import calendarSVG from '@plone/volto/icons/calendar.svg';
import { FullCalendarBlockView, FullCalendarBlockEdit } from './components';

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
  return config;
};

export default applyConfig;
