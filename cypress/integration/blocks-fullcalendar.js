import { setupBeforeEach, tearDownAfterEach } from '../support';

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

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
    cy.get('.fc-today-button').contains('today');

    cy.get('.fc-loader-wrapper .ui.loader').should('not.be.visible');
    cy.get('.fc-daygrid-event-harness').should('not.exist');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // Then the page view should contain our changes
    cy.contains(pageTitle);
    cy.get('.fc-today-button').contains('today');

    // No events should be loaded
    cy.get('.fc-loader-wrapper .ui.loader').should('not.be.visible');
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
    cy.get('.fc-today-button').contains('today');
    cy.get('.fc-daygrid-event-harness').should('not.exist');

    // Add URL
    cy.get('#field-calendar_url').type('https://events.uni-koblenz.de');
    cy.get('.fc-loader-wrapper .ui.loader').should('be.visible');
    cy.get('.fc-loader-wrapper .ui.loader').should('not.be.visible');
    cy.get('.fc-daygrid-event-harness').should('not.be.empty');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // Then the page view should contain our changes
    cy.contains(pageTitle);
    cy.get('.fc-today-button').contains('today');

    // Wait until events are loaded
    // minor bug: loader is not visible after page is saved
    cy.get('.fc-loader-wrapper .ui.loader').should('not.be.visible');
    cy.get('.fc-daygrid-event-harness').should('not.be.empty');
  });

});