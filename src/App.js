import React, { useState, useEffect } from 'react';

const AccelerometerComponent = () => {
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

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
      window.addEventListener('devicemotion', handleMotion, true);
      window.addEventListener('devicemotion', handleError, true);
      setListening(true);
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

  // This useEffect can help with initial device orientation permission handling
  useEffect(() => {
    if (window.DeviceOrientationEvent) {
      console.log('DeviceOrientationEvent is supported');
    } else {
      console.log('DeviceOrientationEvent is not supported');
    }
  }, []);

  return (
      <div>
        <h1>Accelerometer Data</h1>
        {error && <p>Error: {error}</p>}
        <p>Acceleration along X-axis: {acceleration.x.toFixed(2)}</p>
        <p>Acceleration along Y-axis: {acceleration.y.toFixed(2)}</p>
        <p>Acceleration along Z-axis: {acceleration.z.toFixed(2)}</p>
        {!listening ? (
            <button onClick={startListening}>Start Listening</button>
        ) : (
            <button onClick={stopListening}>Stop Listening</button>
        )}
      </div>
  );
};

export default AccelerometerComponent;
