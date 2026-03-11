import { AppContextProvider } from './context/AppContext';
import { DataContextProvider } from './context/DataContext';
import { AppRouter } from './router/AppRouter';

export default function App() {
  return (
    <AppContextProvider>
      <DataContextProvider>
        <AppRouter />
      </DataContextProvider>
    </AppContextProvider>
  );
}
