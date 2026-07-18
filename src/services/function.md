# 서비스 함수 레퍼런스

이웃 판다(Village App) 프로젝트의 `src/services/` 함수를 요구사항 ID 기준으로 정리한 문서입니다.
SQL(`rls_products_additions.sql`, `pick_and_chat_setup.sql`, `storage_setup.sql`)은 DB 권한/RLS 설정이라 이 문서 범위에서 제외했습니다.

---

## authService.js — 회원 관리 (MM)

| 함수                               | 요구사항 | 설명                                                                                                                                      |
| ---------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `signUpWithEmail(email, password)` | MM-001   | 이메일/비밀번호 회원가입. 성공 시 DB 트리거(`handle_new_user`)가 자동으로 `profile` row 생성                                              |
| `signInWithEmail(email, password)` | MM-004   | 이메일/비밀번호 로그인                                                                                                                    |
| `signInWithOAuth(provider)`        | MM-002   | 구글 로그인 (카카오는 Supabase 대시보드에서 Custom OAuth 설정 후 `provider`로 전달)                                                       |
| `signInWithNaver()`                | MM-002   | 네이버 로그인 (Supabase 기본 미지원이라 OAuth 페이지로 직접 리다이렉트하는 방식)                                                          |
| `signOut()`                        | MM-004   | 로그아웃                                                                                                                                  |
| `getCurrentUser()`                 | 공통     | 현재 로그인한 유저 조회 (다른 서비스 함수들의 전제조건으로 사용)                                                                          |
| `onAuthStateChange(callback)`      | 공통     | 로그인/로그아웃/토큰 갱신 등 인증 상태 변화 구독                                                                                          |
| `isNicknameAvailable(nickname)`    | MM-003   | 닉네임 중복 여부 확인                                                                                                                     |
| `setNickname(userId, nickname)`    | MM-003   | 닉네임 저장 (UNIQUE 충돌 시 "이미 사용 중" 에러로 안내)                                                                                   |
| `deleteAccount(userId)`            | MM-007   | 회원 탈퇴 — `profile.deleted_at` 기록 + 닉네임 익명화하는 소프트 삭제 방식 (auth.users 완전 삭제는 Edge Function 필요, MVP 범위에서 제외) |

---

## characterService.js — 캐릭터 커스터마이징 (CH)

| 함수                                               | 요구사항               | 설명                                                                   |
| -------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------- |
| `setCharacter(userId, { gender, color1, color2 })` | CH-001, CH-002, CH-003 | 캐릭터 생성/수정 겸용 (upsert). CH-003(수정)도 이 함수를 그대로 재사용 |
| `getCharacter(userId)`                             | 공통                   | 캐릭터 조회                                                            |

---

## locationService.js — 지역 설정 (MM) / 마을 자동 매칭·생성 (VL)

| 함수                                 | 요구사항               | 설명                                                      |
| ------------------------------------ | ---------------------- | --------------------------------------------------------- |
| `setLocation(userId, addressFields)` | MM-005, VL-001, VL-002 | 주소 저장 + region_key로 마을 자동 매칭, 없으면 신규 생성 |
| `overrideVillage(userId, villageId)` | MM-006                 | 자동 매칭된 마을 대신 다른 마을을 직접 선택               |
| `searchVillages(keyword)`            | MM-006 지원            | MM-006에서 사용자가 고를 마을 목록 검색                   |
| `getMyLocation(userId)`              | 공통                   | 내 위치/마을 정보 조회                                    |

내부 헬퍼(미노출): `generateRegionKey()`, `findOrCreateVillage()`

---

## itemService.js — 식자재(냉장고) 관리 (IT)

| 함수                                              | 요구사항               | 설명                                                             |
| ------------------------------------------------- | ---------------------- | ---------------------------------------------------------------- |
| `uploadItemImage(userId, file)`                   | IT-001                 | 식자재 사진 업로드 (userId별 폴더 구조)                          |
| `registerItem(userId, fields, minorCategoryName)` | IT-001, IT-002, IT-003 | 식자재 등록 (이름/수량/보관방법/구매일/소비기한) + 카테고리 연결 |
| `getMyItems(userId)`                              | IT-004                 | 보관함 조회 (연결된 카테고리 이름 포함, 소비기한 임박순 정렬)    |
| `updateItem(itemId, fields)`                      | IT-006                 | 식자재 정보 부분 수정                                            |
| `deleteItem(itemId)`                              | IT-006                 | 식자재 삭제                                                      |
| `getExpiringItems(userId, daysThreshold=3)`       | IT-005                 | 소비기한 임박 항목 조회 (실제 푸시 발송은 별도 구현 필요)        |

