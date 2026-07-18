// src/services/chatService.js
import { supabase } from "../lib/supabaseClient";

/**
 * 내가 참여 중인 채팅방 목록 (상품/아이템 정보 함께 조회)
 */
export async function getMyChatRooms(userId) {
  // 1. 내가 참여하고 있는 chatroom_id 목록을 가져옵니다.
  const { data: myRooms, error: roomError } = await supabase
    .from("chat_user")
    .select("chatroom_id")
    .eq("user_id", userId);

  if (roomError) {
    console.error("내 채팅방 목록 조회 실패:", roomError.message);
    return { data: null, error: roomError };
  }

  // 참여중인 방이 없다면 빈 배열 반환
  if (!myRooms || myRooms.length === 0) {
    return { data: [], error: null };
  }

  const myRoomIds = myRooms.map((r) => r.chatroom_id);

  // 2. 그 chatroom_id들에 속한 '모든' 유저와 방 정보를 다시 조회합니다.
  // 이렇게 해야 내 ID가 아닌 상대방 ID 정보(2명)가 온전히 묶여서 내려옵니다.
  const { data, error } = await supabase
    .from("chat_room")
    .select(
      `
      id,
      created_at,
      product:product_id (
        id,
        mileage,
        pick,
        item:item_id ( name, img )
      ),
      chat (
        comment,
        datetime
      ),
      chat_user (
        user_id,
        profile ( nickname )
      )
    `,
    )
    .in("id", myRoomIds); // 내가 속한 방 ID 배열로 필터링

  if (error) {
    console.error("채팅방 상세 데이터 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * 채팅방 헤더에 표시할 "상대방" 정보 조회
 * (나를 제외한 나머지 참여자)
 */
export async function getOtherParticipant(chatroomId, currentUserId) {
  const { data, error } = await supabase
    .from("chat_user")
    .select(
      `
      user_id,
      profile ( nickname )
    `,
    )
    .eq("chatroom_id", chatroomId);

  if (error) {
    console.error("상대방 조회 실패:", error.message);
    return { data: null, error };
  }

  const other = data.find((user) => user.user_id !== currentUserId);

  return {
    data: other?.profile ?? null,
    error: null,
  };
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
