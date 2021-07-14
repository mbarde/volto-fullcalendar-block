# volto-fullcalendar-block

Block for [Volto](https://github.com/plone/volto) to display events from an iCal/ics file in a [FullCalendar](https://fullcalendar.io/).

![Demo](https://raw.githubusercontent.com/mbarde/volto-fullcalendar-block/docs/docs/demo.gif)

## Features

Specifiy an URL to an .ics/.iCal file. Contained events are displayed in the calendar using FullCalendars [iCalendar plugin](https://fullcalendar.io/docs/icalendar).

## Tests

Expects Volto to run on `http://localhost:3000` by default (see `cypress.json`).

Run tests: `yarn cypres:run`