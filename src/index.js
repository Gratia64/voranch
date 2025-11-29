/**
 * --------------------------------------------------------------------------
 * I G N I T I O N   S E Q U E N C E
 * --------------------------------------------------------------------------
 * Target: DOM Element 'root'
 * Function: Mounts the VOR Logic-Construct
 * --------------------------------------------------------------------------
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './VOR'; // Imports your specific logic construct

// Locate the mounting point within the HTML shell
const container = document.getElementById('root');

if (container) {
    const root = createRoot(container);
    // Engage the React cycle
    root.render(<App />);
} else {
    console.error("[CRITICAL] Mounting point 'root' not found in the HTML shell.");
}