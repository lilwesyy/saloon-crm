describe('Client Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          _id: '123',
          email: 'admin@example.com',
          nome: 'Admin',
          cognome: 'User',
          ruolo: 'admin'
        }
      }
    }).as('loginRequest');
    
    cy.login('admin@example.com', 'password');
    cy.wait('@loginRequest');
    
    // Navigate to clients page
    cy.visit('/clienti');
  });

  it('should display client list', () => {
    // Mock the API response for client list
    cy.intercept('GET', '/api/clienti*', {
      statusCode: 200,
      body: {
        clienti: [
          {
            _id: '1',
            nome: 'Mario',
            cognome: 'Rossi',
            email: 'mario.rossi@example.com',
            telefono: '3331234567'
          },
          {
            _id: '2',
            nome: 'Laura',
            cognome: 'Bianchi',
            email: 'laura.bianchi@example.com',
            telefono: '3387654321'
          }
        ],
        total: 2,
        page: 1,
        limit: 10
      }
    }).as('getClienti');
    
    cy.wait('@getClienti');
    
    // Verify client list is displayed
    cy.get('[data-testid="client-list"]').should('exist');
    cy.contains('Mario Rossi').should('be.visible');
    cy.contains('Laura Bianchi').should('be.visible');
  });

  it('should open client details', () => {
    // Mock client list
    cy.intercept('GET', '/api/clienti*', {
      statusCode: 200,
      body: {
        clienti: [
          {
            _id: '1',
            nome: 'Mario',
            cognome: 'Rossi',
            email: 'mario.rossi@example.com',
            telefono: '3331234567'
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      }
    }).as('getClienti');
    
    // Mock specific client details
    cy.intercept('GET', '/api/clienti/1', {
      statusCode: 200,
      body: {
        _id: '1',
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@example.com',
        telefono: '3331234567',
        dataNascita: '1990-01-01',
        note: 'Cliente abituale'
      }
    }).as('getClienteDetails');
    
    cy.wait('@getClienti');
    
    // Click on client
    cy.contains('Mario Rossi').click();
    
    cy.wait('@getClienteDetails');
    
    // Verify client details modal or page
    cy.get('[data-testid="client-details"]').should('be.visible');
    cy.contains('mario.rossi@example.com').should('be.visible');
    cy.contains('3331234567').should('be.visible');
  });

  it('should create a new client', () => {
    // Mock API endpoint for client creation
    cy.intercept('POST', '/api/clienti', {
      statusCode: 201,
      body: {
        _id: '3',
        nome: 'Anna',
        cognome: 'Verdi',
        email: 'anna.verdi@example.com',
        telefono: '3399876543'
      }
    }).as('createCliente');
    
    // Click new client button
    cy.get('[data-testid="new-client-button"]').click();
    
    // Fill the form
    cy.get('[data-testid="input-nome"]').type('Anna');
    cy.get('[data-testid="input-cognome"]').type('Verdi');
    cy.get('[data-testid="input-email"]').type('anna.verdi@example.com');
    cy.get('[data-testid="input-telefono"]').type('3399876543');
    
    // Submit form
    cy.get('[data-testid="submit-client"]').click();
    
    cy.wait('@createCliente');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});
