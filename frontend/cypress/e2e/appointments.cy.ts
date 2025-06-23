describe('Appointment Management', () => {
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
    
    // Navigate to appointments page
    cy.visit('/appuntamenti');
  });

  it('should display calendar with appointments', () => {
    // Mock API response for appointments
    cy.intercept('GET', '/api/appuntamenti*', {
      statusCode: 200,
      body: {
        appuntamenti: [
          {
            _id: '101',
            data: new Date().toISOString(),
            cliente: {
              _id: '1',
              nome: 'Mario',
              cognome: 'Rossi'
            },
            servizio: {
              _id: '201',
              nome: 'Taglio',
              durata: 30
            },
            stato: 'confermato',
            orario: {
              inizio: '14:00',
              fine: '14:30'
            }
          }
        ]
      }
    }).as('getAppuntamenti');
    
    cy.wait('@getAppuntamenti');
    
    // Verify calendar is displayed with appointment
    cy.get('[data-testid="calendar"]').should('exist');
    cy.contains('Mario Rossi').should('be.visible');
    cy.contains('Taglio').should('be.visible');
  });

  it('should create a new appointment', () => {
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
    
    // Mock appointment creation endpoint
    cy.intercept('POST', '/api/appuntamenti', {
      statusCode: 201,
      body: {
        _id: '102',
        data: new Date().toISOString(),
        cliente: {
          _id: '1',
          nome: 'Mario',
          cognome: 'Rossi'
        },
        servizio: {
          _id: '201',
          nome: 'Taglio',
          durata: 30
        },
        stato: 'confermato',
        orario: {
          inizio: '16:00',
          fine: '16:30'
        }
      }
    }).as('createAppuntamento');
    
    // Click new appointment button
    cy.get('[data-testid="new-appointment-button"]').click();
    
    // Select date and time
    cy.get('[data-testid="date-picker"]').click();
    cy.get('.current-month .day').first().click(); // Select first day of current month
    cy.get('[data-testid="time-picker"]').select('16:00');
    
    // Select client
    cy.get('[data-testid="client-select"]').click();
    cy.wait('@getClienti');
    cy.contains('Mario Rossi').click();
    
    // Select service
    cy.get('[data-testid="service-select"]').click();
    cy.wait('@getServizi');
    cy.contains('Taglio').click();
    
    // Submit form
    cy.get('[data-testid="submit-appointment"]').click();
    
    cy.wait('@createAppuntamento');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should update appointment status', () => {
    // Mock API response for appointments
    cy.intercept('GET', '/api/appuntamenti*', {
      statusCode: 200,
      body: {
        appuntamenti: [
          {
            _id: '101',
            data: new Date().toISOString(),
            cliente: {
              _id: '1',
              nome: 'Mario',
              cognome: 'Rossi'
            },
            servizio: {
              _id: '201',
              nome: 'Taglio',
              durata: 30
            },
            stato: 'confermato',
            orario: {
              inizio: '14:00',
              fine: '14:30'
            }
          }
        ]
      }
    }).as('getAppuntamenti');
    
    // Mock appointment update endpoint
    cy.intercept('PUT', '/api/appuntamenti/101', {
      statusCode: 200,
      body: {
        _id: '101',
        stato: 'completato'
      }
    }).as('updateAppuntamento');
    
    cy.wait('@getAppuntamenti');
    
    // Click on appointment
    cy.contains('Mario Rossi').click();
    
    // Change status
    cy.get('[data-testid="status-select"]').select('completato');
    
    // Save changes
    cy.get('[data-testid="save-status"]').click();
    
    cy.wait('@updateAppuntamento');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});
