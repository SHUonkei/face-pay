import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { Button, Container, Stack, Toolbar } from '@mui/material';
import React from 'react';
import ApiError from '../api/ApiError';
import { search } from '../api/rekognition';
import Camera from '../components/Camera';
import NavBar from '../components/NavBar';

function Rekognition() {
  const [authenticating, setAuthenticating] = React.useState(false);
  const [picture, setPicture] = React.useState('');
  const [result, setResult] = React.useState('');

  React.useEffect(() => {
    if (picture) {
      search(picture.split(',')[1])
        .then((result) => {
          setResult(JSON.stringify(result, null, 2));
        })
        .catch((err) => {
          console.error(err);
          if (err instanceof ApiError)
            setResult(JSON.stringify(err.response, null, 2));
          else setResult(err.message);
        });
    }
  }, [picture]);

  return (
    <div className="App">
      <NavBar
        title="FacePay Demo - Rekognition"
        icon={<PersonSearchIcon />}
        basename="/demo/rekognition"
      />
      <Container sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <Toolbar />
          <Button
            variant="contained"
            onClick={() => {
              setAuthenticating(true);
            }}
          >
            決済へ
          </Button>
          {authenticating && (
            <Camera
              buttonValue="決済"
              onCapture={(picture: string) => {
                setPicture(picture);
              }}
            />
          )}
          {result && <pre>{result}</pre>}
        </Stack>
      </Container>
    </div>
  );
}

export default Rekognition;
