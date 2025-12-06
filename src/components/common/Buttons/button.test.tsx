import { Button } from '@components';
import { render, screen, waitFor } from '@testing-library/react';

describe('Button Component', async () => {
  it('Button Componentn Loading', async () => {
    render(
      <Button id="testButton" onClick={() => console.log('furkan')}>
        Test Button
      </Button>,
    );

    const buttonComponent = screen.getAllByTestId('figo-button');

    waitFor(() => {
      expect(buttonComponent).toBeInTheDocument();
    });
  });
});
