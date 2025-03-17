import { useEffect, useRef } from 'react';
import axios from 'axios';

const UserTracking = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleUserInteraction = (event) => {
      if (!iframeRef.current) return;
      const iframeWindow = iframeRef.current.contentWindow;
      
      if (iframeWindow && event.source === iframeWindow) {
        const { type, clientX, clientY } = event.data;
        
        if (type === 'click' || type === 'mousemove') {
          axios.post('http://localhost:5000/api/v1/events', {
            type,
            x: clientX,
            y: clientY,
            timestamp: new Date().toISOString()
          }).catch(err => console.error('Error sending event:', err));
        }
      }
    };

    window.addEventListener('message', handleUserInteraction);
    return () => window.removeEventListener('message', handleUserInteraction);
  }, []);

  return (
    <div>
      <h2>Prueba de Usabilidad</h2>
      <iframe 
        ref={iframeRef}
        src="https://google.com" 
        width="100%" 
        height="600px" 
        title="Website Testing"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default UserTracking;
