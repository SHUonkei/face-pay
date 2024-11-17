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
import React from 'react';
import { useParams } from 'react-router-dom';
import { shopTransaction } from '../../api';

function createData(
  datetime: string,
  transactionId: number,
  userId: number,
  amount: number,
  balance: number,
) {
  return { datetime, transactionId, userId, amount, balance };
}

const rows = [
  createData('2021-10-01 12:34:56', 1, 1, 100, 100),
  createData('2021-10-02 12:34:56', 2, 2, 200, 300),
  createData('2021-10-03 12:34:56', 3, 3, 300, 600),
  createData('2021-10-04 12:34:56', 4, 4, 400, 1000),
  createData('2021-10-05 12:34:56', 5, 5, 500, 1500),
];

function ShopBalance() {
  const { shopId } = useParams<{ shopId: string }>();

  React.useEffect(() => {
    shopTransaction(Number(shopId));
  }, []);

  return (
    <Container sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <Toolbar />
        <Typography variant="h4" component="h2">
          残高確認
        </Typography>
        <div>店名: </div>
        <div>ショップID: {shopId}</div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>決済日時</TableCell>
                <TableCell>取引ID</TableCell>
                <TableCell>ユーザID</TableCell>
                <TableCell align="right">金額</TableCell>
                <TableCell align="right">残高</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.transactionId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.datetime}
                  </TableCell>
                  <TableCell>{row.transactionId}</TableCell>
                  <TableCell>{row.userId}</TableCell>
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

export default ShopBalance;
