import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Teams.css';

interface Team {
  id: string;
  name: string;
  fullName: string;
  color: string;
  logo: string;
  description: string;
  founded: string;
  championships: number;
}

const Teams: React.FC = () => {
  const navigate = useNavigate();

  const teams: Team[] = [
    {
      id: 'mercedes',
      name: 'Mercedes',
      fullName: 'Mercedes-AMG Petronas F1 Team',
      color: '#00d2be',
      logo: '/teams/mercedes.png',
      description: 'The Silver Arrows - Dominant force in modern F1',
      founded: '2010',
      championships: 8
    },
    {
      id: 'red-bull',
      name: 'Red Bull',
      fullName: 'Oracle Red Bull Racing',
      color: '#1e41ff',
      logo: '/teams/redbull.png',
      description: 'Energy drink powered racing excellence',
      founded: '2005',
      championships: 6
    },
    {
      id: 'ferrari',
      name: 'Ferrari',
      fullName: 'Scuderia Ferrari',
      color: '#dc143c',
      logo: '/teams/ferrari.png',
      description: 'The Prancing Horse - F1\'s most iconic team',
      founded: '1950',
      championships: 16
    },
    {
      id: 'mclaren',
      name: 'McLaren',
      fullName: 'McLaren F1 Team',
      color: '#ff8700',
      logo: '/teams/mclaren.png',
      description: 'British racing heritage and innovation',
      founded: '1966',
      championships: 8
    },
    {
      id: 'alpine',
      name: 'Alpine',
      fullName: 'BWT Alpine F1 Team',
      color: '#0082fa',
      logo: '/teams/alpine.png',
      description: 'French manufacturer with racing passion',
      founded: '2021',
      championships: 2
    },
    {
      id: 'aston-martin',
      name: 'Aston Martin',
      fullName: 'Aston Martin Aramco Cognizant F1 Team',
      color: '#006847',
      logo: '/teams/aston-martin.png',
      description: 'British luxury meets F1 performance',
      founded: '2021',
      championships: 0
    },
    {
      id: 'williams',
      name: 'Williams',
      fullName: 'Williams Racing',
      color: '#005aff',
      logo: '/teams/willams.png',
      description: 'Historic British racing team',
      founded: '1977',
      championships: 9
    },
    {
      id: 'haas',
      name: 'Haas',
      fullName: 'MoneyGram Haas F1 Team',
      color: '#ffffff',
      logo: '/teams/haas.png',
      description: 'American team with global ambitions',
      founded: '2016',
      championships: 0
    },
    {
      id: 'racing-bulls',
      name: 'Racing Bulls',
      fullName: 'Visa Cash App RB F1 Team',
      color: '#2b4562',
      logo: '/teams/racing-bulls.png',
      description: 'The next generation of Red Bull racing',
      founded: '2024',
      championships: 0
    },
    {
      id: 'kick',
      name: 'Kick Sauber',
      fullName: 'Stake F1 Team Kick Sauber',
      color: '#900000',
      logo: '/teams/kick.png',
      description: 'Swiss precision meets F1 innovation',
      founded: '2024',
      championships: 0
    }
  ];

  const handleTeamClick = (teamId: string) => {
    navigate(`/teams/${teamId}/products`);
  };

  return (
    <div className="teams-page">
      <div className="teams-container">
        {/* Page Header */}
        <div className="teams-header">
          <h1 className="teams-title">Formula 1 Teams</h1>
        </div>

        {/* Teams Grid */}
        <div className="teams-grid">
          {teams.map((team) => (
                                    <div
                          key={team.id}
                          className="team-image-card"
                          onClick={() => handleTeamClick(team.id)}
                        >
                          <img
                            src={team.logo}
                            alt={`${team.name} Team`}
                            className="team-image"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              (e.target as HTMLImageElement).src = `https://via.placeholder.com/600x300/${team.color.replace('#', '')}/ffffff?text=${team.name}`;
                            }}
                          />
                          
                          {/* Hover overlay with hint */}
                          <div className="hover-overlay">
                            <div className="hover-hint">
                              <span className="hint-text">View {team.name} Products</span>
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

export default Teams;