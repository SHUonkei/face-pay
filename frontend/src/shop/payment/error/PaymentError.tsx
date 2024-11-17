import { Container, Stack, Toolbar, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

function PaymentError() {
  const location = useLocation();
  const state: {
    msg: string;
  } | null = location.state;

  if (state === null) {
    return (
      <Container sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <Toolbar />
          <Typography variant="h4" component="h2">
            エラー
          </Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <Toolbar />
        <Typography variant="h4" component="h2">
          決済エラー
        </Typography>
        <Typography>{state.msg}</Typography>
      </Stack>
    </Container>
  );
}

export default PaymentError;
