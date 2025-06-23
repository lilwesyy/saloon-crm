describe('Payment Management', () => {
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
    
    // Navigate to payments page
    cy.visit('/pagamenti');
  });

  it('should display payment list', () => {
    // Mock API response for payments
    cy.intercept('GET', '/api/pagamenti*', {
      statusCode: 200,
      body: {
        pagamenti: [
          {
            _id: '301',
            data: new Date().toISOString(),
            importo: 50,
            cliente: {
              _id: '1',
              nome: 'Mario',
              cognome: 'Rossi'
            },
            servizio: {
              _id: '201',
              nome: 'Taglio'
            },
            metodoPagamento: 'carta',
            stato: 'confermato'
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      }
    }).as('getPagamenti');
    
    cy.wait('@getPagamenti');
    
    // Verify payments are displayed
    cy.get('[data-testid="payments-list"]').should('exist');
    cy.contains('Mario Rossi').should('be.visible');
    cy.contains('€ 50').should('be.visible');
  });

  it('should register a new payment', () => {
    // Mock client list for dropdown
    cy.intercept('GET', '/api/clienti*', {
      statusCode: 200,
      body: {
        clienti: [
          {
            _id: '1',
            nome: 'Mario',
            cognome: 'Rossi',
            email: 'mario.rossi@example.com'
          }
        ],
        total: 1
      }
    }).as('getClienti');
    
    // Mock services list for dropdown
    cy.intercept('GET', '/api/servizi*', {
      statusCode: 200,
      body: {
        servizi: [
          {
            _id: '201',
            nome: 'Taglio',
            durata: 30,
            prezzo: 20
          }
        ]
      }
    }).as('getServizi');
    
    // Mock payment creation endpoint
    cy.intercept('POST', '/api/pagamenti', {
      statusCode: 201,
      body: {
        _id: '302',
        data: new Date().toISOString(),
        importo: 20,
        cliente: {
          _id: '1',
          nome: 'Mario',
          cognome: 'Rossi'
        },
        servizio: {
          _id: '201',
          nome: 'Taglio'
        },
        metodoPagamento: 'contanti',
        stato: 'confermato'
      }
    }).as('createPagamento');
    
    // Click new payment button
    cy.get('[data-testid="new-payment-button"]').click();
    
    // Select client
    cy.get('[data-testid="client-select"]').click();
    cy.wait('@getClienti');
    cy.contains('Mario Rossi').click();
    
    // Select service
    cy.get('[data-testid="service-select"]').click();
    cy.wait('@getServizi');
    cy.contains('Taglio').click();
    
    // Enter amount
    cy.get('[data-testid="amount-input"]').type('20');
    
    // Select payment method
    cy.get('[data-testid="payment-method"]').select('contanti');
    
    // Submit form
    cy.get('[data-testid="submit-payment"]').click();
    
    cy.wait('@createPagamento');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});
