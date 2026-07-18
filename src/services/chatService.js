// src/services/chatService.js
import { supabase } from "../lib/supabaseClient";

/**
 * 내가 참여 중인 채팅방 목록 (상품/아이템 정보 함께 조회)
 */
export async function getMyChatRooms(userId) {
  const { data, error } = await supabase
    .from("chat_user")
    .select(
      `
      chatroom_id,
      chat_room:chatroom_id (
        id,
        created_at,
        product:product_id (
          id,
          mileage,
          pick,
          item:item_id ( name, img )
        )
      )
    `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error("채팅방 목록 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * CT-002: 메시지 전송
 */
export async function sendMessage(chatroomId, userId, comment) {
  const { data, error } = await supabase
    .from("chat")
    .insert({ chatroom_id: chatroomId, user_id: userId, comment })
    .select()
    .single();

  if (error) {
    console.error("메시지 전송 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * CT-003: 채팅 내역 조회 (오래된 순)
 */
export async function getChatHistory(chatroomId) {
  const { data, error } = await supabase
    .from("chat")
    .select("*")
    .eq("chatroom_id", chatroomId)
    .order("datetime", { ascending: true });

  if (error) {
    console.error("채팅 내역 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * CT-002: 실시간 메시지 구독
 * 새 메시지가 저장되는 순간 onMessage 콜백으로 전달합니다.
 *
 * ⚠️ 사전 준비: Supabase 대시보드 > Database > Replication에서
 *    chat 테이블의 Realtime을 켜두셔야 동작합니다.
 *
 * 사용 예:
 *   const channel = subscribeToChatRoom(chatroomId, (msg) => { ... });
 *   // 컴포넌트 unmount 시
 *   supabase.removeChannel(channel);
 */
export function subscribeToChatRoom(chatroomId, onMessage) {
  const channel = supabase
    .channel(`chat-room-${chatroomId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat",
        filter: `chatroom_id=eq.${chatroomId}`,
      },
      (payload) => {
        onMessage(payload.new);
      },
    )
    .subscribe();

  return channel;
}
