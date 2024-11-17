import { Button, Container, Stack, Toolbar, Typography } from '@mui/material';

function UserIndex() {
  return (
    <Container sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <Toolbar />
        <Typography variant="h4" component="h2">
          FacePay for User
        </Typography>
        <Button variant="contained" href="/#/user/balance">
          残高確認
        </Button>
        <Button variant="contained" href="/#/user/charge">
          チャージ
        </Button>
        <Button variant="contained" href="/#/user/register">
          登録
        </Button>
      </Stack>
    </Container>
  );
}

export default UserIndex;
