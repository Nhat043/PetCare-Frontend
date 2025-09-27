import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const StarRating = ({ rating, reviewCount }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <span key={`full-${i}`} style={{ color: '#ffd700', fontSize: '16px' }}>★</span>
        );
    }
    if (hasHalfStar) {
        stars.push(
            <span key="half" style={{ color: '#ffd700', fontSize: '16px' }}>☆</span>
        );
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <span key={`empty-${i}`} style={{ color: '#ddd', fontSize: '16px' }}>☆</span>
        );
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
            <div style={{ display: 'flex' }}>{stars}</div>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>
                ({rating.toFixed(1)} • {reviewCount} reviews)
            </span>
        </div>
    );
};

const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [error, setError] = useState('');
    const [commentsError, setCommentsError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [userData, setUserData] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [submittingRating, setSubmittingRating] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [ratingError, setRatingError] = useState('');
    const [hidingComment, setHidingComment] = useState(null);

    const fetchComments = async (page = 1) => {
        setCommentsLoading(true);
        setCommentsError('');
        try {
            const res = await fetch(`${API_ENDPOINTS.COMMENTS}/post/${id}?page=${page}&limit=10`);
            const data = await res.json();
            if (res.ok) {
                setComments(data.comments || []);
                setTotalPages(data.total_pages || 1);
                setCurrentPage(page);
            } else {
                setCommentsError(data.error || 'Failed to fetch comments');
            }
        } catch (err) {
            setCommentsError('Network error. Please try again.');
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!userData) {
            setCommentError('You must be logged in to comment.');
            return;
        }
        if (!newComment.trim()) {
            setCommentError('Please enter a comment.');
            return;
        }

        setSubmittingComment(true);
        setCommentError('');
        try {
            const res = await fetch(`${API_ENDPOINTS.COMMENTS}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userData.user_id.toString(),
                    entity_type: 'post',
                    entity_id: parseInt(id),
                    comment: newComment.trim()
                })
            });
            const data = await res.json();
            if (res.ok) {
                setNewComment('');
                // Refresh comments
                fetchComments(currentPage);
            } else {
                setCommentError(data.error || 'Failed to submit comment');
            }
        } catch (err) {
            setCommentError('Network error. Please try again.');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleSubmitRating = async (rating) => {
        if (!userData) {
            setRatingError('You must be logged in to rate this post.');
            return;
        }

        setSubmittingRating(true);
        setRatingError('');
        try {
            const res = await fetch(API_ENDPOINTS.RATING, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userData.user_id.toString(),
                    entity_type: 'post',
                    entity_id: id.toString(),
                    rating: rating.toString()
                })
            });
            const data = await res.json();
            if (res.ok) {
                setUserRating(rating);
                // Optionally refresh the post to get updated rating
                window.location.reload();
            } else {
                setRatingError(data.error || 'Failed to submit rating');
            }
        } catch (err) {
            setRatingError('Network error. Please try again.');
        } finally {
            setSubmittingRating(false);
        }
    };

    const handleHideComment = async (commentId) => {
        console.log('handleHideComment called', userData, commentId);
        if (!userData || userData.role_id !== 1) {
            console.log('Not admin or not logged in');
            return;
        }
        setHidingComment(commentId);
        try {
            const res = await fetch(`${API_ENDPOINTS.COMMENTS}/update/${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status_id: 2
                })
            });
            const data = await res.json();
            if (res.ok) {
                console.log('Hide comment success', data);
                fetchComments(currentPage);
            } else {
                console.error('Failed to hide comment:', data.error);
                alert('Failed to hide comment: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error('Network error hiding comment:', err);
            alert('Network error: ' + err.message);
        } finally {
            setHidingComment(null);
        }
    };

    useEffect(() => {
        // Check for user authentication
        const userDataFromSession = sessionStorage.getItem('userData');
        if (userDataFromSession) {
            setUserData(JSON.parse(userDataFromSession));
        }

        const fetchPost = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${API_ENDPOINTS.POSTS}/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setPost(data.post || data.data);
                    // Fetch comments after post is loaded
                    fetchComments(1);
                } else {
                    setError(data.error || 'Failed to fetch post');
                }
            } catch (err) {
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div style={{ color: '#333', textAlign: 'center', marginTop: 40 }}>Loading...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
    if (!post) return <div style={{ color: '#333', textAlign: 'center', marginTop: 40 }}>Post not found.</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100vw', maxWidth: '100vw', background: '#fff', borderRadius: 0, boxShadow: 'none', padding: '48px 0', marginTop: 0 }}>
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 24, right: 48, background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#888' }}>&times;</button>
                <h2 style={{ marginBottom: 24, textAlign: 'center', fontSize: '2.5rem', color: '#222' }}>{post.title}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 32, fontSize: '1.1rem', color: '#444' }}>
                    <div><strong>User ID:</strong> {post.user_id}</div>
                    <div><strong>Category ID:</strong> {post.category_id}</div>
                </div>
                <div style={{ border: '2px solid #4f8cff', borderRadius: '10px', padding: '36px', background: '#f0f6ff', fontSize: '1.7rem', textAlign: 'center', color: '#222', fontWeight: 'bold', width: '90vw', maxWidth: '100vw', margin: '0 auto' }}
                    dangerouslySetInnerHTML={{ __html: post.content_html }}
                />

                {/* Rating Section */}
                <div style={{ width: '90vw', maxWidth: '800px', margin: '40px auto 0', padding: '0 20px' }}>
                    <h3 style={{ fontSize: '1.8rem', color: '#222', marginBottom: '20px', borderBottom: '2px solid #4f8cff', paddingBottom: '10px' }}>
                        Rate this Post
                    </h3>
                    <div style={{ marginBottom: 16 }}>
                        <StarRating rating={post.average_rating || 0} reviewCount={post.review_count || 0} />
                    </div>
                    {!userData ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '20px',
                            background: '#fff3cd',
                            border: '1px solid #ffeaa7',
                            borderRadius: '8px',
                            color: '#856404',
                            fontSize: '1.1rem'
                        }}>
                            <span>You must be logged in to rate this post. </span>
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#007bff',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}
                            >
                                Login here
                            </button>
                            <span> to rate.</span>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            {ratingError && (
                                <div style={{ color: 'red', marginBottom: '10px' }}>{ratingError}</div>
                            )}
                            <div style={{ marginBottom: '15px' }}>
                                <span style={{ fontSize: '1.1rem', color: '#666' }}>Click to rate:</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '15px' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleSubmitRating(star)}
                                        disabled={submittingRating}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '24px',
                                            color: userRating >= star ? '#ffd700' : '#ddd',
                                            cursor: submittingRating ? 'not-allowed' : 'pointer',
                                            transition: 'color 0.2s'
                                        }}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            {submittingRating && (
                                <div style={{ color: '#666', fontSize: '0.9rem' }}>Submitting rating...</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <div style={{ width: '90vw', maxWidth: '800px', margin: '40px auto 0', padding: '0 20px' }}>
                    <h3 style={{ fontSize: '1.8rem', color: '#222', marginBottom: '20px', borderBottom: '2px solid #4f8cff', paddingBottom: '10px' }}>
                        Comments ({comments.length})
                    </h3>
                    {/* Add Comment Form */}
                    <div style={{ marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '1.3rem', color: '#222', marginBottom: '15px' }}>Add a Comment</h4>

                        {!userData ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '15px',
                                background: '#fff3cd',
                                border: '1px solid #ffeaa7',
                                borderRadius: '6px',
                                color: '#856404',
                                fontSize: '1.1rem'
                            }}>
                                <span>You must be logged in to comment. </span>
                                <button
                                    onClick={() => navigate('/login')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#007bff',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Login here
                                </button>
                                <span> to comment.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitComment}>
                                {commentError && (
                                    <div style={{ color: 'red', marginBottom: '10px' }}>{commentError}</div>
                                )}
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write your comment here..."
                                    style={{
                                        width: '100%',
                                        minHeight: '100px',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        resize: 'vertical'
                                    }}
                                    disabled={submittingComment}
                                />
                                <button
                                    type="submit"
                                    disabled={submittingComment || !newComment.trim()}
                                    style={{
                                        marginTop: '10px',
                                        padding: '10px 20px',
                                        background: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        cursor: submittingComment || !newComment.trim() ? 'not-allowed' : 'pointer',
                                        opacity: submittingComment || !newComment.trim() ? 0.6 : 1
                                    }}
                                >
                                    {submittingComment ? 'Submitting...' : 'Submit Comment'}
                                </button>
                            </form>
                        )}
                    </div>

                    {commentsLoading ? (
                        <div style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
                            Loading comments...
                        </div>
                    ) : comments.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem', fontStyle: 'italic' }}>
                            No comments yet. Be the first to comment!
                        </div>
                    ) : (
                        <div>
                            {comments.map((comment) => (
                                <div key={comment.comment_id} style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    marginBottom: '15px',
                                    background: '#fafafa'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ fontWeight: 'bold', color: '#333' }}>
                                            Name: {comment.full_name || `User ID: ${comment.user_id}`}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                            {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '1.1rem',
                                        color: '#222',
                                        lineHeight: '1.5'
                                    }}>
                                        {comment.comment}
                                    </div>
                                    {userData && userData.role_id === 1 && (
                                        <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => { console.log('Clicked', comment.comment_id); handleHideComment(comment.comment_id); }}
                                                disabled={hidingComment === comment.comment_id}
                                                style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: hidingComment === comment.comment_id ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.9rem',
                                                    opacity: hidingComment === comment.comment_id ? 0.6 : 1
                                                }}
                                            >
                                                {hidingComment === comment.comment_id ? 'Hiding...' : 'Hide Comment'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    marginTop: '30px'
                                }}>
                                    <button
                                        onClick={() => fetchComments(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: '8px 16px',
                                            border: '1px solid #4f8cff',
                                            background: currentPage === 1 ? '#f0f0f0' : '#fff',
                                            color: currentPage === 1 ? '#999' : '#4f8cff',
                                            borderRadius: '4px',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Previous
                                    </button>
                                    <span style={{ padding: '8px 16px', color: '#666' }}>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => fetchComments(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: '8px 16px',
                                            border: '1px solid #4f8cff',
                                            background: currentPage === totalPages ? '#f0f0f0' : '#fff',
                                            color: currentPage === totalPages ? '#999' : '#4f8cff',
                                            borderRadius: '4px',
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage; 