import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerFace } from '../../api';
import ApiError from '../../api/ApiError';
import Camera from '../../components/Camera';

function Register() {
  const navigate = useNavigate();

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
          登録
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setAuthenticating(true);
          }}
        >
          登録へ
        </Button>
        {authenticating && (
          <Camera
            buttonValue="登録"
            onCapture={(picture: string) => {
              setIsProcessing(true);
              const image_base64 = picture.split(',')[1];
              registerFace(image_base64)
                .then((data) => {
                  console.log(data);
                  navigate('/user/register/result', {
                    state: {
                      isSuccessful: true,
                      msg: '',
                    },
                  });
                })
                .catch((error) => {
                  console.error(error);
                  if (error instanceof ApiError) {
                    navigate('/shop/payment/result', {
                      state: {
                        isSuccessful: false,
                        msg: error.response.msg,
                      },
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

export default Register;
