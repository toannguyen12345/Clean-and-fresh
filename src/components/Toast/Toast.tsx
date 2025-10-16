import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        className: '',
        style: {},
        success: {
          className: 'bg-white text-gray-800 shadow-lg border border-green-200',
          iconTheme: {
            primary: '#28a745',
            secondary: '#fff',
          },
        },
        error: {
          className: 'bg-white text-gray-800 shadow-lg border border-red-200',
          iconTheme: {
            primary: '#dc3545',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default Toast;
