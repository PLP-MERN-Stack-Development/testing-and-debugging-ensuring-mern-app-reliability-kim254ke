describe('Todo Application E2E Tests', () => {
    const API_URL = 'http://localhost:5000/api';
  
    beforeEach(() => {
      // Clear database before each test
      cy.request('DELETE', `${API_URL}/todos/all`).catch(() => {
        // Ignore errors if endpoint doesn't exist
      });
      
      cy.visit('http://localhost:3000');
    });
  
    describe('Initial Page Load', () => {
      it('should display the app title', () => {
        cy.contains('MERN Todo App').should('be.visible');
      });
  
      it('should show empty state when no todos exist', () => {
        cy.contains('No todos yet. Add one above!').should('be.visible');
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
        cy.contains('Your Todos (1)').should('be.visible');
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
        cy.contains('high').should('be.visible');
      });
  
      it('should show error when title is empty', () => {
        cy.contains('button', 'Add Todo').click();
        cy.contains('Title is required').should('be.visible');
      });
  
      it('should show error when title is too short', () => {
        cy.get('input[aria-label="Todo title"]').type('ab');
        cy.contains('button', 'Add Todo').click();
        cy.contains('Title must be at least 3 characters').should('be.visible');
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
  
        cy.contains('Your Todos (3)').should('be.visible');
      });
    });
  
    describe('Viewing Todos', () => {
      beforeEach(() => {
        // Add some test todos
        cy.get('input[aria-label="Todo title"]').type('Active todo');
        cy.contains('button', 'Add Todo').click();
        
        cy.get('input[aria-label="Todo title"]').type('Completed todo');
        cy.contains('button', 'Add Todo').click();
        
        // Complete the second todo
        cy.get('input[type="checkbox"]').last().check();
      });
  
      it('should display all todos by default', () => {
        cy.contains('Active todo').should('be.visible');
        cy.contains('Completed todo').should('be.visible');
      });
  
      it('should filter active todos', () => {
        cy.contains('button', 'Active').click();
        
        cy.contains('Active todo').should('be.visible');
        cy.contains('Completed todo').should('not.exist');
      });
  
      it('should filter completed todos', () => {
        cy.contains('button', 'Completed').click();
        
        cy.contains('Completed todo').should('be.visible');
        cy.contains('Active todo').should('not.exist');
      });
  
      it('should switch back to all todos', () => {
        cy.contains('button', 'Completed').click();
        cy.contains('button', 'All').click();
        
        cy.contains('Active todo').should('be.visible');
        cy.contains('Completed todo').should('be.visible');
      });
    });
  
    describe('Completing Todos', () => {
      beforeEach(() => {
        cy.get('input[aria-label="Todo title"]').type('Todo to complete');
        cy.contains('button', 'Add Todo').click();
      });
  
      it('should toggle todo completion', () => {
        cy.get('input[type="checkbox"]').check();
        cy.get('.todo-item').should('have.class', 'completed');
      });
  
      it('should uncheck completed todo', () => {
        cy.get('input[type="checkbox"]').check();
        cy.get('input[type="checkbox"]').uncheck();
        cy.get('.todo-item').should('not.have.class', 'completed');
      });
    });
  
    describe('Editing Todos', () => {
      beforeEach(() => {
        cy.get('input[aria-label="Todo title"]').type('Original title');
        cy.get('textarea[aria-label="Todo description"]').type('Original description');
        cy.contains('button', 'Add Todo').click();
      });
  
      it('should enter edit mode', () => {
        cy.contains('button', 'Edit').click();
        cy.get('input[aria-label="Edit todo title"]').should('be.visible');
        cy.contains('button', 'Save').should('be.visible');
        cy.contains('button', 'Cancel').should('be.visible');
      });
  
      it('should edit todo title', () => {
        cy.contains('button', 'Edit').click();
        
        cy.get('input[aria-label="Edit todo title"]')
          .clear()
          .type('Updated title');
        
        cy.contains('button', 'Save').click();
        
        cy.contains('Updated title').should('be.visible');
        cy.contains('Original title').should('not.exist');
      });
  
      it('should edit todo description', () => {
        cy.contains('button', 'Edit').click();
        
        cy.get('textarea[aria-label="Edit todo description"]')
          .clear()
          .type('Updated description');
        
        cy.contains('button', 'Save').click();
        
        cy.contains('Updated description').should('be.visible');
      });
  
      it('should change todo priority', () => {
        cy.contains('button', 'Edit').click();
        
        cy.get('select[aria-label="Edit todo priority"]').select('high');
        
        cy.contains('button', 'Save').click();
        
        cy.contains('high').should('be.visible');
      });
  
      it('should cancel editing', () => {
        cy.contains('button', 'Edit').click();
        
        cy.get('input[aria-label="Edit todo title"]')
          .clear()
          .type('This should not be saved');
        
        cy.contains('button', 'Cancel').click();
        
        cy.contains('Original title').should('be.visible');
        cy.contains('This should not be saved').should('not.exist');
      });
    });
  
    describe('Deleting Todos', () => {
      beforeEach(() => {
        cy.get('input[aria-label="Todo title"]').type('Todo to delete');
        cy.contains('button', 'Add Todo').click();
      });
  
      it('should delete a todo', () => {
        cy.contains('Todo to delete').should('be.visible');
        
        cy.contains('button', 'Delete').click();
        
        cy.contains('Todo to delete').should('not.exist');
        cy.contains('No todos yet').should('be.visible');
      });
  
      it('should delete multiple todos', () => {
        cy.get('input[aria-label="Todo title"]').type('Second todo');
        cy.contains('button', 'Add Todo').click();
        
        cy.get('button').contains('Delete').first().click();
        cy.get('button').contains('Delete').click();
        
        cy.contains('No todos yet').should('be.visible');
      });
    });
  
    describe('Complete User Workflow', () => {
      it('should complete full CRUD workflow', () => {
        // Create
        cy.get('input[aria-label="Todo title"]').type('Learn Cypress');
        cy.get('textarea[aria-label="Todo description"]').type('Complete E2E testing course');
        cy.get('select[aria-label="Todo priority"]').select('high');
        cy.contains('button', 'Add Todo').click();
  
        cy.contains('Learn Cypress').should('be.visible');
        cy.contains('Complete E2E testing course').should('be.visible');
        cy.contains('high').should('be.visible');
  
        // Read/Filter
        cy.contains('button', 'Active').click();
        cy.contains('Learn Cypress').should('be.visible');
  
        // Update
        cy.contains('button', 'Edit').click();
        cy.get('input[aria-label="Edit todo title"]')
          .clear()
          .type('Master Cypress');
        cy.contains('button', 'Save').click();
        cy.contains('Master Cypress').should('be.visible');
  
        // Complete
        cy.get('input[type="checkbox"]').check();
        cy.contains('button', 'Completed').click();
        cy.contains('Master Cypress').should('be.visible');
  
        // Delete
        cy.contains('button', 'All').click();
        cy.contains('button', 'Delete').click();
        cy.contains('No todos yet').should('be.visible');
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
    });
  
    describe('Error Handling', () => {
      it('should handle network errors gracefully', () => {
        // Intercept and fail the request
        cy.intercept('POST', '**/api/todos', {
          statusCode: 500,
          body: { success: false, message: 'Server error' }
        }).as('createTodoError');
  
        cy.get('input[aria-label="Todo title"]').type('Network error test');
        cy.contains('button', 'Add Todo').click();
  
        cy.wait('@createTodoError');
        cy.contains('Failed to add todo').should('be.visible');
      });
    });
  });