import StoreIcon from '@mui/icons-material/Store';
import {
  Button,
  Container,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import NavBar from '../components/NavBar';

function ShopLogin() {
  const [shopId, setShopId] = React.useState('');

  return (
    <div className="App">
      <NavBar title="FacePay for Shop" icon={<StoreIcon />} basename="/shop" />
      <Container sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <Toolbar />
          <Typography variant="h4" component="h2">
            FacePay for Shop
          </Typography>
          <TextField
            type="number"
            inputMode="numeric"
            id="shopId"
            label="ショップID"
            required
            onChange={(e) => {
              setShopId(e.target.value);
            }}
          />
          <Button
            variant="contained"
            href={'/#/shop/' + shopId}
            disabled={shopId === ''}
          >
            ログイン
          </Button>
        </Stack>
      </Container>
    </div>
  );
}

export default ShopLogin;
