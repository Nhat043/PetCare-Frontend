import React from 'react';

const PostWriting = () => {
    return (
        <div>
            <h2>Post Writing</h2>
            <form>
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" required />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea name="content" required />
                </div>
                <button type="submit">Submit Post</button>
            </form>
        </div>
    );
};

export default PostWriting;
