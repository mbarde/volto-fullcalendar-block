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
        choices: getToolbarChoices(intl),
        isMulti: true,
        initialValue: ['dayGridMonth', 'timeGridWeek', 'timeGridDay'],
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
    },

    required: [],
  };
};

export default FullCalendarBlockSchema;
