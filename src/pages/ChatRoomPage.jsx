// src/pages/ChatRoomPage.jsx
//
// 채팅방 화면. 실시간 메시지 수신/전송까지 chatService.js와 연동되어 있습니다.

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Send, MessageCircle, Home, Store, User } from 'lucide-react';
import '../styles/ChatRoomPage.css';
import {
  getChatHistory,
  sendMessage,
  subscribeToChatRoom,
  getOtherParticipant,
} from '../services/chatService';
import { supabase } from '../lib/supabaseClient';

export default function ChatRoomPage({ chatroomId, currentUserId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    let channel;

    async function init() {
      const { data: history } = await getChatHistory(chatroomId);
      if (history) setMessages(history);

      const { data: participant } = await getOtherParticipant(
        chatroomId,
        currentUserId
      );
      if (participant) setOtherUser(participant);

      channel = subscribeToChatRoom(chatroomId, (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });
    }

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [chatroomId, currentUserId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput('');
    const { data, error } = await sendMessage(chatroomId, currentUserId, trimmed);
    if (data && !error) {
      setMessages((prev) => [...prev, data]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <div className="chat-room-page">
      <header className="chat-room-header">
        <button
          className="chat-room-back-button"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={22} color="#2B2B2B" />
        </button>
        <div className="chat-room-avatar" />
        <span className="chat-room-title">
          {otherUser?.nickname ?? '상대방 닉네임'}
        </span>
      </header>

      <div className="chat-room-message-list" ref={scrollRef}>
        {messages.map((msg) => {
          const isMine = msg.user_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`chat-bubble-row ${
                isMine ? 'chat-bubble-row--mine' : 'chat-bubble-row--other'
              }`}
            >
              <div
                className={`chat-bubble ${
                  isMine ? 'chat-bubble--mine' : 'chat-bubble--other'
                }`}
              >
                {msg.comment}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-room-input-bar">
        <input
          className="chat-room-input"
          placeholder="메시지를 입력해주세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="chat-room-send-button"
          onClick={handleSend}
          aria-label="전송"
        >
          <Send size={20} color="#2B2B2B" />
        </button>
      </div>

      <nav className="chat-room-bottom-nav">
        <NavItem icon={<MessageCircle size={22} />} label="채팅" active />
        <NavItem icon={<Home size={22} />} label="홈" />
        <NavItem icon={<Store size={22} />} label="마을시장" />
        <NavItem icon={<User size={22} />} label="프로필" />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  const color = active ? '#2B2B2B' : '#B4AFA6';
  return (
    <div className="chat-room-nav-item">
      <div style={{ color }}>{icon}</div>
      <span className="chat-room-nav-label" style={{ color }}>
        {label}
      </span>
    </div>
  );
}