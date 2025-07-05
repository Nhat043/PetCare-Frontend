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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f4f6fa' }}>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #dbeafe', padding: 36, maxWidth: 500, width: '100%', color: '#222', position: 'relative' }}>
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>&times;</button>
                <h2 style={{ marginBottom: 16 }}>{product.name}</h2>
                <div style={{ marginBottom: 8 }}><strong>Product ID:</strong> {product.product_id}</div>
                <div style={{ marginBottom: 8 }}><strong>Description:</strong> {product.description || 'N/A'}</div>
                <div style={{ marginBottom: 8 }}><strong>Price:</strong> <span style={{ color: '#007bff', fontWeight: 'bold' }}>${product.price}</span></div>
                <div style={{ marginBottom: 8 }}><strong>Stock:</strong> {product.stock}</div>
                <div style={{ marginBottom: 8 }}><strong>Category ID:</strong> {product.category_id}</div>
                <div style={{ marginBottom: 8 }}><strong>Status ID:</strong> {product.status_id}</div>
                <div style={{ marginBottom: 8 }}><strong>Created At:</strong> {product.created_at}</div>
                <div style={{ marginBottom: 8 }}><strong>Updated At:</strong> {product.updated_at}</div>
                {product.image_url && <img src={product.image_url} alt="Product" style={{ maxWidth: '100%', borderRadius: '4px', marginTop: '16px' }} />}
            </div>
        </div>
    );
};

export default ProductDetailPage; 