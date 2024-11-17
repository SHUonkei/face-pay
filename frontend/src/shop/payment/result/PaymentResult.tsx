import {
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

function PaymentResult() {
  const location = useLocation();
  const state: {
    amount: number;
    storeName: string;
    updatedAt: Date;
  } | null = location.state;

  if (state === null) {
    return (
      <Container sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <Toolbar />
          <Typography variant="h4" component="h2">
            エラー
          </Typography>
          <Typography>決済に失敗しました。</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <Toolbar />
        <Typography variant="h4" component="h2">
          決済完了
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 320 }} aria-label="transaction table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="column">
                  決済日時
                </TableCell>
                <TableCell>{state.updatedAt.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="column">
                  店名
                </TableCell>
                <TableCell>{state.storeName}</TableCell>
              </TableRow>
              <TableRow sx={{ border: 0 }}>
                <TableCell component="th" scope="column">
                  金額
                </TableCell>
                <TableCell align="right">{state.amount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}

export default PaymentResult;
