import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Send, MessageCircle, Home, Store, User } from 'lucide-react';
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

  // 초기 데이터 로드 + 실시간 구독
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

  // 새 메시지 오면 맨 아래로 스크롤
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
    // 실시간 구독으로도 들어오지만, 발신자 화면은 즉시 반영해서 체감 지연 없애기
    if (data && !error) {
      setMessages((prev) => [...prev, data]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <div style={styles.page}>
      {/* 헤더 */}
      <header style={styles.header}>
        <button style={styles.backButton} onClick={onBack} aria-label="뒤로가기">
          <ChevronLeft size={22} color="#2B2B2B" />
        </button>
        <div style={styles.avatar} />
        <span style={styles.headerTitle}>
          {otherUser?.nickname ?? '상대방 닉네임'}
        </span>
      </header>

      {/* 메시지 목록 */}
      <div style={styles.messageList} ref={scrollRef}>
        {messages.map((msg) => {
          const isMine = msg.user_id === currentUserId;
          return (
            <div
              key={msg.id}
              style={{
                ...styles.bubbleRow,
                justifyContent: isMine ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  ...(isMine ? styles.bubbleMine : styles.bubbleOther),
                }}
              >
                {msg.comment}
              </div>
            </div>
          );
        })}
      </div>

      {/* 입력창 */}
      <div style={styles.inputBar}>
        <input
          style={styles.input}
          placeholder="메시지를 입력해주세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button style={styles.sendButton} onClick={handleSend} aria-label="전송">
          <Send size={20} color="#2B2B2B" />
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <nav style={styles.bottomNav}>
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
    <div style={styles.navItem}>
      <div style={{ color }}>{icon}</div>
      <span style={{ ...styles.navLabel, color }}>{label}</span>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: 420,
    margin: '0 auto',
    background: '#FAF8F4',
    fontFamily:
      "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    borderBottom: '1px solid #EDE9E2',
    background: '#FDFCFA',
  },
  backButton: {
    background: 'none',
    border: 'none',
    padding: 4,
    cursor: 'pointer',
    display: 'flex',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: '#C9C2B6',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#2B2B2B',
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  bubbleRow: {
    display: 'flex',
  },
  bubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    fontSize: 14,
    lineHeight: 1.5,
    color: '#2B2B2B',
    wordBreak: 'break-word',
  },
  bubbleOther: {
    background: '#EDE6DA',
    borderRadius: '4px 16px 16px 16px',
  },
  bubbleMine: {
    background: '#F3C34D',
    borderRadius: '16px 4px 16px 16px',
  },
  inputBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    borderTop: '1px solid #EDE9E2',
    background: '#FDFCFA',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 14,
    color: '#2B2B2B',
  },
  sendButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    padding: 4,
  },
  bottomNav: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0 14px',
    borderTop: '1px solid #EDE9E2',
    background: '#FDFCFA',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
  },
};