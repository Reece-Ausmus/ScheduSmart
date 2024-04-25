import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom" 
import SignIn from '../SignIn'


test('test SignIn Func if users not enter any content it will alert', async () => {
    global.alert = jest.fn();

    render(<SignIn />);
    userEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(global.alert).toBeCalledWith("Please enter both email and password.");
    });
   
})