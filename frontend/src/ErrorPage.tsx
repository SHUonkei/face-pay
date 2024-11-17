import PaymentIcon from '@mui/icons-material/Payment';
import { Container, Stack, Toolbar, Typography } from '@mui/material';
import { useRouteError, type ErrorResponse } from 'react-router-dom';
import NavBar from './components/NavBar';

const pages = [
  { title: 'FacePay for User', path: 'user' },
  { title: 'FacePay for Shop', path: 'shop' },
];

function ErrorPage() {
  const error = useRouteError() as ErrorResponse & Error;
  console.error(error);

  return (
    <div id="error-page">
      <NavBar
        title="FacePay"
        icon={<PaymentIcon />}
        basename=""
        pages={pages}
      />
      <Container sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <Toolbar />
          <Typography variant="h4" component="h2">
            Oops!
          </Typography>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{error.statusText || error.message}</i>
          </p>
        </Stack>
      </Container>
    </div>
  );
}

export default ErrorPage;
