import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySidebar from '../../components/CategorySidebar';
import { API_ENDPOINTS } from '../../config/api';

// Star Rating Component
const StarRating = ({ rating, reviewCount }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Create full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <span key={`full-${i}`} style={{ color: '#ffd700', fontSize: '16px' }}>
                ★
            </span>
        );
    }

    // Add half star if needed
    if (hasHalfStar) {
        stars.push(
            <span key="half" style={{ color: '#ffd700', fontSize: '16px' }}>
                ☆
            </span>
        );
    }

    // Add empty stars to complete 5 stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <span key={`empty-${i}`} style={{ color: '#ddd', fontSize: '16px' }}>
                ☆
            </span>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
            <div style={{ display: 'flex' }}>
                {stars}
            </div>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>
                ({rating.toFixed(1)} • {reviewCount} reviews)
            </span>
        </div>
    );
};

// Add a function to get status color
const getStatusColor = (status) => {
    if (!status) return '#b85c00';
    const s = status.toLowerCase();
    if (s === 'published') return '#28a745';
    if (s === 'draft') return '#007bff';
    if (s === 'deleted') return '#dc3545';
    if (s === 'archived') return '#888';
    return '#b85c00';
};

const PostsIndex = ({ adminView = false }) => {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTag, setSelectedTag] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchPosts = async (page = 1, limit = 10, search = '', category = null, tag = null) => {
        setLoading(true);
        setError('');
        let url = `${API_ENDPOINTS.POSTS}?page=${page}&limit=${limit}`;
        if (!adminView) url += `&status_id=2`;
        if (search) url += `&title=${encodeURIComponent(search)}`;
        if (category) url += `&category_id=${category}`;
        if (tag) url += `&tag_id=${tag}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) {
                setPosts(data.posts || data.data || []);
                setPagination(data.pagination || { page, limit, total: 0, total_pages: 1 });
            } else {
                setError(data.error || 'Failed to fetch posts');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(pagination.page, pagination.limit, search, selectedCategory, selectedTag);
        // eslint-disable-next-line
    }, [pagination.page, search, selectedCategory, selectedTag]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPagination((p) => ({ ...p, page: 1 }));
    };

    const handlePage = (newPage) => {
        setPagination((p) => ({ ...p, page: newPage }));
    };

    return (
        <div style={{ display: 'flex', gap: 24 }}>
            <CategorySidebar
                selectedCategory={selectedCategory}
                onSelectCategory={catId => {
                    setSelectedCategory(catId);
                    setPagination(p => ({ ...p, page: 1 }));
                }}
                selectedTag={selectedTag}
                onSelectTag={tagId => {
                    setSelectedTag(tagId);
                    setPagination(p => ({ ...p, page: 1 }));
                }}
            />
            <div style={{ flex: 1 }}>
                {!adminView && (
                    <button
                        style={{ marginBottom: 20, padding: '10px 24px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer' }}
                        onClick={() => navigate('/post/create')}
                    >
                        Create a Post
                    </button>
                )}
                <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={handleSearch}
                        style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                </div>
                {loading && <div>Loading...</div>}
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {!loading && !error && (
                    <>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                gap: 28,
                                marginBottom: 24,
                            }}
                        >
                            {posts.length === 0 ? (
                                <div>No posts found.</div>
                            ) : (
                                posts.map((post) => (
                                    <div
                                        key={post.post_id}
                                        style={{
                                            background: '#fff',
                                            borderRadius: 12,
                                            boxShadow: '0 2px 8px #eee',
                                            padding: 24,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            transition: 'box-shadow 0.2s',
                                            minHeight: '120px',
                                        }}
                                        onClick={() => navigate(`/posts/${post.post_id}`)}
                                    >
                                        <div style={{ fontWeight: 'bold', fontSize: '1.15rem', marginBottom: 10, color: '#007bff' }}>{post.title}</div>
                                        <div style={{ color: '#555', fontSize: '1rem', marginBottom: '5px' }}>Animal: {post.category_name}</div>
                                        <div style={{ color: '#555', fontSize: '1rem', marginBottom: '5px' }}>Tag: {post.tag_name}</div>
                                        {adminView && (
                                            <div style={{ color: getStatusColor(post.status_name), fontSize: '0.95rem', marginBottom: '5px', fontWeight: 'bold' }}>
                                                Status: {post.status_name || post.status_id}
                                            </div>
                                        )}
                                        <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px' }}>
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </div>
                                        <StarRating
                                            rating={post.average_rating || 0}
                                            reviewCount={post.review_count || 0}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                            <button
                                onClick={() => handlePage(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                style={{ padding: '6px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#f0f0f0', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer' }}
                            >
                                Prev
                            </button>
                            <span style={{ alignSelf: 'center' }}>
                                Page {pagination.page} of {pagination.total_pages}
                            </span>
                            <button
                                onClick={() => handlePage(pagination.page + 1)}
                                disabled={pagination.page >= pagination.total_pages}
                                style={{ padding: '6px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#f0f0f0', cursor: pagination.page >= pagination.total_pages ? 'not-allowed' : 'pointer' }}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PostsIndex; 