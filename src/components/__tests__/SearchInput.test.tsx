import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchInput } from '../SearchInput';

describe('SearchInput', () => {
  it('renders with a placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Find a coin" />);
    expect(screen.getByPlaceholderText('Find a coin')).toBeInTheDocument();
  });

  it('displays the given value', () => {
    render(<SearchInput value="bitcoin" onChange={() => {}} />);
    expect(screen.getByRole('searchbox')).toHaveValue('bitcoin');
  });

  it('calls onChange with the new value when the user types', async () => {
    const handleChange = jest.fn();
    render(<SearchInput value="" onChange={handleChange} />);
    await userEvent.type(screen.getByRole('searchbox'), 'eth');
    expect(handleChange).toHaveBeenCalledWith('e');
    expect(handleChange).toHaveBeenCalledWith('t');
    expect(handleChange).toHaveBeenCalledWith('h');
  });
});
