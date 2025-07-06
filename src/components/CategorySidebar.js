import React, { useEffect, useState } from 'react';

const CATEGORY_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/category';

const CategorySidebar = ({ selectedCategory, onSelectCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch(CATEGORY_API)
            .then(res => res.json())
            .then(data => setCategories(data.categories || []));
    }, []);

    return (
        <div style={{ minWidth: 70, background: '#fff', borderRadius: 8, padding: 0, boxShadow: '0 2px 8px #eee' }}>
            <h4 style={{ marginBottom: 16 }}>Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li
                    style={{
                        marginBottom: 10,
                        cursor: 'pointer',
                        fontWeight: !selectedCategory ? 'bold' : 'normal',
                        color: !selectedCategory ? '#007bff' : '#222'
                    }}
                    onClick={() => onSelectCategory(null)}
                >
                    All
                </li>
                {categories.map(cat => (
                    <li
                        key={cat.category_id}
                        style={{
                            marginBottom: 10,
                            cursor: 'pointer',
                            fontWeight: selectedCategory === cat.category_id ? 'bold' : 'normal',
                            color: selectedCategory === cat.category_id ? '#007bff' : '#222'
                        }}
                        onClick={() => onSelectCategory(cat.category_id)}
                    >
                        {cat.category_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySidebar; 