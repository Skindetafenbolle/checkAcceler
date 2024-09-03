import React, { useEffect, useState } from 'react';

const AccelerometerComponent = () => {
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // Проверка на поддержку DeviceMotionEvent
    if (window.DeviceMotionEvent) {
      const handleMotion = (event) => {
        const { accelerationIncludingGravity } = event;
        setAcceleration({
          x: accelerationIncludingGravity.x || 0,
          y: accelerationIncludingGravity.y || 0,
          z: accelerationIncludingGravity.z || 0,
        });
      };

      // Добавляем обработчик события
      window.addEventListener('devicemotion', handleMotion, true);

      // Удаляем обработчик при размонтировании компонента
      return () => {
        window.removeEventListener('devicemotion', handleMotion, true);
      };
    } else {
      console.log('DeviceMotionEvent is not supported on this device.');
    }
  }, []);

  return (
      <div>
        <h1>Accelerometer Data</h1>
        <p>Acceleration along X-axis: {acceleration.x.toFixed(2)}</p>
        <p>Acceleration along Y-axis: {acceleration.y.toFixed(2)}</p>
        <p>Acceleration along Z-axis: {acceleration.z.toFixed(2)}</p>
      </div>
  );
};

export default AccelerometerComponent;