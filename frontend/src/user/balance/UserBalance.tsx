import { Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import React from 'react';
import Camera from '../../components/Camera';

function UserBalance() {
  const [authenticating, setAuthenticating] = React.useState(false);

  return (
    <Container sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <Toolbar />
        <Typography variant="h4" component="h2">
          残高確認
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setAuthenticating(true);
          }}
        >
          ログイン
        </Button>
        {authenticating && (
          <Camera
            buttonValue="認証"
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

export default UserBalance;
