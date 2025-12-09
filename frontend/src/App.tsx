import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OfficeProvider } from './contexts/OfficeContext';
import { router } from './routes';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <OfficeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </OfficeProvider>
    </AuthProvider>
  );
}

export default App;

