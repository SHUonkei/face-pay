import {
  Button,
  Container,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import Camera from '../../components/Camera';

function Charge() {
  const [, setPrice] = React.useState(0);
  const [authenticating, setAuthenticating] = React.useState(false);

  return (
    <Container sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <Toolbar />
        <Typography variant="h4" component="h2">
          チャージ
        </Typography>
        <TextField
          type="number"
          inputMode="numeric"
          id="price"
          label="金額"
          required
          slotProps={{ htmlInput: { readOnly: authenticating } }}
          onChange={(e) => {
            setPrice(parseInt(e.target.value));
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            setAuthenticating(true);
          }}
        >
          チャージへ
        </Button>
        {authenticating && (
          <Camera
            onCapture={
              (/* picture: string */) => {
                // payment(picture, price);
              }
            }
          />
        )}
      </Stack>
    </Container>
  );
}

export default Charge;
