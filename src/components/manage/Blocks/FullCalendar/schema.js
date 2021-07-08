import { defineMessages } from 'react-intl';

const messages = defineMessages({
  labelCalendarSettings: {
    id: 'Calendar Settings',
    defaultMessage: 'Calendar Settings',
  },
  labelCalendarURL: {
    id: 'Calendar URL',
    defaultMessage: 'Calendar URL',
  }
});

const FullCalendarBlockSchema = (intl) => {
  return {
    title: intl.formatMessage(messages.labelCalendarSettings),

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'calendar_url'
        ],
      },
    ],

    properties: {
      calendar_url: {
        title: intl.formatMessage(messages.labelCalendarURL),
        type: 'string',
      }
    },

    required: []
  };
};

export default FullCalendarBlockSchema;