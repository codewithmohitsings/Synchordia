import { useState, useRef, useCallback, useEffect } from 'react';
import * as Tone from 'tone';

export function useRecorder(videoRef, canvasRef) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordingCanvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    recordingCanvasRef.current = canvas;

    return () => {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    };
  }, []);

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      setIsRecording(false);
      return;
    }

    if (!videoRef.current || !canvasRef.current || !recordingCanvasRef.current) {
      console.warn('Video or canvas references missing');
      alert('Please wait for the camera to initialize before recording.');
      return;
    }

    try {
      await Tone.start();

      const audioCtx = Tone.getContext().rawContext;
      if (!audioCtx.createMediaStreamDestination) {
        throw new Error('MediaStreamDestination is not supported in this browser.');
      }
      const dest = audioCtx.createMediaStreamDestination();

      Tone.getDestination().connect(dest);

      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const micSource = audioCtx.createMediaStreamSource(micStream);
      micSource.connect(dest);

      const recCanvas = recordingCanvasRef.current;
      const recCtx = recCanvas.getContext('2d');

      if (!recCtx) throw new Error('Could not get canvas context');

      let lastDrawTime = 0;
      const FPS = 30;
      const frameInterval = 1000 / FPS;

      const drawFrame = (timestamp) => {
        if (!lastDrawTime) lastDrawTime = timestamp;
        const elapsed = timestamp - lastDrawTime;

        if (elapsed >= frameInterval) {
          lastDrawTime = timestamp - (elapsed % frameInterval);
          if (videoRef.current && canvasRef.current) {
            recCtx.fillStyle = '#0a0807';
            recCtx.fillRect(0, 0, recCanvas.width, recCanvas.height);

            recCtx.save();
            recCtx.translate(recCanvas.width, 0);
            recCtx.scale(-1, 1);
            recCtx.filter = 'sepia(15%) contrast(110%) saturate(60%)';
            recCtx.globalAlpha = 0.7;

            if (videoRef.current.readyState >= 2) {
              recCtx.drawImage(videoRef.current, 0, 0, recCanvas.width, recCanvas.height);
            }
            recCtx.restore();

            recCtx.drawImage(canvasRef.current, 0, 0, recCanvas.width, recCanvas.height);
          }
        }
        animationFrameId.current = requestAnimationFrame(drawFrame);
      };

      animationFrameId.current = requestAnimationFrame(drawFrame);

      const canvasStream = recCanvas.captureStream(30);
      const combinedStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);

      let options = { mimeType: 'video/webm;codecs=vp9,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm;codecs=vp8,opus' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/mp4' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = {};
      }

      const recorder = new MediaRecorder(combinedStream, options);

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (chunksRef.current.length === 0) {
          console.warn('No data chunks available for recording.');
          return;
        }
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        const ext = recorder.mimeType.includes('mp4') ? 'mp4' : 'webm';
        a.download = `Harmonium_Performance_${new Date().getTime()}.${ext}`;

        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);

        micStream.getTracks().forEach((t) => t.stop());
        micSource.disconnect();
        try {
          Tone.getDestination().disconnect(dest);
        } catch (e) {
          console.error('Error disconnecting Tone destination:', e);
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error('Recording setup failed:', err);
      alert(`Recording failed to start: ${err.message}`);
      setIsRecording(false);
    }
  }, [isRecording, videoRef, canvasRef]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return {
    isRecording,
    toggleRecording,
  };
}