import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import axiosClient from '../api/axiosClient';
import { useLanguage } from '../context/LanguageContext';
import { Package, Calendar, Clock, ChevronRight } from 'lucide-react';

const RentalHistoryPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axiosClient.get('/rentals');
        setRentals(response.data);
      } catch (error) {
        console.error("Failed to fetch rentals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '120px', paddingBottom: '80px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>{t('rentalHistory')}</h1>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>{t('loadingRentalHistory')}</div>
            ) : rentals.length === 0 ? (
              <div style={{ backgroundColor: 'white', padding: '60px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <Package size={48} color="#ccc" style={{ marginBottom: '20px' }} />
                <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{t('noOrdersYet')}</h2>
                <p style={{ color: '#888', marginBottom: '25px' }}>{t('exploreCollections')}</p>
                <button onClick={() => window.location.href='/products'} style={{ padding: '12px 30px', backgroundColor: '#08060d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  {t('viewProducts')}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {rentals.map((rental) => (
                  <div key={rental.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '60px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={30} color="#888" />
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 5px', fontSize: '18px' }}>{t('orderNumber')} #{rental.id}</h3>
                        <div style={{ display: 'flex', gap: '15px', color: '#888', fontSize: '14px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={14} /> {new Date(rental.createdAt).toLocaleDateString(t('dateFormat'))}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Clock size={14} /> 
                            {rental.status === 'pending' && t('pendingStatus')}
                            {rental.status === 'approved' && t('approvedStatus')}
                            {rental.status === 'renting' && t('renting')}
                            {rental.status === 'returned' && t('returned')}
                            {rental.status === 'cancelled' && t('cancelled')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 5px', fontWeight: '600', fontSize: '18px' }}>{rental.total_price?.toLocaleString('vi-VN')}đ</p>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#08060d', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                        {t('viewDetail')} <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RentalHistoryPage;
