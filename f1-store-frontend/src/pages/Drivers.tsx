import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Drivers.css';

interface Driver {
  id: string;
  name: string;
  fullName: string;
  team: string;
  nationality: string;
  image: string;
  age: number;
  carNumber: number;
  championships: number;
}

const Drivers: React.FC = () => {
  const navigate = useNavigate();

  const drivers: Driver[] = [
    {
      id: 'max-verstappen',
      name: 'Max Verstappen',
      fullName: 'Max Emilian Verstappen',
      team: 'Red Bull Racing',
      nationality: 'Dutch',
      image: '/drivers/max.png',
      age: 27,
      carNumber: 1,
      championships: 3
    },
    {
      id: 'lewis-hamilton',
      name: 'Lewis Hamilton',
      fullName: 'Lewis Carl Davidson Hamilton',
      team: 'Ferrari',
      nationality: 'British',
      image: '/drivers/lewis.png',
      age: 39,
      carNumber: 44,
      championships: 7
    },
    {
      id: 'charles-leclerc',
      name: 'Charles Leclerc',
      fullName: 'Charles Marc Hervé Perceval Leclerc',
      team: 'Ferrari',
      nationality: 'Monégasque',
      image: '/drivers/charles.png',
      age: 27,
      carNumber: 16,
      championships: 0
    },
    {
      id: 'lando-norris',
      name: 'Lando Norris',
      fullName: 'Lando Norris',
      team: 'McLaren',
      nationality: 'British',
      image: '/drivers/lando.png',
      age: 25,
      carNumber: 4,
      championships: 0
    },
    {
      id: 'george-russell',
      name: 'George Russell',
      fullName: 'George William Russell',
      team: 'Mercedes',
      nationality: 'British',
      image: '/drivers/george.png',
      age: 26,
      carNumber: 63,
      championships: 0
    },
    {
      id: 'oscar-piastri',
      name: 'Oscar Piastri',
      fullName: 'Oscar Jack Piastri',
      team: 'McLaren',
      nationality: 'Australian',
      image: '/drivers/oscar.png',
      age: 23,
      carNumber: 81,
      championships: 0
    },
    {
      id: 'fernando-alonso',
      name: 'Fernando Alonso',
      fullName: 'Fernando Alonso Díaz',
      team: 'Aston Martin',
      nationality: 'Spanish',
      image: '/drivers/fernando alonso .png',
      age: 43,
      carNumber: 14,
      championships: 2
    }
  ];

  const handleDriverClick = (driverId: string) => {
    navigate(`/drivers/${driverId}/products`);
  };

  return (
    <div className="drivers-page">
      <div className="drivers-container">
        {/* Page Header */}
        <div className="drivers-header">
          <h1 className="drivers-title">Formula 1 Drivers</h1>
        </div>

        {/* Drivers Grid */}
        <div className="drivers-grid">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="driver-image-card"
              onClick={() => handleDriverClick(driver.id)}
            >
              <img
                src={driver.image}
                alt={`${driver.name} Driver`}
                className="driver-image"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/600x300/333333/ffffff?text=${driver.name}`;
                }}
              />
              
              {/* Hover overlay with hint */}
              <div className="hover-overlay">
                <div className="hover-hint">
                  <span className="hint-text">View {driver.name} Products</span>
                  <svg className="hint-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Drivers;
