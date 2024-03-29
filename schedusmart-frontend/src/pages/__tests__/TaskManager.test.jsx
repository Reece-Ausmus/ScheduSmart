import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import TaskManager from '../TaskManager'

/**
 * @jest-environment jsdom
 */

test(('testing the tester'), () => {
    expect(true).toBe(true)
})

test(('Test 3 - Verify Progress Meter'), () => {
    render(<Welcome/>)
})