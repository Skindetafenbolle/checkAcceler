import React, { useState, useEffect, useRef } from 'react';

const AccelerometerComponent = () => {
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const motionData = useRef([]);

  const handleMotion = (event) => {
    if (event.accelerationIncludingGravity) {
      motionData.current.push(event.accelerationIncludingGravity);

      // Keep only the last 10 values
      if (motionData.current.length > 10) {
        motionData.current.shift();
      }

      const avgAcceleration = motionData.current.reduce((avg, data) => ({
        x: avg.x + data.x,
        y: avg.y + data.y,
        z: avg.z + data.z,
      }), { x: 0, y: 0, z: 0 });

      const count = motionData.current.length;

      setAcceleration({
        x: avgAcceleration.x / count,
        y: avgAcceleration.y / count,
        z: avgAcceleration.z / count,
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

  useEffect(() => {
    requestPermission();
  }, []);


  return (
      <div>
        <h1>Accelerometer Data</h1>
        {error && <p>Error: {error}</p>}
        <p>Acceleration along X-axis: {acceleration.x.toFixed(2)}</p>
        <p>Acceleration along Y-axis: {acceleration.y.toFixed(2)}</p>
        <p>Acceleration along Z-axis: {acceleration.z.toFixed(2)}</p>
        {!listening ? (
            <>
              <button onClick={startListening}>Start Listening</button>
            </>
        ) : (
            <button onClick={stopListening}>Stop Listening</button>
        )}
      </div>
  );
};

export default AccelerometerComponent;
