import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import axiosClient from '../../api/axiosClient';
import '../../styles/testimonials.css';

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await axiosClient.get('/reviews');
                setTestimonials(res.data);
            } catch (err) {
                console.error("Failed to fetch testimonials:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    if (loading) return null; // Or a skeleton

    return (
        <section className="testimonials section" id="testimonials">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">{t('reviews')}</span>
                    <h2 className="section-title">{t('whatCustomersSay')}</h2>
                </div>

                <div className="testimonials-grid">
                    {testimonials.length > 0 ? (
                        testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="testimonial-card">
                                <div className="testimonial-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={`testimonial-star ${i < testimonial.rating ? '' : 'empty'}`}
                                            fill={i < testimonial.rating ? '#F5A623' : 'none'}
                                            stroke={i < testimonial.rating ? '#F5A623' : '#ccc'}
                                        />
                                    ))}
                                </div>
                                <p className="testimonial-text">"{testimonial.comment}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar-placeholder">
                                        {(testimonial.User?.name || t('customer')).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="testimonial-author-info">
                                        <div className="testimonial-author-name">{testimonial.User?.name || t('customer')}</div>
                                        <div className="testimonial-author-title">{t('rentalCustomer')}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', gridColumn: '1/-1', color: '#666' }}>
                            {t('noReviews')}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
