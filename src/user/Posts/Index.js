import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const POSTS_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/posts';

const PostsIndex = () => {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchPosts = async (page = 1, limit = 10, search = '', category = '') => {
        setLoading(true);
        setError('');
        let url = `${POSTS_API}?page=${page}&limit=${limit}`;
        if (search) url += `&title=${encodeURIComponent(search)}`;
        if (category) url += `&category_id=${category}`;
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
        fetchPosts(pagination.page, pagination.limit, search, category);
        // eslint-disable-next-line
    }, [pagination.page, search, category]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPagination((p) => ({ ...p, page: 1 }));
    };

    const handleCategory = (e) => {
        setCategory(e.target.value);
        setPagination((p) => ({ ...p, page: 1 }));
    };

    const handlePage = (newPage) => {
        setPagination((p) => ({ ...p, page: newPage }));
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={handleSearch}
                    style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
                <input
                    type="number"
                    placeholder="Category ID"
                    value={category}
                    onChange={handleCategory}
                    style={{ width: 120, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
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
                                    }}
                                    onClick={() => navigate(`/posts/${post.post_id}`)}
                                >
                                    <div style={{ fontWeight: 'bold', fontSize: '1.15rem', marginBottom: 10, color: '#007bff' }}>{post.title}</div>
                                    <div style={{ color: '#555', fontSize: '1rem' }}>Category ID: {post.category_id}</div>
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
    );
};

export default PostsIndex; 