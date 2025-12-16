import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';
import Button from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';

const Scan: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const navigate = useNavigate();
    const controlsRef = useRef<IScannerControls | null>(null);
    const codeReader = useRef(new BrowserMultiFormatReader());

    const startScan = async () => {
        setScanning(true);
        setError(null);
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            const selectedDeviceId = videoDevices.find(device => device.label.toLowerCase().includes('back'))?.deviceId || videoDevices[0]?.deviceId;

            if (!selectedDeviceId) {
                throw new Error('No camera found');
            }

            const controls = await codeReader.current.decodeFromVideoDevice(
                selectedDeviceId,
                videoRef.current!,
                (result) => {
                    if (result) {
                        controls.stop();
                        controlsRef.current = null;
                        setScanning(false);
                        navigate(`/confirm/${result.getText()}`);
                    }
                }
            );
            controlsRef.current = controls;
        } catch (err) {
            console.error(err);
            setError('Could not access camera. Please ensure permissions are granted.');
            setScanning(false);
        }
    };

    const stopScan = () => {
        controlsRef.current?.stop();
        controlsRef.current = null;
        setScanning(false);
    };

    useEffect(() => {
        return () => {
            controlsRef.current?.stop();
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
            <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-xl">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                />
                {!scanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 text-white">
                        <p className="text-lg font-medium">Camera is off</p>
                    </div>
                )}
                {scanning && (
                    <div className="absolute inset-0 border-2 border-blue-500/50 pointer-events-none">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-pulse" />
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center p-4 text-red-800 bg-red-100 rounded-lg w-full max-w-md">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <div className="flex flex-col w-full max-w-md space-y-3">
                {!scanning ? (
                    <Button onClick={startScan} size="lg" className="w-full">
                        Start Scan
                    </Button>
                ) : (
                    <Button onClick={stopScan} variant="secondary" size="lg" className="w-full">
                        Stop Scan
                    </Button>
                )}

                <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Or enter manually</p>
                    <Button variant="ghost" onClick={() => navigate('/confirm/manual')} className="text-blue-600">
                        Skip Scanning
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Scan;
