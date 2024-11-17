import PaymentIcon from '@mui/icons-material/Payment';
import { Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import NavBar from './components/NavBar';

const pages = [
  { title: 'FacePay for User', path: 'user' },
  { title: 'FacePay for Shop', path: 'shop' },
];

function App() {
  return (
    <div className="App">
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
            FacePay
          </Typography>
          <Button variant="contained" href="/#/user">
            FacePay for User
          </Button>
          <Button variant="contained" href="/#/shop">
            FacePay for Shop
          </Button>
        </Stack>
      </Container>
    </div>
  );
}

export default App;
