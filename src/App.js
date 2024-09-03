import React, { useState, useEffect, useRef } from 'react';

const DeviceInfoComponent = () => {
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [geoInfo, setGeoInfo] = useState({});
  const [networkInfo, setNetworkInfo] = useState({});
  const [storageInfo, setStorageInfo] = useState({});

  const motionData = useRef([]);

  const handleMotion = (event) => {
    if (event.accelerationIncludingGravity) {
      motionData.current.push(event.accelerationIncludingGravity);

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
        if (!listening) {
          window.addEventListener('devicemotion', handleMotion, true);
          window.addEventListener('devicemotion', handleError, true);
          setListening(true);
        }
      } else {
        setError('Permission to access device motion data is denied.');
      }
    } else {
      console.log('DeviceMotionEvent is not supported on this device.');
      setError('DeviceMotionEvent is not supported on this device.');
    }
  };

  const stopListening = () => {
    if (window.DeviceMotionEvent && listening) {
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
      setPermissionGranted(true);
    }
  };

  useEffect(() => {
    requestPermission();
    fetchDeviceInfo();
    fetchGeoInfo();
    fetchNetworkInfo();
    fetchStorageInfo();
  }, []);

  const fetchDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const cpuCores = navigator.hardwareConcurrency;
    const memory = navigator.deviceMemory;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const screenColorDepth = window.screen.colorDepth;
    const appName = navigator.appName;
    const appVersion = navigator.appVersion;
    const browserLanguage = navigator.language;
    const vendor = navigator.vendor;
    const product = navigator.product;
    const userAgentData = navigator.userAgentData ? navigator.userAgentData : null;

    setDeviceInfo({
      userAgent,
      platform,
      cpuCores,
      memory,
      screenWidth,
      screenHeight,
      screenColorDepth,
      appName,
      appVersion,
      browserLanguage,
      vendor,
      product,
      userAgentData,
    });
  };

  const fetchGeoInfo = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setGeoInfo({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }, (error) => {
        console.error('Error getting location:', error);
      });
    } else {
      setGeoInfo({ error: 'Geolocation is not supported by this browser.' });
    }
  };

  const fetchNetworkInfo = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      setNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      });
    } else {
      setNetworkInfo({ error: 'Network Information API is not supported.' });
    }
  };

  const fetchStorageInfo = () => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        setStorageInfo({
          quota: estimate.quota,
          usage: estimate.usage,
        });
      });
    } else {
      setStorageInfo({ error: 'Storage API is not supported.' });
    }
  };

  return (
      <div>
        <h1>Accelerometer Data</h1>
        {error && <p>Error: {error}</p>}
        <p>Acceleration along X-axis: {acceleration.x.toFixed(2)}</p>
        <p>Acceleration along Y-axis: {acceleration.y.toFixed(2)}</p>
        <p>Acceleration along Z-axis: {acceleration.z.toFixed(2)}</p>

        <h2>Device Information</h2>
        <p><strong>User Agent:</strong> {deviceInfo.userAgent}</p>
        <p><strong>Platform:</strong> {deviceInfo.platform}</p>
        <p><strong>CPU Cores:</strong> {deviceInfo.cpuCores}</p>
        <p><strong>Memory (GB):</strong> {deviceInfo.memory}</p>
        <p><strong>Screen Width:</strong> {deviceInfo.screenWidth}px</p>
        <p><strong>Screen Height:</strong> {deviceInfo.screenHeight}px</p>
        <p><strong>Color Depth:</strong> {deviceInfo.screenColorDepth}-bit</p>
        <p><strong>App Name:</strong> {deviceInfo.appName}</p>
        <p><strong>App Version:</strong> {deviceInfo.appVersion}</p>
        <p><strong>Browser Language:</strong> {deviceInfo.browserLanguage}</p>
        <p><strong>Vendor:</strong> {deviceInfo.vendor}</p>
        <p><strong>Product:</strong> {deviceInfo.product}</p>
        <p><strong>User Agent Data:</strong> {JSON.stringify(deviceInfo.userAgentData)}</p>

        <h2>Geolocation</h2>
        {geoInfo.error ? <p>{geoInfo.error}</p> : (
            <>
              <p><strong>Latitude:</strong> {geoInfo.latitude}</p>
              <p><strong>Longitude:</strong> {geoInfo.longitude}</p>
            </>
        )}

        <h2>Network Information</h2>
        {networkInfo.error ? <p>{networkInfo.error}</p> : (
            <>
              <p><strong>Effective Network Type:</strong> {networkInfo.effectiveType}</p>
              <p><strong>Downlink:</strong> {networkInfo.downlink} Mbps</p>
              <p><strong>RTT:</strong> {networkInfo.rtt} ms</p>
            </>
        )}

        <h2>Storage Information</h2>
        {storageInfo.error ? <p>{storageInfo.error}</p> : (
            <>
              <p><strong>Quota:</strong> {storageInfo.quota} bytes</p>
              <p><strong>Usage:</strong> {storageInfo.usage} bytes</p>
            </>
        )}

        {!listening ? (
            <>
              <button onClick={startListening}>Start Listening</button>
              <button onClick={requestPermission}>Request Permission</button>
            </>
        ) : (
            <button onClick={stopListening}>Stop Listening</button>
        )}
      </div>
  );
};

export default DeviceInfoComponent;
