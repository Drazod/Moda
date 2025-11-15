# Friends & Chat Feature - Implementation Guide

## Overview
Complete social features for your e-commerce platform allowing users to connect with friends, chat, and share products.

## Features Implemented

### 1. Friends Management
- **Search Users**: Find friends by name or email
- **Send Friend Requests**: Connect with other users
- **Accept/Reject Requests**: Manage incoming friend requests
- **Friends List**: View all your friends
- **Remove Friends**: Unfriend functionality

### 2. Chat System
- **Real-time Messaging**: Text-based conversations
- **Product Sharing**: Share products directly in chat
- **Conversation List**: View all active chats
- **Unread Indicators**: Badge showing unread message count
- **Message History**: Paginated message loading

### 3. Product Sharing
- **Share Button**: On product detail page
- **Friend Selection**: Choose which friend to share with
- **Custom Message**: Add personal note with shared product
- **Product Preview**: Rich product card in chat

---

## Files Created

### Pages (Layouts)
1. **`src/layouts/friendsPage.jsx`** - Friends management page
   - Three tabs: Friends, Requests, Search
   - Search functionality with real-time results
   - Friend request management
   - Direct chat navigation

2. **`src/layouts/chatPage.jsx`** - Messaging interface
   - Conversation list sidebar
   - Message view with real-time updates
   - Message input with send functionality
   - Product message rendering

### Components
3. **`src/components/product/ShareProductButton.jsx`** - Product sharing modal
   - Friend selection interface
   - Custom message input
   - Share confirmation

---

## Routes Added

```javascript
// User routes (require authentication)
<Route path="/friends" element={
  <RequireAuth>
    <FriendsPage />
  </RequireAuth>
} />

<Route path="/chat" element={
  <RequireAuth>
    <ChatPage />
  </RequireAuth>
} />
```

---

## API Endpoints Required

### Friendship Endpoints

#### GET /friendship/search
Search for users to add as friends
```
Query params: { query: string }
Response: [{ id, name, email, friendshipStatus: 'none'|'pending'|'friends' }]
```

#### POST /friendship/request
Send friend request
```
Body: { addresseeId: number }
Response: { message: "Friend request sent" }
```

#### GET /friendship/requests
Get pending friend requests
```
Response: [{ id, requester: { id, name, email }, createdAt }]
```

#### PUT /friendship/accept/:id
Accept friend request
```
Params: { id: friendshipId }
Response: { message: "Friend request accepted" }
```

#### DELETE /friendship/reject/:id
Reject friend request
```
Params: { id: friendshipId }
Response: { message: "Friend request rejected" }
```

#### GET /friendship/friends
Get list of friends
```
Response: [{ id, friend: { id, name, email }, createdAt }]
```

#### DELETE /friendship/remove/:friendshipId
Remove a friend
```
Params: { friendshipId: number }
Response: { message: "Friend removed" }
```

---

### Chat Endpoints

#### GET /chat/conversations
Get all conversations for current user
```
Response: [{
  id,
  friend: { id, name, email },
  lastMessage: { content, createdAt, messageType },
  unreadCount: number
}]
```

#### POST /chat/conversation
Get or create conversation with a friend
```
Body: { friendId: number }
Response: { id, participants: [...], createdAt }
```

#### POST /chat/message
Send a message
```
Body: {
  conversationId: number,
  content?: string,
  messageType: 'TEXT' | 'PRODUCT' | 'IMAGE',
  productId?: number,
  imageUrl?: string
}
Response: { id, conversationId, senderId, content, messageType, createdAt }
```

#### GET /chat/messages/:conversationId
Get messages in a conversation
```
Params: { conversationId: number }
Query: { limit?: number, before?: datetime }
Response: [{ id, content, senderId, sender, messageType, product?, createdAt, isRead }]
```

#### PUT /chat/messages/read/:conversationId
Mark messages as read
```
Params: { conversationId: number }
Response: { message: "Messages marked as read" }
```

