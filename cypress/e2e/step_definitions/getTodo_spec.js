import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given(/^send request to getting todo with id ([^"]*)$/, (id) => {
  cy.request({
    method: 'GET',
    url: `/todos/${id}`,
    headers: {
      Accept: 'application/json',
    },
  })
    .as('getTodo')
    .then((res) => {
      expect(res.status).to.eq(200);
      cy.wrap(res.body).as('getTodoBody');
    });
});

Then(/^user id should be ([^"]*)$/, (userId) => {
  cy.get('@getTodoBody').then((body) => {
    expect(body.userId).to.eq(parseInt(userId));
  });
});

Then(/^title should be ([^"]*)$/, (title) => {
  cy.get('@getTodoBody').then((body) => {
    expect(body.title).to.eq(title);
  });
});
