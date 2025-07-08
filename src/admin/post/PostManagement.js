import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostsIndex from '../../user/Posts/Index';

const DRAFT_STATUS_ID = 1;
const PUBLISHED_STATUS_ID = 2;
const REJECTED_STATUS_ID = 4;
const POSTS_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/posts';

const PostManagement = () => {
    const navigate = useNavigate();
    const [reviewMode, setReviewMode] = useState(false);
    const [draftPosts, setDraftPosts] = useState([]);
    const [loadingDrafts, setLoadingDrafts] = useState(false);
    const [selectedDraft, setSelectedDraft] = useState(null);
    const [draftDetail, setDraftDetail] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch all draft posts when reviewMode is enabled
    useEffect(() => {
        if (reviewMode) {
            fetchDraftPosts();
        }
    }, [reviewMode]);

    const fetchDraftPosts = async () => {
        setLoadingDrafts(true);
        setError('');
        try {
            const res = await fetch(`${POSTS_API}?status_id=1&page=1&limit=50`);
            const data = await res.json();
            if (res.ok) {
                setDraftPosts(data.posts || []);
            } else {
                setError(data.error || 'Failed to fetch draft posts');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoadingDrafts(false);
        }
    };

    const fetchDraftDetail = async (postId) => {
        setError('');
        setDraftDetail(null);
        try {
            const res = await fetch(`${POSTS_API}/${postId}`);
            const data = await res.json();
            if (res.ok) {
                setDraftDetail(data.post || data);
            } else {
                setError(data.error || 'Failed to fetch post detail');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    const handleApprove = async () => {
        if (!draftDetail) return;
        setActionLoading(true);
        setError('');
        try {
            const res = await fetch(`${POSTS_API}/${draftDetail.post_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_id: PUBLISHED_STATUS_ID })
            });
            if (res.ok) {
                setDraftDetail(null);
                setSelectedDraft(null);
                fetchDraftPosts();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to approve post');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!draftDetail) return;
        setActionLoading(true);
        setError('');
        try {
            const res = await fetch(`${POSTS_API}/${draftDetail.post_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_id: REJECTED_STATUS_ID })
            });
            if (res.ok) {
                setDraftDetail(null);
                setSelectedDraft(null);
                fetchDraftPosts();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to reject post');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // UI for reviewing a single draft post
    const renderDraftDetail = () => {
        if (!draftDetail) return null;
        return (
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 32, maxWidth: 700, margin: '32px auto' }}>
                <h2 style={{ color: '#007bff', marginBottom: 16 }}>{draftDetail.title}</h2>
                <div style={{ color: '#555', marginBottom: 8 }}>Animal: {draftDetail.category_name}</div>
                <div style={{ color: '#555', marginBottom: 8 }}>Tag: {draftDetail.tag_name}</div>
                <div style={{ color: '#888', marginBottom: 16 }}>Created: {new Date(draftDetail.created_at).toLocaleDateString()}</div>
                <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fafafa', marginBottom: 24, color: '#222' }}
                    dangerouslySetInnerHTML={{ __html: draftDetail.content_html }}
                />
                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button
                        onClick={handleApprove}
                        disabled={actionLoading}
                        style={{ padding: '12px 32px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {actionLoading ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={actionLoading}
                        style={{ padding: '12px 32px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {actionLoading ? 'Rejecting...' : 'Reject'}
                    </button>
                    <button
                        onClick={() => { setDraftDetail(null); setSelectedDraft(null); }}
                        style={{ padding: '12px 32px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Back
                    </button>
                </div>
            </div>
        );
    };

    // UI for listing all draft posts
    const renderDraftList = () => (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 32, maxWidth: 900, margin: '32px auto' }}>
            <h2 style={{ color: '#222', marginBottom: 24 }}>Draft Posts</h2>
            {loadingDrafts ? <div>Loading...</div> : null}
            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            {draftPosts.length === 0 && !loadingDrafts ? <div>No draft posts found.</div> : null}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                {draftPosts.map(post => (
                    <div
                        key={post.post_id}
                        style={{ background: '#f9f9f9', borderRadius: 8, boxShadow: '0 1px 4px #eee', padding: 20, cursor: 'pointer', border: '1px solid #eee' }}
                        onClick={() => { setSelectedDraft(post.post_id); fetchDraftDetail(post.post_id); }}
                    >
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#007bff', marginBottom: 8 }}>{post.title}</div>
                        <div style={{ color: '#555', fontSize: '1rem', marginBottom: 4 }}>Animal: {post.category_name}</div>
                        <div style={{ color: '#555', fontSize: '1rem', marginBottom: 4 }}>Tag: {post.tag_name}</div>
                        <div style={{ color: '#888', fontSize: '0.9rem' }}>{new Date(post.created_at).toLocaleDateString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6fa', width: '100vw' }}>
            <div style={{ width: '100vw', maxWidth: '100vw', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #dbeafe', padding: 36, margin: '0 auto', paddingTop: 40, paddingBottom: 40 }}>
                <h1 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 'bold', color: '#222', fontSize: '2.5rem' }}>Post Management</h1>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24, gap: 16 }}>
                    <button
                        onClick={() => setReviewMode(!reviewMode)}
                        style={{ padding: '12px 32px', background: reviewMode ? '#6c757d' : '#ff9800', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {reviewMode ? 'Back to All Posts' : 'Review Draft Post'}
                    </button>
                    {!reviewMode && (
                        <button
                            onClick={() => navigate('/admin/posts/create')}
                            style={{ padding: '12px 32px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Create Post
                        </button>
                    )}
                </div>
                {reviewMode ? (
                    draftDetail ? renderDraftDetail() : renderDraftList()
                ) : (
                    <PostsIndex adminView />
                )}
            </div>
        </div>
    );
};

export default PostManagement; 