import React, { useState, useEffect } from 'react';

interface PromptComment {
  id: string;
  promptId: string;
  userId: string;
  content: string;
  createdAt: string;
  parentCommentId?: string;
}

interface CommentsSectionProps {
  promptId: string;
  currentUserId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ promptId, currentUserId }) => {
  const [comments, setComments] = useState<PromptComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [promptId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/collaboration/prompts/${promptId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/collaboration/prompts/${promptId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          content: newComment,
          parentCommentId: replyTo,
        }),
      });

      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const rootComments = comments.filter(comment => !comment.parentCommentId);
  const getReplies = (parentId: string) => 
    comments.filter(comment => comment.parentCommentId === parentId);

  const CommentItem: React.FC<{ comment: PromptComment; isReply?: boolean }> = ({ 
    comment, 
    isReply = false 
  }) => {
    const replies = getReplies(comment.id);

    return (
      <div
        style={{
          background: isReply ? '#f8f9fa' : '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '8px',
          marginLeft: isReply ? '20px' : '0',
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#4CAF50',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              {comment.userId.slice(0, 2).toUpperCase()}
            </div>
            <strong>{comment.userId}</strong>
            <span style={{ color: '#666', fontSize: '12px' }}>
              {formatTimestamp(comment.createdAt)}
            </span>
          </div>
          <button
            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'underline',
            }}
          >
            Reply
          </button>
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          {comment.content}
        </div>

        {replies.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            {replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}

        {replyTo === comment.id && (
          <div style={{ marginTop: '12px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                }}
              >
                Reply
              </button>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="comments-section">
      <h3 style={{ marginBottom: '16px', color: '#333' }}>
        Comments ({comments.length})
      </h3>

      {/* Add new comment form */}
      {!replyTo && (
        <form onSubmit={handleAddComment} style={{ marginBottom: '20px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {loading ? 'Adding...' : 'Add Comment'}
            </button>
          </div>
        </form>
      )}

      {/* Comments list */}
      <div className="comments-list">
        {rootComments.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          rootComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;