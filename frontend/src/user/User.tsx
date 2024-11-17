import PersonIcon from '@mui/icons-material/Person';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

const pages = [
  { title: '残高確認', path: 'balance' },
  { title: 'チャージ', path: 'charge' },
  { title: '登録', path: 'register' },
];

function User() {
  return (
    <div className="App">
      <NavBar
        title="FacePay for User"
        icon={<PersonIcon />}
        basename="/user"
        pages={pages}
      />
      <Outlet />
    </div>
  );
}

export default User;
