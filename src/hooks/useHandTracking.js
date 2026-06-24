import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export function useHandTracking(isTracking) {
  const [activeFingerCount, setActiveFingerCount] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const bufferRef = useRef([]);
  const REQUIRED_STABLE_FRAMES = 3;
  const currentCountRef = useRef(0);

  const onResults = useCallback((results) => {
    if (canvasRef.current && videoRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d');
      if (canvasCtx) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.translate(canvasRef.current.width, 0);
        canvasCtx.scale(-1, 1);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          for (const landmarks of results.multiHandLandmarks) {
            canvasCtx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
            canvasCtx.lineWidth = 2;

            for (const landmark of landmarks) {
              const x = landmark.x * canvasRef.current.width;
              const y = landmark.y * canvasRef.current.height;
              canvasCtx.beginPath();
              canvasCtx.arc(x, y, 3, 0, 2 * Math.PI);
              canvasCtx.fillStyle = 'rgba(245, 158, 11, 0.8)';
              canvasCtx.fill();
            }
          }
        }
        canvasCtx.restore();
      }
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      let totalCount = 0;

      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const landmarks = results.multiHandLandmarks[i];
        const handedness = results.multiHandedness[i].label;

        let count = 0;

        if (handedness === 'Right') {
          if (landmarks[4].x < landmarks[3].x) count++;
        } else {
          if (landmarks[4].x > landmarks[3].x) count++;
        }

        if (landmarks[8].y < landmarks[6].y) count++;
        if (landmarks[12].y < landmarks[10].y) count++;
        if (landmarks[16].y < landmarks[14].y) count++;
        if (landmarks[20].y < landmarks[18].y) count++;

        totalCount += count;
      }

      const clampedCount = Math.min(Math.max(totalCount, 0), 6);

      bufferRef.current.push(clampedCount);
      if (bufferRef.current.length > REQUIRED_STABLE_FRAMES) {
        bufferRef.current.shift();
      }

      const isStable = bufferRef.current.every((val) => val === clampedCount);

      if (isStable && currentCountRef.current !== clampedCount) {
        currentCountRef.current = clampedCount;
        setActiveFingerCount(clampedCount);
      }
    } else {
      bufferRef.current.push(0);
      if (bufferRef.current.length > REQUIRED_STABLE_FRAMES) {
        bufferRef.current.shift();
      }
      const isStable = bufferRef.current.every((val) => val === 0);
      if (isStable && currentCountRef.current !== 0) {
        currentCountRef.current = 0;
        setActiveFingerCount(0);
      }
    }
  }, []);

  useEffect(() => {
    let hands = null;
    let camera = null;

    if (isTracking && videoRef.current) {
      hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      hands.onResults(onResults);

      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && hands) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720,
      });

      camera.start();
    }

    return () => {
      if (camera) {
        camera.stop();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      if (hands) {
        hands.close();
      }
      bufferRef.current = [];
      setActiveFingerCount(0);
      currentCountRef.current = 0;
    };
  }, [isTracking, onResults]);

  return { activeFingerCount, videoRef, canvasRef };
}