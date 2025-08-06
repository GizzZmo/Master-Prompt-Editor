import React, { useState, useEffect } from 'react';

interface PromptVote {
  id: string;
  promptId: string;
  userId: string;
  voteType: 'up' | 'down';
  createdAt: string;
}

interface VoteSummary {
  upVotes: number;
  downVotes: number;
  score: number;
}

interface VotingComponentProps {
  promptId: string;
  currentUserId: string;
  onVoteChanged?: (summary: VoteSummary) => void;
}

const VotingComponent: React.FC<VotingComponentProps> = ({ 
  promptId, 
  currentUserId, 
  onVoteChanged 
}) => {
  const [voteSummary, setVoteSummary] = useState<VoteSummary>({ upVotes: 0, downVotes: 0, score: 0 });
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVotes();
  }, [promptId]);

  const fetchVotes = async () => {
    try {
      const response = await fetch(`/api/collaboration/prompts/${promptId}/votes`);
      const data = await response.json();
      setVoteSummary(data.summary);
      
      // Find current user's vote
      const currentUserVote = data.votes.find((vote: PromptVote) => vote.userId === currentUserId);
      setUserVote(currentUserVote ? currentUserVote.voteType : null);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/collaboration/prompts/${promptId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, voteType }),
      });

      const data = await response.json();
      setVoteSummary(data.summary);
      setUserVote(voteType);
      
      if (onVoteChanged) {
        onVoteChanged(data.summary);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="voting-component" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button
        onClick={() => handleVote('up')}
        disabled={loading}
        style={{
          background: userVote === 'up' ? '#4CAF50' : '#f0f0f0',
          color: userVote === 'up' ? 'white' : '#333',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 12px',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        👍 {voteSummary.upVotes}
      </button>
      
      <button
        onClick={() => handleVote('down')}
        disabled={loading}
        style={{
          background: userVote === 'down' ? '#f44336' : '#f0f0f0',
          color: userVote === 'down' ? 'white' : '#333',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 12px',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        👎 {voteSummary.downVotes}
      </button>
      
      <div style={{ 
        marginLeft: '10px', 
        fontWeight: 'bold',
        color: voteSummary.score > 0 ? '#4CAF50' : voteSummary.score < 0 ? '#f44336' : '#333'
      }}>
        Score: {voteSummary.score}
      </div>
    </div>
  );
};

export default VotingComponent;