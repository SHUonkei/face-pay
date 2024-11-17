import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ErrorPage from './ErrorPage';
import Rekognition from './demo/Rekognition';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Shop from './shop/Shop';
import ShopLogin from './shop/ShopLogin';
import ShopMenu from './shop/ShopMenu';
import ShopBalance from './shop/balance/ShopBalance';
import Payment from './shop/payment/Payment';
import PaymentError from './shop/payment/error/PaymentError';
import PaymentResult from './shop/payment/result/PaymentResult';
import ShopTransaction from './shop/transaction/ShopTransaction';
import theme from './theme';
import User from './user/User';
import UserIndex from './user/UserIndex';
import BalanceView from './user/balance/BalanceView';
import UserBalance from './user/balance/UserBalance';
import Charge from './user/charge/Charge';
import Register from './user/register/Register';
import RegisterResult from './user/register/result/RegisterResult';
import UserTransaction from './user/transaction/UserTransaction';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/user',
    element: <User />,
    children: [
      {
        index: true,
        element: <UserIndex />,
      },
      {
        path: 'balance',
        element: <UserBalance />,
      },
      {
        path: 'balance/:userId',
        element: <BalanceView />,
      },
      {
        path: 'transaction/:transactionId',
        element: <UserTransaction />,
      },
      {
        path: 'charge',
        element: <Charge />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'register/result',
        element: <RegisterResult />,
      },
    ],
  },
  {
    path: '/shop',
    element: <ShopLogin />,
  },
  {
    path: '/shop/:shopId',
    element: <Shop />,
    children: [
      {
        index: true,
        element: <ShopMenu />,
      },
      {
        path: 'balance',
        element: <ShopBalance />,
      },
      {
        path: 'transaction/:transactionId',
        element: <ShopTransaction />,
      },
      {
        path: 'payment',
        element: <Payment />,
      },
      {
        path: 'payment/result',
        element: <PaymentResult />,
      },
      {
        path: 'payment/error',
        element: <PaymentError />,
      },
    ],
  },
  {
    path: '/demo/rekognition',
    element: <Rekognition />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
