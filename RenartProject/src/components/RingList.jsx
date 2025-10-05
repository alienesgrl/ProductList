import React, { useState, useEffect } from 'react';
import { ringService } from '../services/api';
import ImageCarousel from './ImageCarousel';
import './RingList.css';

const RingList = () => {
  const [rings, setRings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minPopularity: '',
    maxPopularity: ''
  });
  const [sortBy, setSortBy] = useState('default');
  const [goldPrice, setGoldPrice] = useState(null);

  useEffect(() => {
    loadRings();
  }, []);

  const loadRings = async () => {
    try {
      setLoading(true);
      let data;
      
      switch (sortBy) {
        case 'popularity':
          data = await ringService.getRingsSortedByPopularity();
          break;
        case 'price':
          data = await ringService.getRingsSortedByPrice();
          break;
        default:
          data = await ringService.getRings();
      }
      
      setRings(data);
      setError(null);
    } catch (err) {
      setError('Yüzükler yüklenirken bir hata oluştu.');
      console.error('Error loading rings:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const data = await ringService.getFilteredRings(activeFilters);
      setRings(data);
      setError(null);
    } catch (err) {
      setError('Filtreleme sırasında hata oluştu.');
      console.error('Error filtering rings:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minPopularity: '',
      maxPopularity: ''
    });
    loadRings();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    if (newSortBy !== sortBy) {
      loadRings();
    }
  };

  const getPopularityStars = (scoreOutOf5) => {
    const fullStars = Math.floor(scoreOutOf5);
    const hasHalfStar = scoreOutOf5 % 1 >= 0.5;
    
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) {
      stars += '½';
    }
    const emptyStars = 5 - Math.ceil(scoreOutOf5);
    stars += '☆'.repeat(emptyStars);
    
    return stars;
  };

  const getGoldType = (ring) => {
    const colors = Object.keys(ring.images || {});
    if (colors.length > 0) {
      const color = colors[0];
      return color === 'white' ? 'White Gold' : 
             color === 'yellow' ? 'Yellow Gold' : 'Rose Gold';
    }
    return 'Yellow Gold';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Yüzükler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={loadRings}>Tekrar Dene</button>
      </div>
    );
  }

  return (
    <div className="ring-list">
      <header className="app-header">
        <h1  style={{
                    fontFamily: 'Avenir',
                    fontWeight: '350',
                    fontSize: '45px'
                }}>Product List</h1>
        
      </header>

      <div className="controls-panel">
        <div className="filters">
          <h3>Filtrele</h3>
          <div className="filter-group">
            <input
              type="number"
              placeholder="Min Fiyat ($)"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Fiyat ($)"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="Min Popülerlik (0-5)"
              value={filters.minPopularity}
              onChange={(e) => handleFilterChange('minPopularity', e.target.value)}
            />
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="Max Popülerlik (0-5)"
              value={filters.maxPopularity}
              onChange={(e) => handleFilterChange('maxPopularity', e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button onClick={applyFilters} className="btn-primary">
              Filtrele
            </button>
            <button onClick={clearFilters} className="btn-secondary">
              Temizle
            </button>
          </div>
        </div>

        <div className="sorting">
          <h3>Sırala</h3>
          <div className="sort-buttons">
            <button 
              className={sortBy === 'default' ? 'active' : ''}
              onClick={() => handleSortChange('default')}
            >
              Varsayılan
            </button>
            <button 
              className={sortBy === 'popularity' ? 'active' : ''}
              onClick={() => handleSortChange('popularity')}
            >
              Fiyat
            </button>
            <button 
              className={sortBy === 'price' ? 'active' : ''}
              onClick={() => handleSortChange('price')}
            >
              Popülerlik
            </button>
          </div>
        </div>
      </div>

      <div className="rings-horizontal-scroll">
        <div className="rings-scroll-container">
          {rings.map(ring => (
            <div key={ring.name} className="ring-card">
              <div className="ring-image-container">
                <ImageCarousel images={ring.images} productName={ring.name} />
              </div>
              
              <div className="ring-info">
                <h3>{ring.name}</h3>
                
                <div className="ring-price">
                  ${ring.price.toFixed(0)} USD
                </div>
                
                <div className="ring-details">
                  <div className="popularity">
                    <span className="stars">{getPopularityStars(ring.popularityScoreOutOf5)}</span>
                    <span className="score">{ring.popularityScoreOutOf5}/5</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {rings.length === 0 && (
        <div className="no-results">
          <p>Filtreleme kriterlerinize uygun yüzük bulunamadı.</p>
          <button onClick={clearFilters}>Tüm Yüzükleri Göster</button>
        </div>
      )}
    </div>
  );
};

export default RingList;