# volto-fullcalendar-block

Block for [Volto](https://github.com/plone/volto) to display events from an iCal/ics file in a [FullCalendar](https://fullcalendar.io/).

![Demo](https://raw.githubusercontent.com/mbarde/volto-fullcalendar-block/docs/docs/demo.gif)

## Features

Specifiy an URL to an .ics/.iCal file. Contained events are displayed in the calendar using FullCalendars [iCalendar plugin](https://fullcalendar.io/docs/icalendar).

## Setup

### Add volto-fullcalendar-block to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

2. Start Volto frontend

- If you already have a volto project, just update `package.json`:

  ```JSON
  "addons": [
      "@mbarde/volto-fullcalendar-block"
  ],

  "dependencies": {
      "@mbarde/volto-fullcalendar-block": "^0.5.0"
  }
  ```

- If not, create one:

  ```
  npm install -g yo @plone/generator-volto
  yo @plone/volto my-volto-project --addon @mbarde/volto-fullcalendar-block
  cd my-volto-project
  ```

3. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

4. Go to http://localhost:3000

## Tests

Expects Volto to run on `http://localhost:3000` by default (see `cypress.json`).

Run tests: `yarn cypres:run`
