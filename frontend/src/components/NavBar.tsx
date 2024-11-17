import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';

function NavBar({
  title,
  icon,
  basename,
  pages,
}: {
  title: string;
  icon: React.ReactNode;
  basename: string;
  pages?: { title: string; path: string }[];
}) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar component="nav">
      <Toolbar>
        {icon}
        <Typography
          variant="h6"
          component="h1"
          sx={{
            mr: 2,
            flexGrow: { xs: 1, md: 0 },
          }}
        >
          <a
            href={'/#' + basename}
            style={{
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {title}
          </a>
        </Typography>

        {pages && (
          <>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <Button
                href="/"
                onClick={handleCloseNavMenu}
                sx={{ color: 'white', display: 'block' }}
              >
                FacePayトップへ
              </Button>
              {pages.map((page) => (
                <Button
                  key={page.title}
                  href={'/#' + basename + '/' + page.path}
                  onClick={handleCloseNavMenu}
                  sx={{ color: 'white', display: 'block' }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                <MenuItem component="a" href="/" onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>
                    FacePayトップへ
                  </Typography>
                </MenuItem>
                {pages.map((page) => (
                  <MenuItem
                    component="a"
                    key={page.path}
                    href={'/#' + basename + '/' + page.path}
                    onClick={handleCloseNavMenu}
                  >
                    <Typography sx={{ textAlign: 'center' }}>
                      {page.title}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
