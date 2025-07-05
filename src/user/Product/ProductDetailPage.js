import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PRODUCTS_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/products';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${PRODUCTS_API}/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setProduct(data.product || data.data);
                } else {
                    setError(data.error || 'Failed to fetch product');
                }
            } catch (err) {
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div style={{ color: '#333', textAlign: 'center', marginTop: 40 }}>Loading...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
    if (!product) return <div style={{ color: '#333', textAlign: 'center', marginTop: 40 }}>Product not found.</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100vw', maxWidth: '100vw', background: '#fff', borderRadius: 0, boxShadow: 'none', padding: '48px 0', marginTop: 0 }}>
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 24, right: 48, background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#888' }}>&times;</button>
                <h2 style={{ marginBottom: 24, textAlign: 'center', fontSize: '2.5rem', color: '#222' }}>{product.name}</h2>
                {product.image_url && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                        <img src={product.image_url} alt="Product" style={{ maxHeight: '320px', maxWidth: '90vw', borderRadius: '12px', boxShadow: '0 2px 12px #e3e3e3' }} />
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 32, fontSize: '1.1rem', color: '#444' }}>
                    <div><strong>Category ID:</strong> {product.category_id}</div>
                </div>
                <div style={{ border: '2px solid #4f8cff', borderRadius: '10px', padding: '36px', background: '#f0f6ff', fontSize: '1.7rem', textAlign: 'center', color: '#222', fontWeight: 'bold', width: '90vw', maxWidth: '100vw', margin: '0 auto', marginBottom: 24 }}>
                    <div style={{ marginBottom: 16 }}><span style={{ color: '#007bff', fontWeight: 'bold', fontSize: '2rem' }}>${product.price}</span></div>
                    <div style={{ fontSize: '1.2rem', color: '#333' }}>{product.description || 'No description.'}</div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage; 