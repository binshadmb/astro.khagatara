'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalButtonProps {
  hostedButtonId: string;
  clientId?: string;
}

export default function PayPalButton({ hostedButtonId, clientId }: PayPalButtonProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const resolvedClientId = clientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const containerId = `paypal-container-${hostedButtonId}`;

  useEffect(() => {
    if (window.paypal) setSdkReady(true);
  }, []);

  useEffect(() => {
    if (sdkReady && window.paypal) {
      window.paypal
        .HostedButtons({ hostedButtonId })
        .render(`#${containerId}`);
    }
  }, [sdkReady, hostedButtonId, containerId]);

  if (!resolvedClientId) return null;

  return (
    <>
      <Script
        id="paypal-sdk"
        src={`https://www.paypal.com/sdk/js?client-id=${resolvedClientId}&components=hosted-buttons&disable-funding=venmo&currency=EUR`}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />
      <div id={containerId} />
    </>
  );
}
