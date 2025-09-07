// FriendList.tsx - 好友列表组件
import React from 'react';
import { ImFriend } from '../../types/friend/ImFriend';

interface FriendListProps {
  friends: ImFriend[];
  onFriendClick?: (friend: ImFriend) => void;
}

const FriendList: React.FC<FriendListProps> = ({ friends, onFriendClick }) => {
  return (
    <div className="friend-list">
      <h2>好友列表</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} onClick={() => onFriendClick?.(friend)}>
            <span>{friend.remark || `用户${friend.friendId}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;