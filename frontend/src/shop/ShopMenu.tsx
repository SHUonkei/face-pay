import { Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

function ShopMenu() {
  const { shopId } = useParams<{ shopId: string }>();

  return (
    <Container sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <Toolbar />
        <Typography variant="h4" component="h2">
          FacePay for Shop
        </Typography>
        <Typography variant="h6" component="h3">
          ショップID: {shopId}
        </Typography>
        <Button variant="contained" href={'/#/shop/' + shopId + '/balance'}>
          残高確認
        </Button>
        <Button variant="contained" href={'/#/shop/' + shopId + '/payment'}>
          決済
        </Button>
      </Stack>
    </Container>
  );
}

export default ShopMenu;
