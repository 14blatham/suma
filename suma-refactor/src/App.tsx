import { AppContextProvider } from './context/AppContext';
import { AppRouter } from './router/AppRouter';

export default function App() {
  return (
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  );
}
