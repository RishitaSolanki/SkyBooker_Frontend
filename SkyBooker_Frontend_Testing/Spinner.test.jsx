import React from 'react';
import { render } from '@testing-library/react';
import Spinner from '../SkyBooker/SkyBooker.Frontend/src/components/Spinner.jsx';

describe('Spinner Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Spinner />);
    // Check that it rendered the style tag and the spinner element
    const spinnerDiv = container.querySelector('div');
    expect(spinnerDiv).toBeInTheDocument();
  });
});
