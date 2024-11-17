import {
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';

function createData(
  datetime: string,
  shopName: string,
  amount: number,
  balance: number,
) {
  return { datetime, shopName, amount, balance };
}

const rows = [
  createData('2021-10-01 12:34:56', 'チャージ', 10000, 10000),
  createData('2021-10-02 12:34:56', 'Shop2', -200, 9800),
  createData('2021-10-03 12:34:56', 'Shop3', -300, 9500),
  createData('2021-10-04 12:34:56', 'Shop4', -400, 9100),
  createData('2021-10-05 12:34:56', 'Shop5', -500, 8600),
];

function BalanceView() {
  const { userId } = useParams<{ userId: string }>();

  return (
    <Container sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <Toolbar />
        <Typography variant="h4" component="h2">
          残高確認
        </Typography>
        <div>ユーザ名: </div>
        <div>ユーザID: {userId}</div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ご利用日時</TableCell>
                <TableCell>ご利用先など</TableCell>
                <TableCell align="right">ご利用金額</TableCell>
                <TableCell align="right">残高</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.datetime}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.datetime}
                  </TableCell>
                  <TableCell>{row.shopName}</TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  <TableCell align="right">{row.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}

export default BalanceView;
