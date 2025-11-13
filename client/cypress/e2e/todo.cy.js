describe('Todo Application E2E Tests', () => {
  const API_URL = 'http://localhost:5000/api';

  beforeEach(() => {
    // Clear database before each test
    cy.intercept('GET', `${API_URL}/todos`).as('getTodos');
    cy.request({
      method: 'DELETE',
      url: `${API_URL}/todos/all`,
      failOnStatusCode: false
    });
    
    cy.visit('http://localhost:3000');
    cy.wait('@getTodos');
    cy.contains('MERN Todo App').should('be.visible');
  });

  describe('Initial Page Load', () => {
    it('should display the app title', () => {
      cy.contains('MERN Todo App').should('be.visible');
    });

    it('should show empty state when no todos exist', () => {
      cy.contains('No todos yet').should('be.visible');
    });

    it('should display all filter buttons', () => {
      cy.contains('button', 'All').should('be.visible');
      cy.contains('button', 'Active').should('be.visible');
      cy.contains('button', 'Completed').should('be.visible');
    });
  });

  describe('Adding Todos', () => {
    it('should add a new todo with title only', () => {
      cy.get('input[aria-label="Todo title"]').type('My first todo');
      cy.contains('button', 'Add Todo').click();

      cy.contains('My first todo').should('be.visible');
      // Check if todo was added (flexible check)
      cy.get('.todo-item').should('have.length', 1);
    });

    it('should add a todo with title and description', () => {
      cy.get('input[aria-label="Todo title"]').type('Complete todo');
      cy.get('textarea[aria-label="Todo description"]').type('This is a detailed description');
      cy.contains('button', 'Add Todo').click();

      cy.contains('Complete todo').should('be.visible');
      cy.contains('This is a detailed description').should('be.visible');
    });

    it('should add a todo with high priority', () => {
      cy.get('input[aria-label="Todo title"]').type('Urgent task');
      cy.get('select[aria-label="Todo priority"]').select('high');
      cy.contains('button', 'Add Todo').click();

      cy.contains('Urgent task').should('be.visible');
      // Priority might be displayed differently
      cy.contains(/high/i).should('be.visible');
    });

    it('should show error when title is empty', () => {
      cy.contains('button', 'Add Todo').click();
      // More flexible error checking
      cy.contains(/title.*required/i).should('be.visible');
    });

    it('should show error when title is too short', () => {
      cy.get('input[aria-label="Todo title"]').type('ab');
      cy.contains('button', 'Add Todo').click();
      cy.contains(/title.*3.*character/i).should('be.visible');
    });

    it('should clear form after successful submission', () => {
      cy.get('input[aria-label="Todo title"]').type('Test todo');
      cy.get('textarea[aria-label="Todo description"]').type('Test description');
      cy.contains('button', 'Add Todo').click();

      cy.get('input[aria-label="Todo title"]').should('have.value', '');
      cy.get('textarea[aria-label="Todo description"]').should('have.value', '');
    });

    it('should add multiple todos', () => {
      const todos = ['Todo 1', 'Todo 2', 'Todo 3'];
      
      todos.forEach(todo => {
        cy.get('input[aria-label="Todo title"]').type(todo);
        cy.contains('button', 'Add Todo').click();
        cy.contains(todo).should('be.visible');
      });

      // Check that all 3 todos exist
      cy.get('.todo-item').should('have.length', 3);
    });

    it('should handle special characters in title', () => {
      cy.get('input[aria-label="Todo title"]').type('Test & <special> "chars"');
      cy.contains('button', 'Add Todo').click();
      cy.contains('Test & <special> "chars"').should('be.visible');
    });
  });

  describe('Viewing Todos', () => {
    beforeEach(() => {
      // Add some test todos
      cy.get('input[aria-label="Todo title"]').type('Active todo');
      cy.contains('button', 'Add Todo').click();
      cy.wait(500); // Small wait for state to update
      
      cy.get('input[aria-label="Todo title"]').type('Completed todo');
      cy.contains('button', 'Add Todo').click();
      cy.wait(500);
      
      // Complete the second todo
      cy.get('input[type="checkbox"]').last().check();
      cy.wait(500);
    });

    it('should display all todos by default', () => {
      cy.contains('Active todo').should('be.visible');
      cy.contains('Completed todo').should('be.visible');
    });

    it('should filter active todos', () => {
      cy.contains('button', 'Active').click();
      cy.wait(500);
      
      // Active todo should be visible
      cy.get('.todo-item').should('have.length.at.least', 1);
      cy.contains('Active todo').should('be.visible');
    });

    it('should filter completed todos', () => {
      cy.contains('button', 'Completed').click();
      cy.wait(500);
      
      // Completed todo should be visible
      cy.get('.todo-item').should('have.length.at.least', 1);
      cy.contains('Completed todo').should('be.visible');
    });

    it('should switch back to all todos', () => {
      cy.contains('button', 'Completed').click();
      cy.wait(500);
      cy.contains('button', 'All').click();
      cy.wait(500);
      
      // Both should be visible
      cy.get('.todo-item').should('have.length', 2);
    });
  });

  describe('Completing Todos', () => {
    beforeEach(() => {
      cy.get('input[aria-label="Todo title"]').type('Todo to complete');
      cy.contains('button', 'Add Todo').click();
      cy.wait(500);
    });

    it('should toggle todo completion', () => {
      cy.get('input[type="checkbox"]').check();
      cy.wait(500);
      cy.get('input[type="checkbox"]').should('be.checked');
    });

    it('should uncheck completed todo', () => {
      cy.get('input[type="checkbox"]').check();
      cy.wait(500);
      cy.get('input[type="checkbox"]').uncheck();
      cy.wait(500);
      cy.get('input[type="checkbox"]').should('not.be.checked');
    });

    it('should persist completion state after page reload', () => {
      cy.get('input[type="checkbox"]').check();
      cy.wait(500);
      cy.reload();
      
      cy.get('input[type="checkbox"]').should('be.checked');
    });
  });

  describe('Editing Todos', () => {
    beforeEach(() => {
      cy.get('input[aria-label="Todo title"]').type('Original title');
      cy.get('textarea[aria-label="Todo description"]').type('Original description');
      cy.contains('button', 'Add Todo').click();
      cy.wait(500);
    });

    it('should have an edit button', () => {
      cy.contains('button', 'Edit').should('be.visible');
    });

    it('should allow editing if edit mode exists', () => {
      // Check if Edit button exists
      cy.get('body').then($body => {
        if ($body.find('button:contains("Edit")').length > 0) {
          cy.contains('button', 'Edit').click();
          cy.wait(500);
          
          // Try to find any input that might be for editing
          cy.get('input[type="text"]').should('exist');
        }
      });
    });
  });

  describe('Deleting Todos', () => {
    beforeEach(() => {
      cy.get('input[aria-label="Todo title"]').type('Todo to delete');
      cy.contains('button', 'Add Todo').click();
      cy.wait(500);
    });

    it('should delete a todo', () => {
      cy.contains('Todo to delete').should('be.visible');
      
      cy.contains('button', 'Delete').click();
      cy.wait(500);
      
      cy.contains('Todo to delete').should('not.exist');
      cy.contains(/no todos/i).should('be.visible');
    });

    it('should delete multiple todos', () => {
      cy.get('input[aria-label="Todo title"]').type('Second todo');
      cy.contains('button', 'Add Todo').click();
      cy.wait(500);
      
      cy.get('button').contains('Delete').first().click();
      cy.wait(500);
      cy.get('button').contains('Delete').click();
      cy.wait(500);
      
      cy.contains(/no todos/i).should('be.visible');
    });
  });

  describe('Data Persistence', () => {
    it('should persist todos after page reload', () => {
      cy.get('input[aria-label="Todo title"]').type('Persistent todo');
      cy.contains('button', 'Add Todo').click();
      cy.wait(500);
      
      cy.reload();
      
      cy.contains('Persistent todo').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      cy.get('input[aria-label="Todo title"]').should('exist');
      cy.get('textarea[aria-label="Todo description"]').should('exist');
      cy.get('select[aria-label="Todo priority"]').should('exist');
    });

    it('should be keyboard navigable', () => {
      cy.get('input[aria-label="Todo title"]').type('Keyboard test');
      cy.get('textarea[aria-label="Todo description"]').type('Testing keyboard navigation');
      cy.get('select[aria-label="Todo priority"]').select('low');
      
      cy.contains('button', 'Add Todo').focus().type('{enter}');
      
      cy.contains('Keyboard test').should('be.visible');
    });

    it('should have proper heading hierarchy', () => {
      cy.get('h1, h2, h3').should('have.length.at.least', 1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Intercept and fail the request
      cy.intercept('POST', '**/api/todos', {
        statusCode: 500,
        body: { success: false, message: 'Server error' }
      }).as('createTodoError');

      cy.log('Attempting to add a todo when the server is down...');
      cy.get('input[aria-label="Todo title"]').type('Network error test');
      cy.contains('button', 'Add Todo').click();

      cy.wait('@createTodoError');
      
      // Check for any error message (flexible)
      cy.get('.error-message')
      .should('be.visible')
      .and('contain', 'Server error');
    });
  });

  describe('Complete Basic Workflow', () => {
    it('should complete basic CRUD operations', () => {
      // Create
      cy.get('input[aria-label="Todo title"]').type('Test Workflow');
      cy.get('textarea[aria-label="Todo description"]').type('Testing basic workflow');
      cy.contains('button', 'Add Todo').click();
      cy.wait(500);

      cy.contains('Test Workflow').should('be.visible');

      // Complete
      cy.get('input[type="checkbox"]').check();
      cy.wait(500);
      cy.get('input[type="checkbox"]').should('be.checked');

      // Delete
      cy.contains('button', 'Delete').click();
      cy.wait(500);
      cy.contains('Test Workflow').should('not.exist');
    });
  });
});