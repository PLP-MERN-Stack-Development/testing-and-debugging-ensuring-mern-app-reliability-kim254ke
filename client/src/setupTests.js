// src/setupTests.js
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Mock window.matchMedia for components that might use it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Configure React Testing Library
configure({ asyncUtilTimeout: 5000 });

// This is the key to fixing 'act' warnings globally.
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers(); // Flush any pending promises
  jest.useRealTimers();
});