import { defineMessages } from 'react-intl';

const messages = defineMessages({
  labelCalendarSettings: {
    id: 'Calendar Settings',
    defaultMessage: 'Calendar Settings',
  },
  labelCalendarURL: {
    id: 'Calendar URL',
    defaultMessage: 'Calendar URL',
  },
  descriptionCalendarURL: {
    id: 'Must point to an iCal/ics file.',
    defaultMessage: 'Must point to an iCal/ics file.',
  },
});

const FullCalendarBlockSchema = (intl) => {
  return {
    title: intl.formatMessage(messages.labelCalendarSettings),

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['calendar_url'],
      },
    ],

    properties: {
      calendar_url: {
        title: intl.formatMessage(messages.labelCalendarURL),
        description: intl.formatMessage(messages.descriptionCalendarURL),
        type: 'string',
      },
    },

    required: [],
  };
};

export default FullCalendarBlockSchema;
