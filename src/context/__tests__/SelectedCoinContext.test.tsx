import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SelectedCoinProvider, useSelectedCoin } from '../SelectedCoinContext';

function TestConsumer() {
  const { selectedCoinId, selectCoin, clearSelectedCoin } = useSelectedCoin();
  return (
    <div>
      <span data-testid="coin-id">{selectedCoinId ?? 'none'}</span>
      <button type="button" onClick={() => selectCoin('bitcoin')}>
        Select
      </button>
      <button type="button" onClick={clearSelectedCoin}>
        Clear
      </button>
    </div>
  );
}

describe('SelectedCoinContext', () => {
  it('starts with no selected coin', () => {
    render(
      <SelectedCoinProvider>
        <TestConsumer />
      </SelectedCoinProvider>,
    );
    expect(screen.getByTestId('coin-id')).toHaveTextContent('none');
  });

  it('updates the selected coin when selectCoin is called', async () => {
    const user = userEvent.setup();
    const { getByRole, getByTestId } = render(
      <SelectedCoinProvider>
        <TestConsumer />
      </SelectedCoinProvider>,
    );
    await user.click(getByRole('button', { name: 'Select' }));
    expect(getByTestId('coin-id')).toHaveTextContent('bitcoin');
  });

  it('clears the selected coin when clearSelectedCoin is called', async () => {
    const user = userEvent.setup();
    const { getByRole, getByTestId } = render(
      <SelectedCoinProvider>
        <TestConsumer />
      </SelectedCoinProvider>,
    );
    await user.click(getByRole('button', { name: 'Select' }));
    await user.click(getByRole('button', { name: 'Clear' }));
    expect(getByTestId('coin-id')).toHaveTextContent('none');
  });

  it('throws when used outside SelectedCoinProvider', () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => render(<TestConsumer />)).toThrow(
      'useSelectedCoin must be used within a SelectedCoinProvider',
    );
    console.error = originalError;
  });
});
