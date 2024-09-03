import React, { useState, useEffect } from 'react';

const AccelerometerComponent = () => {
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const handleMotion = (event) => {
    if (event.accelerationIncludingGravity) {
      const { accelerationIncludingGravity } = event;
      setAcceleration({
        x: accelerationIncludingGravity.x || 0,
        y: accelerationIncludingGravity.y || 0,
        z: accelerationIncludingGravity.z || 0,
      });
    } else {
      console.warn('Acceleration data is not available');
    }
  };

  const handleError = (event) => {
    setError('Error accessing device motion data');
    console.error('Error accessing device motion data:', event);
  };

  const startListening = () => {
    if (window.DeviceMotionEvent) {
      if (permissionGranted) {
        window.addEventListener('devicemotion', handleMotion, true);
        window.addEventListener('devicemotion', handleError, true);
        setListening(true);
      } else {
        setError('Permission to access device motion data is denied.');
      }
    } else {
      console.log('DeviceMotionEvent is not supported on this device.');
      setError('DeviceMotionEvent is not supported on this device.');
    }
  };

  const stopListening = () => {
    if (window.DeviceMotionEvent) {
      window.removeEventListener('devicemotion', handleMotion, true);
      window.removeEventListener('devicemotion', handleError, true);
      setListening(false);
    }
  };

  const requestPermission = async () => {
    if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
        } else {
          setPermissionGranted(false);
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
        setPermissionGranted(false);
      }
    } else {
      // For devices that don't need explicit permission
      setPermissionGranted(true);
    }
  };

  const handleRequestPermission = () => {
    requestPermission();
  };

  return (
      <div>
        <h1>Accelerometer Data</h1>
        {error && <p>Error: {error}</p>}
        <p>Acceleration along X-axis: {acceleration.x.toFixed(2)}</p>
        <p>Acceleration along Y-axis: {acceleration.y.toFixed(2)}</p>
        <p>Acceleration along Z-axis: {acceleration.z.toFixed(2)}</p>
        {!listening ? (
            <>
              <button onClick={handleRequestPermission}>Request Permission</button>
              <button onClick={startListening}>Start Listening</button>
            </>
        ) : (
            <button onClick={stopListening}>Stop Listening</button>
        )}
      </div>
  );
};

export default AccelerometerComponent;
