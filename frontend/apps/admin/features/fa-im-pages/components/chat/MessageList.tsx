// MessageList.tsx - 消息列表组件
import React from 'react';
import { ImMessage } from '../../types/message/ImMessage';

interface MessageListProps {
  messages: ImMessage[];
  currentUserId: number;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <div className="message-list">
      <ul>
        {messages.map((message) => (
          <li 
            key={message.id} 
            className={message.senderId === currentUserId ? 'message-self' : 'message-other'}
          >
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {message.sendTime}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;