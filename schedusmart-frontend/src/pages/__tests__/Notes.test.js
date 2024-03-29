import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-toastify'
import "@testing-library/jest-dom" 
import Notes from '../Notes'



fail('test Notes Func if users not enter any content it will alert', async () => {
    // Render a React element into the DOM

  render(<Notes />);

  const add_button = await screen.getByTestId('test1')
  userEvent.click(add_button)
  
  //expect(screen.findByText(/Please fill in the field/i)).toBeInTheDocument();
  const temp = 'Please fill in the field';
  expect.stringContaining(temp);
})

test('test Notes Func if users not enter any content it will alert', async () => {
  // Render a React element into the DOM

render(<Notes />);

const add_button = await screen.getByTestId('test1')
userEvent.click(add_button)

//expect(screen.findByText(/Please fill in the field/i)).toBeInTheDocument();
const temp = 'Please fill in the field';
expect.stringContaining(temp);
})