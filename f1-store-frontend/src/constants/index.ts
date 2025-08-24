// App Constants
export const APP_NAME = 'SpeedZone';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5047/api';

// F1 Teams
export const F1_TEAMS = {
  MERCEDES: { name: 'Mercedes', color: '#00d2be' },
  RED_BULL: { name: 'Red Bull Racing', color: '#1e41ff' },
  FERRARI: { name: 'Ferrari', color: '#dc143c' },
  MCLAREN: { name: 'McLaren', color: '#ff8700' },
  ALPINE: { name: 'Alpine', color: '#0082fa' },
  ASTON_MARTIN: { name: 'Aston Martin', color: '#006847' },
  WILLIAMS: { name: 'Williams', color: '#005aff' },
  HAAS: { name: 'Haas', color: '#ffffff' },
  ALPHATAURI: { name: 'AlphaTauri', color: '#2b4562' },
  ALFA_ROMEO: { name: 'Alfa Romeo', color: '#900000' }
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#ff6b6b',
  SECONDARY: '#333333',
  ACCENT: '#007bff',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY: {
    100: '#f8f9fa',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529'
  }
};
