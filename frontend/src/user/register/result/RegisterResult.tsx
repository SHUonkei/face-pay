import { Container, Stack, Toolbar, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

function RegisterResult() {
  const location = useLocation();
  const state: {
    isSuccessful: boolean;
    msg: string;
  } | null = location.state;

  if (state === null) {
    return (
      <Container sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <Toolbar />
          <Typography variant="h4" component="h2">
            エラー
          </Typography>
          <Typography>登録に失敗しました。</Typography>
        </Stack>
      </Container>
    );
  }

  if (!state.isSuccessful) {
    return (
      <Container sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <Toolbar />
          <Typography variant="h4" component="h2">
            エラー
          </Typography>
          <Typography>{state.msg}</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <Toolbar />
        <Typography variant="h4" component="h2">
          登録完了
        </Typography>
      </Stack>
    </Container>
  );
}

export default RegisterResult;