---

## categoryService.js — 카테고리 분류 (IT-003)

| 함수                                              | 요구사항    | 설명                                                                                   |
| ------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| `assignCategoryToItem(itemId, minorCategoryName)` | IT-003      | 아이템에 소분류 카테고리를 연결. `categoryMap.js`의 매핑으로 대분류도 함께 자동 연결됨 |
| `getCategoriesByItem(itemId)`                     | IT-003 지원 | 특정 아이템에 연결된 카테고리 목록 조회 (대분류+소분류)                                |

내부 헬퍼(미노출): `findOrCreateCategory(name)` — 카테고리 이름으로 조회, 없으면 생성 (UNIQUE 충돌 시 재조회로 대응)

> 참고: `getMajorCategory()`가 정의된 `src/constants/categoryMap.js`(소분류→대분류 매핑표)는 아직 내용을 못 봤습니다.

---

## storeService.js — 상점 관리 (ST)

| 함수                                                       | 요구사항            | 설명                                                                                               |
| ---------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| `listItemForSale(userId, itemId, quantityToList, mileage)` | ST-001, ST-002      | 상품 등록. 전체 수량 진열 시 기존 아이템 그대로 연결, 부분 수량이면 새 아이템 행으로 분리해서 연결 |
| `cancelListing(productId)`                                 | ST-004              | 진열 취소 (보관함으로 되돌리기). '대기중' 상태만 취소 가능                                         |
| `getMyListings(userId)`                                    | 공통                | 내가 진열한 상품 목록 (상점 관리 화면용)                                                           |
| `getStoreProducts(storeOwnerUserId)`                       | ST-003 지원, VL-004 | 특정 사용자 상점의 '대기중' 상품 목록. villageService의 `visitStore()`가 재사용                    |
| `getProductDetail(productId)`                              | ST-003              | 상품 상세 조회 (사진, 구매일, 소비기한, 수량, 보관상태)                                            |

---

## storeGrowthService.js — 상점 성장 확인 (ST) / 성장 시스템 (GR)

| 함수                                    | 요구사항       | 설명                                                                                                       |
| --------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------- |
| `getStoreLevel(userId)`                 | ST-005         | 완료된 거래 횟수 기준으로 현재 상점 레벨 계산 (별도 Store 테이블 없이 실시간 계산)                         |
| `checkAndUpdateLevel(userId)`           | GR-001, GR-002 | 순환 횟수 재계산 → `Profile.level`보다 높으면 갱신. `pickService.completeTrade()`가 거래 완료 시 자동 호출 |
| `subscribeToLevelUp(userId, onLevelUp)` | GR-003         | `profile.level` 변경을 Realtime으로 감지해 레벨업 콜백 호출 (Notifications 테이블 없어 대체)               |

---

## pickService.js — PICK 시스템 (PK)

| 함수                                   | 요구사항                               | 설명                                                                                |
| -------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------- |
| `pickProduct(productId, buyerId)`      | PK-001, PK-004                         | 상품 PICK. `.eq('pick','대기중')` 조건으로 동시 PICK 경쟁상태 방지                  |
| `acceptPick(productId)`                | PK-003, PK-004, CT-001                 | PICK 수락. DB 함수 `accept_pick()` 호출해 판매자 확인+채팅방 생성을 원자적으로 처리 |
| `rejectPick(productId)`                | PK-003, PK-004                         | PICK 거절. 상품을 '대기중'으로 되돌림                                               |
| `completeTrade(productId)`             | PK-004, PK-005 (+ GR-001, GR-002 연동) | 거래 완료 처리. 완료 직후 판매자 기준 `checkAndUpdateLevel()` 자동 호출             |
| `getPendingPicksOnMyItems(userId)`     | 공통                                   | 내 상품에 들어온 PICK 요청 목록 조회                                                |
| `subscribeToMyPicks(userId, onPicked)` | PK-002                                 | '대기중'→'거래 신청중' 전환을 Realtime으로 감지해 알림 콜백 호출                    |

---

## chatService.js — 채팅 (CT)

| 함수                                         | 요구사항 | 설명                                               |
| -------------------------------------------- | -------- | -------------------------------------------------- |
| `getMyChatRooms(userId)`                     | 공통     | 내가 참여 중인 채팅방 목록 (상품/아이템 정보 포함) |
| `sendMessage(chatroomId, userId, comment)`   | CT-002   | 메시지 전송                                        |
| `getChatHistory(chatroomId)`                 | CT-003   | 채팅 내역 조회 (오래된 순)                         |
| `subscribeToChatRoom(chatroomId, onMessage)` | CT-002   | 새 메시지 Realtime 구독                            |

