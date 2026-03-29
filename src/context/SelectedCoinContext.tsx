import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface ISelectedCoinContextValue {
  selectedCoinId: string | null;
  selectCoin: (id: string) => void;
  clearSelectedCoin: () => void;
}

const SelectedCoinContext = createContext<ISelectedCoinContextValue | undefined>(undefined);

interface ISelectedCoinProviderProps {
  children: React.ReactNode;
}

/**
 * Provides the selected coin ID state to the component tree.
 */
export function SelectedCoinProvider({ children }: ISelectedCoinProviderProps) {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  const selectCoin = useCallback((id: string) => {
    setSelectedCoinId(id);
  }, []);

  const clearSelectedCoin = useCallback(() => {
    setSelectedCoinId(null);
  }, []);

  const value = useMemo(
    () => ({ selectedCoinId, selectCoin, clearSelectedCoin }),
    [selectedCoinId, selectCoin, clearSelectedCoin],
  );

  return <SelectedCoinContext.Provider value={value}>{children}</SelectedCoinContext.Provider>;
}

/**
 * Returns the selected coin context value. Must be used within SelectedCoinProvider.
 */
export function useSelectedCoin(): ISelectedCoinContextValue {
  const context = useContext(SelectedCoinContext);
  if (!context) {
    throw new Error('useSelectedCoin must be used within a SelectedCoinProvider');
  }
  return context;
}
