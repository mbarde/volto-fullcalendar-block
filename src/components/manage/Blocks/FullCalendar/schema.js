import messages from './messages.js';

const getViewChoices = (intl) => {
  return [
    ['dayGridMonth', intl.formatMessage(messages.labelDayGridMonth)],
    ['timeGridWeek', intl.formatMessage(messages.labelTimeGridWeek)],
    ['timeGridDay', intl.formatMessage(messages.labelTimeGridDay)],
    ['listMonth', intl.formatMessage(messages.labelListMonth)],
    ['listWeek', intl.formatMessage(messages.labelListWeek)],
    ['listDay', intl.formatMessage(messages.labelListDay)],
  ];
};

const getToolbarChoices = (intl) => {
  return getViewChoices(intl).concat([
    ['next', intl.formatMessage(messages.labelNext)],
    ['prev', intl.formatMessage(messages.lebelPrev)],
    ['today', intl.formatMessage(messages.labelToday)],
    ['title', intl.formatMessage(messages.labelTitle)],
  ]);
};

const getTitleFormats = (intl) => {
  return [
    [
      '{"year": "numeric", "month": "short"}',
      intl.formatMessage(messages.labelTitleShort),
    ],
    [
      '{"year": "numeric", "month": "long"}',
      intl.formatMessage(messages.labelTitleLong),
    ],
    [
      '{"year": "numeric", "month": "short", "day": "numeric"}',
      intl.formatMessage(messages.labelTitleShortWithDay),
    ],
    [
      '{"year": "numeric", "month": "long", "day": "numeric"}',
      intl.formatMessage(messages.labelTitleLongWithDay),
    ],
    [
      '{"year": "2-digit", "month": "2-digit", "day": "2-digit"}',
      intl.formatMessage(messages.labelTitleShortDate),
    ],
    [
      '{"year": "numeric", "month": "2-digit", "day": "2-digit"}',
      intl.formatMessage(messages.labelTitleLongDate),
    ],
  ];
};

const FullCalendarBlockSchema = (intl) => {
  return {
    title: intl.formatMessage(messages.labelCalendarSettings),

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'calendar_url',
          'initial_view',
          'toolbar_left',
          'toolbar_center',
          'toolbar_right',
          'title_format',
        ],
      },
    ],

    properties: {
      calendar_url: {
        title: intl.formatMessage(messages.labelCalendarURL),
        description: intl.formatMessage(messages.descriptionCalendarURL),
        type: 'string',
      },
      initial_view: {
        title: intl.formatMessage(messages.labelInitialView),
        type: 'string',
        factory: 'Choice',
        choices: getViewChoices(intl),
        isMulti: false,
        initialValue: 'dayGridMonth',
      },
      toolbar_left: {
        title: intl.formatMessage(messages.labelToolbarLeft),
        type: 'string',
        factory: 'Choice',
      },
      toolbar_center: {
        title: intl.formatMessage(messages.labelToolbarCenter),
        type: 'string',
        factory: 'Choice',
        choices: getToolbarChoices(intl),
        isMulti: true,
        initialValue: ['title'],
      },
      toolbar_right: {
        title: intl.formatMessage(messages.labelToolbarRight),
        type: 'string',
        factory: 'Choice',
        choices: getToolbarChoices(intl),
        isMulti: true,
        initialValue: ['prev', 'today', 'next'],
      },
      title_format: {
        title: intl.formatMessage(messages.labelTitleFormat),
        type: 'string',
        factory: 'Choice',
        choices: getTitleFormats(intl),
        isMulti: false,
      },
    },

    required: [],
  };
};

export default FullCalendarBlockSchema;