> 채팅방 자체 생성(CT-001)은 별도 함수 없이 `pickService.acceptPick()` → DB 함수 `accept_pick()`이 처리합니다.

---

## villageService.js — 마을 관리 (VL)

| 함수                                          | 요구사항    | 설명                                                            |
| --------------------------------------------- | ----------- | --------------------------------------------------------------- |
| `enterVillage(userId)`                        | VL-003      | 내 마을 정보 + 같은 마을 멤버 목록 조회                         |
| `getVillageMembers(regionKey, excludeUserId)` | VL-003 지원 | 같은 region_key(마을)에 속한 다른 사용자 목록 (본인 제외)       |
| `visitStore(storeOwnerUserId)`                | VL-004      | 다른 사용자 상점 방문. `storeService.getStoreProducts()` 재사용 |

---

## 요구사항 ID ↔ 함수 매핑 요약

| ID     | 요구사항             | 담당 함수                                                              |
| ------ | -------------------- | ---------------------------------------------------------------------- |
| MM-001 | 회원가입             | `authService.signUpWithEmail`                                          |
| MM-002 | 소셜 로그인          | `authService.signInWithOAuth`, `signInWithNaver`                       |
| MM-003 | 닉네임 설정/중복확인 | `authService.isNicknameAvailable`, `setNickname`                       |
| MM-004 | 로그인/로그아웃      | `authService.signInWithEmail`, `signOut`                               |
| MM-005 | 지역 설정            | `locationService.setLocation`                                          |
| MM-006 | 지역 수동 변경       | `locationService.overrideVillage`, `searchVillages`                    |
| MM-007 | 회원 탈퇴            | `authService.deleteAccount`                                            |
| CH-001 | 캐릭터 생성(성별)    | `characterService.setCharacter`                                        |
| CH-002 | 색상 커스터마이징    | `characterService.setCharacter`                                        |
| CH-003 | 캐릭터 수정          | `characterService.setCharacter`                                        |
| IT-001 | 식자재 등록          | `itemService.uploadItemImage`, `registerItem`                          |
| IT-002 | 식자재 정보 입력     | `itemService.registerItem`                                             |
| IT-003 | 카테고리 분류        | `itemService.registerItem` → `categoryService.assignCategoryToItem`    |
| IT-004 | 보관함 조회          | `itemService.getMyItems`                                               |
| IT-005 | 소비기한 임박 알림   | `itemService.getExpiringItems`                                         |
| IT-006 | 식자재 수정/삭제     | `itemService.updateItem`, `deleteItem`                                 |
| ST-001 | 상품 등록            | `storeService.listItemForSale`                                         |
| ST-002 | 가격 설정            | `storeService.listItemForSale`                                         |
| ST-003 | 상품 상세 조회       | `storeService.getProductDetail`                                        |
| ST-004 | 상품 취소/재진열     | `storeService.cancelListing`                                           |
| ST-005 | 상점 성장 확인       | `storeGrowthService.getStoreLevel`                                     |
| ST-006 | 인테리어/간판 꾸미기 | 미구현 (MVP 범위 제외, Store 테이블 부재)                              |
| VL-001 | 마을 자동 매칭       | `locationService.setLocation`                                          |
| VL-002 | 마을 신규 생성       | `locationService.setLocation`                                          |
| VL-003 | 마을 입장            | `villageService.enterVillage`, `getVillageMembers`                     |
| VL-004 | 상점 방문            | `villageService.visitStore`                                            |
| PK-001 | 상품 PICK            | `pickService.pickProduct`                                              |
| PK-002 | PICK 알림            | `pickService.subscribeToMyPicks`                                       |
| PK-003 | PICK 수락/거절       | `pickService.acceptPick`, `rejectPick`                                 |
| PK-004 | 상품 상태 변경       | `pickService.pickProduct`, `acceptPick`, `rejectPick`, `completeTrade` |
| PK-005 | 거래 완료 처리       | `pickService.completeTrade`                                            |
| CT-001 | 채팅방 자동 생성     | `pickService.acceptPick` → DB 함수 `accept_pick()`                     |
| CT-002 | 실시간 메시지 전송   | `chatService.sendMessage`, `subscribeToChatRoom`                       |
| CT-003 | 채팅 내역 조회       | `chatService.getChatHistory`                                           |
| GR-001 | 성장 포인트 적립     | `storeGrowthService.checkAndUpdateLevel` (거래 완료 시 자동 호출)      |
| GR-002 | 레벨업               | `storeGrowthService.checkAndUpdateLevel`                               |
| GR-003 | 레벨업 알림          | `storeGrowthService.subscribeToLevelUp`                                |
