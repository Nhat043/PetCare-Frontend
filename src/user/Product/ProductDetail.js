import React from 'react';

const ProductDetail = ({ product, onClose }) => {
    if (!product) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: '8px', padding: '32px', maxWidth: '600px', width: '100%', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                <h2>{product.name}</h2>
                <div><strong>Product ID:</strong> {product.product_id}</div>
                <div><strong>Description:</strong> {product.description || 'N/A'}</div>
                <div><strong>Price:</strong> ${product.price}</div>
                <div><strong>Stock:</strong> {product.stock}</div>
                <div><strong>Category ID:</strong> {product.category_id}</div>
                <div><strong>Status ID:</strong> {product.status_id}</div>
                <div><strong>Created At:</strong> {product.created_at}</div>
                <div><strong>Updated At:</strong> {product.updated_at}</div>
                {product.image_url && <img src={product.image_url} alt="Product" style={{ maxWidth: '100%', borderRadius: '4px', marginTop: '16px' }} />}
            </div>
        </div>
    );
};

export default ProductDetail; 