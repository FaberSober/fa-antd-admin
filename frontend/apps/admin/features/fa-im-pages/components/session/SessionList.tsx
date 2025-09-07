// SessionList.tsx - 会话列表组件
import React from 'react';
import { ImChatSession } from '../../types/session/ImChatSession';

interface SessionListProps {
  sessions: ImChatSession[];
  onSessionClick?: (session: ImChatSession) => void;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, onSessionClick }) => {
  return (
    <div className="session-list">
      <h2>会话列表</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id} onClick={() => onSessionClick?.(session)}>
            <div>
              <span>{session.sessionName}</span>
              <span>{session.lastMessageContent}</span>
            </div>
            {session.unreadCount > 0 && (
              <span className="unread-count">{session.unreadCount}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;