import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductIndex from '../../user/Product/Index';

const ProductManagement = () => {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', background: '#f4f6fa', width: '100vw' }}>
            <div style={{ width: '100vw', maxWidth: '100vw', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #dbeafe', padding: 36, margin: '0 auto', paddingTop: 40, paddingBottom: 40 }}>
                <h1 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 'bold', color: '#222', fontSize: '2.5rem' }}>Product Management</h1>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
                    <button
                        onClick={() => navigate('/admin/products/create')}
                        style={{ padding: '12px 32px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Create Product
                    </button>
                </div>
                <ProductIndex />
            </div>
        </div>
    );
};

export default ProductManagement; 