import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { payment } from '../../api';
import ApiError from '../../api/ApiError';
import Camera from '../../components/Camera';

function Payment() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();

  const [amount, setAmount] = React.useState(0);
  const [authenticating, setAuthenticating] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  return (
    <Container sx={{ mb: 2 }}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isProcessing}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack spacing={2}>
        <Toolbar />
        <Typography variant="h4" component="h2">
          決済
        </Typography>
        <Typography variant="h6" component="h3">
          ショップID: {shopId}
        </Typography>
        <TextField
          type="number"
          inputMode="numeric"
          id="amount"
          label="金額"
          required
          slotProps={{ htmlInput: { readOnly: authenticating } }}
          onChange={(e) => {
            setAmount(parseInt(e.target.value));
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            setAuthenticating(true);
          }}
        >
          決済へ
        </Button>
        {shopId && authenticating && (
          <Camera
            buttonValue="決済"
            onCapture={(picture: string) => {
              setIsProcessing(true);
              const image_base64 = picture.split(',')[1];
              payment(parseInt(shopId), image_base64, amount)
                .then((data) => {
                  new Audio('/sound/payment.wav').play();
                  console.log(data);
                  const { amount, store_name, updated_at } = data.payloads;
                  navigate('/shop/' + shopId + '/payment/result', {
                    state: {
                      amount: amount,
                      storeName: store_name,
                      updatedAt: new Date(updated_at + 'Z'),
                    },
                  });
                })
                .catch((error) => {
                  console.error(error);
                  if (error instanceof ApiError) {
                    navigate('/shop/' + shopId + '/payment/error', {
                      state: { msg: error.response.msg },
                    });
                  }
                });
            }}
          />
        )}
      </Stack>
    </Container>
  );
}

export default Payment;