#### POST /chat/share-product
Share a product with a friend
```
Body: {
  conversationId: number,
  productId: number,
  message?: string
}
Response: { id, conversationId, senderId, messageType: 'PRODUCT', product, createdAt }
```

---

## UI/UX Features

### Friends Page
- **Tab Navigation**: Switch between Friends, Requests, and Search
- **Search Bar**: Real-time user search with debouncing
- **Friend Cards**: Display name, email, and action buttons
- **Request Badges**: Red notification badge on Requests tab
- **Action Buttons**: 
  - Add Friend (search results)
  - Accept/Reject (pending requests)
  - Message/Remove (friends list)

### Chat Page
- **Split Layout**: Conversations sidebar + message area
- **Conversation Cards**: Friend avatar, name, last message, timestamp
- **Unread Indicators**: Red badge with count
- **Message Bubbles**: Own messages (right, dark) vs received (left, gray)
- **Product Messages**: Rich card with image, name, price, clickable
- **Auto-scroll**: Automatically scroll to latest message
- **Message Input**: Text input with send button
- **Empty States**: Helpful messages when no conversations

### Product Detail Page
- **Share Button**: Below add to cart buttons
- **Share Modal**: 
  - Product preview
  - Friend selection (from existing conversations)
  - Optional custom message
  - Cancel/Share actions

---

## Header Updates

Added navigation icons (visible when logged in):
- **Friends Icon** (`IoPersonAddOutline`): Links to `/friends`
- **Messages Icon** (`IoChatbubbleOutline`): Links to `/chat`

---

## Styling & Design

### Color Scheme
- Primary: `#434237` (dark brown/black)
- Secondary: `#BFAF92` (beige/tan)
- Accent: Blue for messages/actions
- Success: Green for accept actions
- Danger: Red for reject/remove actions

### Responsive Design
- Mobile-friendly layouts
- Scrollable message areas
- Touch-optimized buttons
- Proper spacing on all screen sizes

---

## Usage Flow

### Connecting with Friends

1. **Search for Users**
   ```
   User → /friends → Search tab → Enter name/email → Click Search
   ```

2. **Send Friend Request**
   ```
   Search results → Click "Add Friend" → Request sent toast
   ```

