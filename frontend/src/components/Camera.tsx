import { Button, Grid2, Stack } from '@mui/material';
import React from 'react';

function Camera({
  buttonValue = '認証',
  onCapture,
}: {
  buttonValue?: string;
  onCapture: (picture: string) => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [picture, setPicture] = React.useState('');

  const stopMediaStream = React.useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
  }, []);

  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true,
      })
      .then((stream) => {
        videoRef.current!.srcObject = stream;
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });
    return stopMediaStream;
  }, [stopMediaStream]);

  const takepicture = React.useCallback(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context && videoRef.current) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      canvas.width = width;
      canvas.height = height;
      context.drawImage(videoRef.current, 0, 0, width, height);

      const data = canvas.toDataURL('image/png');
      setPicture(data);
      onCapture(data);
    }
  }, [onCapture]);

  return (
    <Stack spacing={2}>
      <Grid2 container alignItems="center" justifyContent="center">
        <video
          ref={videoRef}
          style={{
            display: picture ? 'none' : 'inherit',
            maxWidth: '100%',
            height: 'auto',
          }}
          autoPlay
          playsInline
        >
          A camera is not available.
        </video>
        <img
          src={picture}
          alt="Captured"
          style={{
            display: picture ? 'inherit' : 'none',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </Grid2>

      <Button
        variant="contained"
        onClick={() => {
          takepicture();
          stopMediaStream();
        }}
      >
        {buttonValue}
      </Button>
    </Stack>
  );
}

export default Camera;
