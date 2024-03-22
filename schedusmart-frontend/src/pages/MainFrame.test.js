// This is to test the interactive web tours.
// to test, type "npm run test" in terminal

// import react-testing methods
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import MainFrame from './MainFrame'

/*test('test interactive web tours', async () => {
  // Render a React element into the DOM
  render(<MainFrame />)

  const linkElement = screen.getByText(/Next/i);
  expect(linkElement).toBeInTheDocument();

  // testing if next button works
  await userEvent.click(screen.getByText(/Next/i));
  await screen.getByText(/2/i);

  expect(screen.getByText(/Last/i)).toBeInTheDocument();
})*/

test('test skip func', async () => {
  // Render a React element into the DOM
  render(<MainFrame/>)

  const linkElement = screen.getByText(/Skip/i);
  expect(linkElement).toBeInTheDocument();

  await userEvent.click(screen.getByText(/Skip/i));

  const temp = 'Skip';
  expect.not.stringContaining(temp);
})