3. **Accept Request** (Friend's perspective)
   ```
   User → /friends → Requests tab (see badge) → Click Accept → Friends list updated
   ```

### Messaging

1. **Start Chat from Friends**
   ```
   User → /friends → Friends tab → Click message icon → Navigate to /chat
   ```

2. **Send Message**
   ```
   /chat → Select conversation → Type message → Click send/press Enter
   ```

3. **View Unread**
   ```
   /chat → Conversations with red badge → Click to open → Auto-mark as read
   ```

### Sharing Products

1. **From Product Page**
   ```
   /product?id=X → Click "Share with Friends" → Select friend → Add message → Share
   ```

2. **Recipient Views**
   ```
   /chat → See product card → Click to open product page
   ```

---

## Backend Requirements

### Database Models

**Friendship Model**
```javascript
{
  id: number,
  requesterId: number,
  addresseeId: number,
  status: 'pending' | 'accepted' | 'rejected',
  createdAt: datetime,
  updatedAt: datetime
}
```

**Conversation Model**
```javascript
{
  id: number,
  participants: [userId1, userId2],
  createdAt: datetime,
  updatedAt: datetime
}
```

**Message Model**
```javascript
{
  id: number,
  conversationId: number,
  senderId: number,
  content: string (optional),
  messageType: 'TEXT' | 'PRODUCT' | 'IMAGE',
  productId: number (optional),
  imageUrl: string (optional),
  isRead: boolean,
  createdAt: datetime
}
```

### Business Logic

1. **Friendship Rules**
   - Can't send request to self
   - Can't send duplicate requests
   - Both users must accept to become friends
   - Either user can remove friendship

2. **Conversation Rules**
   - Auto-create conversation when first message sent
   - Only friends can message each other
   - Conversations are 1-to-1 only

3. **Message Rules**
   - Must be part of conversation to send/read
   - Product messages must reference valid product
   - Mark as read when conversation opened

---

## Testing Checklist

### Friends Feature
- [ ] Search returns correct users
- [ ] Can send friend request
- [ ] Request appears in recipient's pending list
- [ ] Can accept request
- [ ] Accepted friends appear in Friends list
- [ ] Can reject request
- [ ] Can remove friend
- [ ] Friendship status updates correctly in search results

### Chat Feature
- [ ] Conversation list shows all chats
- [ ] Unread count displays correctly
- [ ] Can send text message
- [ ] Messages display in correct order
- [ ] Own messages on right, received on left
- [ ] Mark as read works
- [ ] Unread badge updates
- [ ] Product messages display with image

### Product Sharing
- [ ] Share button visible on product page
- [ ] Modal shows existing conversations
- [ ] Can select friend
- [ ] Can add custom message
- [ ] Product shares successfully
- [ ] Recipient sees product in chat
- [ ] Click product navigates to product page

---

## Troubleshooting

### Common Issues

**1. "No friends found" in share modal**
- Ensure user has accepted friend requests
- Check `/friendship/friends` endpoint returns data

**2. Messages not appearing**
- Verify `/chat/messages/:id` endpoint works
- Check authentication headers
- Ensure conversationId is valid

**3. Unread count not updating**
- Call `/chat/messages/read/:id` when opening conversation
- Refresh conversations list after marking read

**4. Friend request not sending**
- Ensure addresseeId is valid user
- Check user is not already friends
- Verify no pending request exists

---

## Future Enhancements

### Planned Features
1. **Real-time Updates**: WebSocket for instant messaging
2. **Image Sharing**: Upload and send images
3. **Group Chats**: Multiple participants
4. **Read Receipts**: Show when friend read message
5. **Typing Indicators**: "Friend is typing..."
6. **Message Reactions**: Like, love, etc.
7. **Online Status**: Show who's online
8. **Message Search**: Search within conversations
9. **Block Users**: Privacy controls
10. **Notifications**: Push notifications for new messages

### Technical Improvements
1. **Lazy Loading**: Infinite scroll for messages
2. **Caching**: Store conversations locally
3. **Optimistic Updates**: Show message immediately
4. **Error Handling**: Retry failed messages
5. **File Upload**: Handle image uploads
6. **Message Deletion**: Delete/edit messages
7. **Conversation Archiving**: Hide old chats
8. **Mute Conversations**: Disable notifications

---

## Security Considerations

1. **Authentication**: All endpoints require valid JWT
2. **Authorization**: Users can only see own conversations
3. **Friend Validation**: Verify friendship before allowing messages
4. **Input Sanitization**: Clean message content
5. **Rate Limiting**: Prevent spam messaging
6. **CSRF Protection**: Use CSRF tokens
7. **XSS Prevention**: Escape message content
8. **SQL Injection**: Use parameterized queries

---

## Performance Optimization

1. **Pagination**: Load messages in batches (50 at a time)
2. **Caching**: Cache conversation list
3. **Debouncing**: Search input with 300ms debounce
4. **Lazy Loading**: Load conversations on demand
5. **Image Optimization**: Compress shared product images
6. **Database Indexing**: Index conversationId, senderId
7. **Query Optimization**: Join tables efficiently

---

## Accessibility

1. **Keyboard Navigation**: Tab through conversations
2. **Screen Readers**: ARIA labels on buttons
3. **Color Contrast**: Meet WCAG standards
4. **Focus Indicators**: Visible focus states
5. **Alt Text**: Images have descriptive alt text

---

**Implementation Status**: ✅ Frontend Complete  
**Backend Integration**: Pending  
**Testing**: Pending  
**Version**: 1.0.0  
**Last Updated**: November 14, 2025
