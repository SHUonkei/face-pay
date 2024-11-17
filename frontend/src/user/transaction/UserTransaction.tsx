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
import { useParams } from 'react-router-dom';

function UserTransaction() {
  const { transactionId } = useParams<{ transactionId: string }>();

  return (
    <Container sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <Toolbar />
        <Typography variant="h4" component="h2">
          取引詳細
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 320 }} aria-label="transaction table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="column">
                  ご利用日時
                </TableCell>
                <TableCell>2021-10-01 12:34:56</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="column">
                  ご利用先など
                </TableCell>
                <TableCell>チャージ</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="column">
                  ご利用金額
                </TableCell>
                <TableCell align="right">10000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="column">
                  残高
                </TableCell>
                <TableCell align="right">10000</TableCell>
              </TableRow>
              <TableRow sx={{ border: 0 }}>
                <TableCell component="th" scope="column">
                  取引ID
                </TableCell>
                <TableCell>{transactionId}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}

export default UserTransaction;
