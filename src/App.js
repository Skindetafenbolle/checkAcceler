import React, { useEffect, useState } from 'react';

const AccelerometerComponent = () => {
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.DeviceMotionEvent) {
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

      window.addEventListener('devicemotion', handleMotion, true);
      window.addEventListener('devicemotion', handleError, true);

      return () => {
        window.removeEventListener('devicemotion', handleMotion, true);
        window.removeEventListener('devicemotion', handleError, true);
      };
    } else {
      console.log('DeviceMotionEvent is not supported on this device.');
      setError('DeviceMotionEvent is not supported on this device.');
    }
  }, []);

  return (
      <div>
        <h1>Accelerometer Data</h1>
        {error && <p>Error: {error}</p>}
        <p>Acceleration along X-axis: {acceleration.x.toFixed(2)}</p>
        <p>Acceleration along Y-axis: {acceleration.y.toFixed(2)}</p>
        <p>Acceleration along Z-axis: {acceleration.z.toFixed(2)}</p>
      </div>
  );
};

export default AccelerometerComponent;
