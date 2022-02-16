import calendarSVG from '@plone/volto/icons/calendar.svg';
import {
  FullCalendarBlockView,
  FullCalendarBlockEdit,
  FullCalendarListing,
} from './components';
import FullCalendarBlockSchema from './components/manage/Blocks/FullCalendar/schema';

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
      /* use schemaEnhancer to add fields of FullCalendarBlock here */
      schemaEnhancer: ({ schema, formData, intl }) => {
        const blockSchema = FullCalendarBlockSchema(intl);
        Object.keys(blockSchema.properties).forEach((key) => {
          if (key !== 'calendar_url') {
            schema.properties[key] = blockSchema.properties[key];
            schema.fieldsets[0].fields.push(key);
          }
        });
        return schema;
      },
    },
  ];
  return config;
};

export default applyConfig;
