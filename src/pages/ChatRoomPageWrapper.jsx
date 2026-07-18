// src/pages/ChatRoomPageWrapper.jsx
//
// 라우터의 URL 파라미터(:chatroomId)를 ChatRoomPage가 필요로 하는
// props(chatroomId, currentUserId)로 변환해주는 래퍼입니다.

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ChatRoomPage from './ChatRoomPage';

export default function ChatRoomPageWrapper() {
  const { chatroomId } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    }
    loadUser();
  }, []);

  if (!currentUserId) return null; // 또는 로딩 스피너

  return (
    <ChatRoomPage
      chatroomId={Number(chatroomId)}
      currentUserId={currentUserId}
      onBack={() => navigate('/chat')}
    />
  );
}