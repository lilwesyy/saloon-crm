describe('Login Flow', () => {
  beforeEach(() => {
    // Reset the state before each test
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('[data-testid="email-input"]').should('exist');
    cy.get('[data-testid="password-input"]').should('exist');
    cy.get('[data-testid="login-button"]').should('exist');
  });

  it('should show error with invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();
    
    // Check for error message
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should redirect to dashboard after successful login', () => {
    // This test assumes there is a test user with these credentials
    // We will intercept the API call to mock a successful response
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

    cy.get('[data-testid="email-input"]').type('admin@example.com');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="login-button"]').click();
    
    cy.wait('@loginRequest');
    cy.url().should('include', '/dashboard');
  });
});
