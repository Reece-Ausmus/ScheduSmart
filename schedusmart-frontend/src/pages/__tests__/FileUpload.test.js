import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-toastify'
import "@testing-library/jest-dom" 
import FileUpload from "../FileUpload"

afterEach(() => {
    cleanup()
})

test('Test File Upload', async () => {
    // Render a React element into the DOM
    const alertMock = jest.spyOn(window, 'alert')
    const file = new File(['test_image'], 'test_image.png', {type: 'image/png'})
    render(<FileUpload/>)
    const addFile = await screen.getByTestId('test1')
    userEvent.upload(addFile, file)
    const upload_button = await screen.getByTestId('test2')
    userEvent.click(upload_button)
})

test('Test File Rejection', async () => {
    // Render a React element into the DOM
    const alertMock = jest.spyOn(window, 'alert')
    const file = new File(['test_malware'], 'Notes.test.js')
    render(<FileUpload/>)
    const addFile = await screen.getByTestId('test1')
    userEvent.upload(addFile, file)
    const upload_button = await screen.getByTestId('test2')
    userEvent.click(upload_button)
})