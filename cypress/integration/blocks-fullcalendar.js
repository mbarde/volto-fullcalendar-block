import { setupBeforeEach, tearDownAfterEach } from '../support';

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('add FullCalendar for Listing', () => {
    let pageTitle = 'Listing as FullCalender';

    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block')
      .clear()
      .type(pageTitle)
      .get('.documentFirstHeading span[data-text]')
      .contains(pageTitle);

    // add listing block
    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block').type(
      '{enter}',
    );
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.ui.basic.icon.button.listing').first().click();

    // set variation to FullCalendar
    cy.get('#fieldset-default-field-label-initial_view').should('not.exist');
    cy.get('#field-variation > .react-select__control').type('FullCalendar{enter}');
    cy.get('#fieldset-default-field-label-initial_view').should('be.visible');

    // filter for content type events
    cy.get('#field-query-0-querystring').type('Type{enter}');
    cy.get('#default-query-0-querystring > div > div:nth-child(2) > div > div:nth-child(1) > div.field > div > div.react-select__control').type('Event{enter}');

    cy.get('#toolbar-save').click();

    cy.get('.block.listing.fullcalendar').contains('No results found.');

    // create new event
    cy.navigate('/cypress');
    cy.get('#toolbar-add').click();
    cy.get('#toolbar-add-event').click();
    cy.get('#field-title').type('My event');
    cy.get('#toolbar-save').click();

    // now calendar with new event should be visible
    cy.navigate('/cypress/my-page');
    cy.get('.fc-today-button').contains('Today');
    cy.get('.calendar-wrapper .ui.dimmer').should('not.exist');
    cy.get('.fc-daygrid-event-harness').should('not.be.empty');
    cy.get('.block.listing.fullcalendar').contains('My event');
  })

  it('add FullCalendar block (empty)', () => {
    let pageTitle = 'Empty FullCalender';

    // Change page title
    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block')
      .clear()
      .type(pageTitle)
      .get('.documentFirstHeading span[data-text]')
      .contains(pageTitle);

    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block').type(
      '{enter}',
    );

    // Add fullcalendar block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.ui.basic.icon.button.fullcalendar').contains('FullCalendar').click();
    cy.get('.fc-today-button').contains('Today');

    cy.get('.calendar-wrapper .ui.loader').should('not.exist');
    cy.get('.fc-daygrid-event-harness').should('not.exist');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // Then the page view should contain our changes
    cy.contains(pageTitle);
    cy.get('.fc-today-button').contains('Today');

    // No events should be loaded
    cy.get('.calendar-wrapper .ui.loader').should('not.exist');
    cy.get('.fc-daygrid-event-harness').should('not.exist');
  });

  it('add FullCalendar block (with events)', () => {
    let pageTitle = 'FullCalendar with events';

    // Change page title
    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block')
      .clear()
      .type(pageTitle)
      .get('.documentFirstHeading span[data-text]')
      .contains(pageTitle);

    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block').type(
      '{enter}',
    );

    // Add fullcalendar block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.ui.basic.icon.button.fullcalendar').contains('FullCalendar').click();
    cy.get('.fc-today-button').contains('Today');
    cy.get('.fc-daygrid-event-harness').should('not.exist');

    // Add URL
    let testURL = 'https://events.uni-koblenz-landau.de/?source=Veranstaltungskalender-KO';
    cy.get("#field-calendar_url")
      .invoke('val', testURL)
      .type(' {enter}');

    cy.get('.calendar-wrapper .ui.dimmer').should('be.visible');
    cy.get('.calendar-wrapper .ui.dimmer').should('not.exist');
    cy.get('.fc-daygrid-event-harness').should('not.be.empty');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // Then the page view should contain our changes
    cy.contains(pageTitle);

    cy.get('.calendar-wrapper .ui.dimmer').should('be.visible');
    cy.get('.fc-today-button').contains('Today');

    // Wait until events are loaded
    cy.get('.calendar-wrapper .ui.dimmer').should('not.exist');
    cy.get('.fc-daygrid-event-harness').should('not.be.empty');
  });
});
