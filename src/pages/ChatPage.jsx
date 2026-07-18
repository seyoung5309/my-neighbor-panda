import { useEffect, useState } from "react";
import "../styles/ChatPage.css";
import { getMyChatRooms } from "../services/chatService";
import { supabase } from "../lib/supabaseClient";

function ChatPage() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    async function loadChatData() {
      try {
        setLoading(true);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setError("로그인이 필요한 서비스입니다.");
          return;
        }

        setCurrentUserId(user.id);

        const { data, error: chatError } = await getMyChatRooms(user.id);

        if (chatError) {
          setError("채팅방을 불러오는 중 오류가 발생했습니다.");
        } else {
          setChatRooms(data || []);
        }
      } catch (err) {
        console.error(err);
        setError("네트워크 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    loadChatData();
  }, []);

  return (
    <div className="chat-page-container">
      <label className="title">채팅</label>
      <hr />

      {loading && <p>채팅방 목록을 불러오는 중...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="chat-room-list">
          {chatRooms.length === 0 ? (
            <p className="empty-message">참여 중인 채팅방이 없습니다.</p>
          ) : (
            chatRooms.map((room, index) => {
              const product = room?.product;
              const itemInfo = product?.item;

              const chatUsers = room?.chat_user || [];
              const otherUser = chatUsers.find(
                (cu) => cu.user_id !== currentUserId
              );

              const partnerNickname =
                otherUser?.profile?.nickname || "알 수 없는 사용자";

              const messages = room?.chat || [];
              let lastMessage = "아직 대화 내용이 없습니다.";

              if (messages.length > 0) {
                const sortedMessages = [...messages].sort(
                  (a, b) =>
                    new Date(b.datetime) - new Date(a.datetime)
                );

                if (sortedMessages[0]?.comment) {
                  lastMessage = sortedMessages[0].comment;
                }
              }

              return (
                <div key={room.id}>
                  <div className="box">
                    <div className="profile-img-wrapper">
                      <div className="avatar">
                        {itemInfo?.img ? (
                          <img
                            src={itemInfo.img}
                            alt={itemInfo.name}
                            className="avatar__image"
                          />
                        ) : (
                          <div className="avatar__fallback" />
                        )}
                      </div>
                    </div>

                    <div className="room-info">
                      <p className="item-name">{partnerNickname}</p>
                      <p className="last-chat-content">{lastMessage}</p>
                    </div>
                  </div>

                  {index !== chatRooms.length - 1 && (
                    <hr className="chat-divider" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default ChatPage;