import { render, screen, waitFor } from '@testing-library/react';
import FigoLoading from '.';

describe('Figoloading Component', async () => {
  it('Figoloading Component Loaded', async () => {
    render(<FigoLoading />);

    const loadingComponent = screen.getAllByTestId('figo-loading');
    waitFor(() => expect(loadingComponent).toBeInTheDocument());
  });
});
