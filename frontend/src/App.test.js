import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AWS CloudWatch Log Management heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/AWS CloudWatch Log Management/i);
  expect(linkElement).toBeInTheDocument();
});