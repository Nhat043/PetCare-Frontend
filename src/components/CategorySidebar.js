import React, { useEffect, useState } from 'react';

const CATEGORY_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/category';
const TAG_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/tag';

const CategorySidebar = ({ selectedCategory, onSelectCategory, selectedTag, onSelectTag }) => {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetch(CATEGORY_API)
            .then(res => res.json())
            .then(data => setCategories(data.categories || []));
        fetch(TAG_API)
            .then(res => res.json())
            .then(data => setTags(data.tags || []));
    }, []);

    return (
        <div style={{ minWidth: 70, background: '#fefae0', borderRadius: 8, padding: 0, boxShadow: '0 2px 8px #eee' }}>
            <div style={{
                color: '#d6d85d',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                padding: '10px 12px',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                marginBottom: 8
            }}>
                Animals
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li
                    style={{
                        marginBottom: 10,
                        cursor: 'pointer',
                        fontWeight: !selectedCategory ? 'bold' : 'normal',
                        color: !selectedCategory ? '#007bff' : '#222',
                        paddingLeft: 12
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
                            color: selectedCategory === cat.category_id ? '#007bff' : '#222',
                            paddingLeft: 12
                        }}
                        onClick={() => onSelectCategory(cat.category_id)}
                    >
                        {cat.category_name}
                    </li>
                ))}
            </ul>
            <div style={{ borderTop: '1px solid #eee', margin: '16px 0 0 0' }} />
            <h4 style={{ margin: '16px 0 8px 12px', color: '#d6d85d', }}>Tags</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li
                    style={{
                        marginBottom: 10,
                        cursor: 'pointer',
                        fontWeight: !selectedTag ? 'bold' : 'normal',
                        color: !selectedTag ? '#007bff' : '#222',
                        paddingLeft: 12
                    }}
                    onClick={() => onSelectTag(null)}
                >
                    All
                </li>
                {tags.map(tag => (
                    <li
                        key={tag.tag_id}
                        style={{
                            marginBottom: 10,
                            cursor: 'pointer',
                            fontWeight: selectedTag === tag.tag_id ? 'bold' : 'normal',
                            color: selectedTag === tag.tag_id ? '#007bff' : '#222',
                            paddingLeft: 12
                        }}
                        onClick={() => onSelectTag(tag.tag_id)}
                    >
                        {tag.tag_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySidebar; 