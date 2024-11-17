import StoreIcon from '@mui/icons-material/Store';
import { Outlet, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';

const pages = [
  { title: '残高確認', path: 'balance' },
  { title: '決済', path: 'payment' },
];

function Shop() {
  const { shopId } = useParams<{ shopId: string }>();

  return (
    <div className="App">
      <NavBar
        title="FacePay for Shop"
        icon={<StoreIcon />}
        basename={'/shop/' + shopId}
        pages={pages}
      />
      <Outlet />
    </div>
  );
}

export default Shop;
