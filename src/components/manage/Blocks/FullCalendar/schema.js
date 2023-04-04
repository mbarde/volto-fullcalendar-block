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
  const viewChoices = getViewChoices(intl);
  const toolbarChoices = getToolbarChoices(intl);

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
          'title_format_year',
          'title_format_month',
          'title_format_day',
          'initial_date',
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
        choices: viewChoices,
        isMulti: false,
        default: 'dayGridMonth',
      },
      toolbar_left: {
        title: intl.formatMessage(messages.labelToolbarLeft),
        type: 'string',
        factory: 'Choice',
        choices: toolbarChoices,
        isMulti: true,
        default: ['dayGridMonth', 'timeGridWeek', 'timeGridDay'],
      },
      toolbar_center: {
        title: intl.formatMessage(messages.labelToolbarCenter),
        type: 'string',
        factory: 'Choice',
        choices: toolbarChoices,
        isMulti: true,
        default: ['title'],
      },
      toolbar_right: {
        title: intl.formatMessage(messages.labelToolbarRight),
        type: 'string',
        factory: 'Choice',
        choices: toolbarChoices,
        isMulti: true,
        default: ['prev', 'today', 'next'],
      },
      title_format_year: {
        title: intl.formatMessage(messages.labelTitleFormatYear),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['numeric', intl.formatMessage(messages.labelTitleNumeric)],
          ['2-digit', intl.formatMessage(messages.labelTitle2Digit)],
        ],
        isMulti: false,
        default: 'numeric',
      },
      title_format_month: {
        title: intl.formatMessage(messages.labelTitleFormatMonth),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['short', intl.formatMessage(messages.labelTitleShort)],
          ['long', intl.formatMessage(messages.labelTitleLong)],
          ['2-digit', intl.formatMessage(messages.labelTitle2Digit)],
        ],
        isMulti: false,
        default: 'long',
      },
      title_format_day: {
        title: intl.formatMessage(messages.labelTitleFormatDay),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['numeric', intl.formatMessage(messages.labelTitleNumeric)],
          ['2-digit', intl.formatMessage(messages.labelTitle2Digit)],
        ],
        isMulti: false,
      },
      initial_date: {
        title: intl.formatMessage(messages.labelInitialDate),
        description: intl.formatMessage(messages.descriptionInitialDate),
        type: 'datetime',
        dateOnly: true,
      },
    },

    required: [],
  };
};

export default FullCalendarBlockSchema;
