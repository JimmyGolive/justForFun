import { render, screen } from '@testing-library/react';
import App from './App';

test('renders onboarding screen on first launch', () => {
  // Clear any persisted state so we always start fresh
  localStorage.clear();
  render(<App />);
  expect(screen.getByText(/CoupleSpark/i)).toBeInTheDocument();
});
