import React, { memo, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useComments } from '../../hooks/userComment/useComments';
import { useLiveComments } from '../../library/commentsLive';
import { CommentCountBadge } from './CommentCountBadge';
import { MaterialCommunityIcons as Ionicons } from '@expo/vector-icons';
import { useAuthUserStore } from '../../library/authUserStore';

// Inline ReplyBox
function ReplyBox({ isVisible, replyDraft, setReplyDraft, handleReply, scrollViewRef, onFocus }) {
  if (!isVisible) return null;
  return (
    <View style={replyBoxStyles.replyBox}>
      <TextInput
        style={replyBoxStyles.input}
        placeholder="Write a reply…"
        value={replyDraft}
        onChangeText={setReplyDraft}
        multiline
        onFocus={onFocus}
      />
      <TouchableOpacity
        style={replyBoxStyles.buttonB}
        onPress={handleReply}
        disabled={!replyDraft.trim()}
      >
        <Text style={replyBoxStyles.buttonText}>Reply</Text>
      </TouchableOpacity>
    </View>
  );
}

const replyBoxStyles = StyleSheet.create({
  replyBox: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 8,
  },
  input: {
    minHeight: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  buttonB: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});


// Inline CommentInput
const CommentInput = ({
  onSubmit,
  posting,
  storyScrollViewRef,
  story,
  reload
}) => {
  const [text, setText] = useState('');
  const hasReloadedRef = useRef(false);

  useEffect(() => {
    if (story?._id && !hasReloadedRef.current) {
      reload && reload();
      hasReloadedRef.current = true;
    }
  }, [story?._id, reload]);

  const handleSubmitComment = () => {
    const submittedText = text.trim();
    if (submittedText) {
      onSubmit(submittedText);
      setText('');
      Keyboard.dismiss();
      setTimeout(() => {
        storyScrollViewRef?.current?.scrollToEnd({ animated: true });
      }, 250);
    }
  };

  return (
    <View style={{ width: '100%' }}>
      <View style={commentInputStyles.footer}>
        <TextInput
          style={commentInputStyles.input}
          placeholder="Write a comment…"
          value={text}
          onChangeText={setText}
          multiline
          returnKeyType="send"
          accessibilityLabel="Comment input"
        />
        <TouchableOpacity
          style={[commentInputStyles.button, (!text || posting) && commentInputStyles.buttonDisabled]}
          onPress={handleSubmitComment}
          disabled={!text || posting}
          accessibilityLabel={posting ? "Sending comment" : "Send comment"}
        >
          <Text style={commentInputStyles.buttonText}>
            {posting ? 'Sending…' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const commentInputStyles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFD000',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

// Thread connector
const ConnectorLine = ({ depth }) =>
  depth > 0 ? <View style={[styles.threadLine, { left: (depth * 20) - 10 }]} /> : null;

// === CommentItem ===
const CommentItem = memo((props) => {
  const {
    storyId,
    comment,
    edit,
    remove,
    replyTo,
    storyScrollViewRef,
    depth = 0,
    activeReplyId,
    setActiveReplyId,
    activeEditId,
    setActiveEditId,
    currentUserId: userIdProp,
  } = props;

  const { likeOne, dislikeOne } = useComments(storyId);
  const [editDraft, setEditDraft] = useState(comment.text || '');
  const [replyDraft, setReplyDraft] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Auth info
  const { user } = useAuthUserStore.getState();
  const currentUserId = userIdProp || user?.id || user?._id || user?.userId || null;
  const replyCount = comment.children?.length || 0;
  const isReplying = activeReplyId === comment._id;
  const isEditing = activeEditId === comment._id;

  // Like/dislike derived from current user
  const likedByUser = Array.isArray(comment.likedBy)
    ? comment.likedBy.includes(currentUserId)
    : !!comment.likedByUser;
  const dislikedByUser =
    Array.isArray(comment.dislikedBy) && comment.dislikedBy.length > 0
      ? comment.dislikedBy.includes(currentUserId)
      : !!comment.dislikedByUser;

  // Handlers
  const handleEditPress = useCallback(() => {
    setActiveEditId(comment._id);
    setActiveReplyId(null);
    setEditDraft(comment.text || '');
  }, [comment._id, comment.text, setActiveEditId, setActiveReplyId]);

  const handleEdit = useCallback(() => {
    if (!editDraft.trim()) return;
    edit(comment._id, editDraft.trim());
    setActiveEditId(null);
  }, [editDraft, edit, comment._id, setActiveEditId]);

  const handleReply = useCallback(async () => {
    if (!replyDraft.trim()) return;
    await replyTo(comment._id, replyDraft.trim());
    setReplyDraft('');
    setActiveReplyId(null);
  }, [replyDraft, replyTo, comment._id, setActiveReplyId]);

  const handleReplyPress = useCallback(() => {
    setActiveReplyId(comment._id);
    setActiveEditId(null);
  }, [comment._id, setActiveReplyId, setActiveEditId]);

  const handleDelete = useCallback(() => {
    Alert.alert('Delete Comment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => remove(comment._id) },
    ]);
  }, [remove, comment._id]);

  const onLike = useCallback(() => likeOne(comment._id), [likeOne, comment._id]);
  const onDislike = useCallback(() => dislikeOne(comment._id), [dislikeOne, comment._id]);
  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

  if (comment.deletedAt) return null;

  // Actions block
  const Actions = () => (
    <View style={styles.actions}>
      <TouchableOpacity onPress={handleReplyPress}>
        <Text style={styles.actionText}>Reply</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleEditPress}>
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
      <View style={styles.actionsB}>
        <View style={styles.likesContainer}>
          <TouchableOpacity onPress={onLike} style={styles.likeButton}>
            <Ionicons
              name={likedByUser ? 'heart' : 'heart-outline'}
              size={18}
              color={likedByUser ? '#ff4d4d' : '#888'}
            />
          </TouchableOpacity>
          <Text style={styles.likesCount}>{comment.likesCount || 0}</Text>
        </View>
        {comment.userId === currentUserId ? (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-can" size={18} color="#656464ff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onDislike} style={styles.dislikeContainer}>
            <Ionicons
              name={dislikedByUser ? "thumb-down" : "thumb-down-outline"}
              size={18}
              color={dislikedByUser ? '#ff8800ff' : '#888'}
            />
            <Text style={styles.likesCount}>{comment.dislikesCount || 0}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flexDirection: 'row' }}>
      <ConnectorLine depth={depth} />
      <View style={{ flex: 1, paddingLeft: depth * 20, marginBottom: 2 }}>
        <View style={[styles.commentContainer, comment.parentId && styles.replyContainer]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.author}>{comment.username || 'Anonymous'}</Text>
          </View>
          {!isEditing ? (
            <Text style={styles.text}>{comment.text}</Text>
          ) : (
            <TextInput
              style={styles.input}
              value={editDraft}
              onChangeText={setEditDraft}
              multiline
            />
          )}
          <Actions />
          {replyCount > 0 && (
            <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#888"
              />
              <Text style={{ color: '#888' }}>
                {isExpanded ? 'Hide' : 'View'} {replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}
              </Text>
            </TouchableOpacity>
          )}
          {isEditing && (
            <TouchableOpacity
              style={[
                styles.saveButton,
                !editDraft.trim() && styles.saveButtonDisabled
              ]}
              onPress={handleEdit}
              disabled={!editDraft.trim()}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
          <ReplyBox
            isVisible={isReplying}
            replyDraft={replyDraft}
            setReplyDraft={setReplyDraft}
            handleReply={handleReply}
            scrollViewRef={storyScrollViewRef}
            onFocus={() => {
              storyScrollViewRef?.current?.scrollToEnd({ animated: true });
            }}
          />
        </View>
        {isExpanded && comment.children?.length > 0 && (
          <View>
            {comment.children.map((child) => (
              <CommentItem
                key={child._id}
                storyId={storyId}
                comment={child}
                edit={edit}
                remove={remove}
                replyTo={replyTo}
                storyScrollViewRef={storyScrollViewRef}
                depth={depth + 1}
                activeReplyId={activeReplyId}
                setActiveReplyId={setActiveReplyId}
                activeEditId={activeEditId}
                setActiveEditId={setActiveEditId}
                currentUserId={currentUserId}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
});
CommentItem.displayName = 'CommentItem';

// === Comments List ===
export function Comments({
  storyId,
  storyScrollViewRef,
  activeReplyId,
  setActiveReplyId,
  activeEditId,
  setActiveEditId,
  currentUserId,
}) {
  const { commentsTree, replyTo, edit, remove, reload } = useComments(storyId);
  useLiveComments(storyId);
  const [showAllComments, setShowAllComments] = useState(false);

  // Memoize callbacks/props
  const handleEdit = useCallback(edit, [edit]);
  const handleRemove = useCallback(remove, [remove]);
  const handleReplyTo = useCallback(replyTo, [replyTo]);
  const displayedComments = useMemo(
    () => (showAllComments ? commentsTree : commentsTree.slice(0, 10)),
    [showAllComments, commentsTree]
  );

  // Memoized FlatList renderItem
  const renderCommentItem = useCallback(
    ({ item }) => (
      <CommentItem
        key={item._id}
        storyId={storyId}
        comment={item}
        edit={handleEdit}
        remove={handleRemove}
        replyTo={handleReplyTo}
        storyScrollViewRef={storyScrollViewRef}
        depth={0}
        activeReplyId={activeReplyId}
        setActiveReplyId={setActiveReplyId}
        activeEditId={activeEditId}
        setActiveEditId={setActiveEditId}
        currentUserId={currentUserId}
      />
    ),
    [
      storyId,
      handleEdit,
      handleRemove,
      handleReplyTo,
      storyScrollViewRef,
      activeReplyId,
      setActiveReplyId,
      activeEditId,
      setActiveEditId,
      currentUserId
    ]
  );

  // Render the comment input at the bottom
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setActiveReplyId(null);
        setActiveEditId(null);
      }}
      accessible={false}
    >
      <View style={styles.commentsRoot}>
        <CommentCountBadge storyId={storyId} />
        <FlatList
          data={displayedComments}
          renderItem={renderCommentItem}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={10}
          maxToRenderPerBatch={15}
          windowSize={10}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => ({ length: 80, offset: 80 * index, index })}
        />
        {commentsTree.length > 10 && (
          <TouchableOpacity
            onPress={() => setShowAllComments((prev) => !prev)}
            style={styles.loadMoreButton}
          >
            <Text style={styles.loadMoreButtonText}>
              {showAllComments ? 'Show less' : 'Show more comments'}
            </Text>
          </TouchableOpacity>
        )}
        {/* Comment input at the bottom */}
        <CommentInput
          onSubmit={(text) => {
            replyTo(null, text); // top-level comment
            reload && reload();
          }}
          posting={false}
          storyScrollViewRef={storyScrollViewRef}
          story={{ _id: storyId }}
          reload={reload}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  threadLine: {
    width: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 10,
  },
  container: { flexGrow: 1, padding: 0, paddingBottom: 0, height: '90%', margin: -8, marginBottom: -90 },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#c6c6c7ff',
    backgroundColor: '#fff',
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  lastConnector: { height: 0 },
  replyContainer: {
    marginLeft: 11,
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    paddingLeft: 10,
    paddingVertical: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  actionText: { color: '#007bff', marginRight: 12, fontSize: 14 },
  author: { fontWeight: 'bold', color: '#028891ff' },
  text: { marginTop: 4, color: '#000', fontSize: 18, fontFamily: 'Times New Roman' },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  actionsB: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 'auto',
    gap: 20,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex',
    justifyContent: 'center'
  },
  saveButtonDisabled: { backgroundColor: '#999' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  replyBox: { marginTop: 6 },
  replyIcon: { marginRight: 6, color: '#888' },
  info: { color: '#777', marginVertical: 10 },
  error: { color: 'red', marginBottom: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginRight: 8 },
  button: { backgroundColor: '#FFD000', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  buttonB: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { fontWeight: 'bold' },
  loadMoreButton: { paddingVertical: 10, alignItems: 'center', marginTop: 10 },
  loadMoreButtonText: { color: '#888', fontWeight: 'bold' },
  commentsRoot: { flex: 1, padding: 0, margin: 0, backgroundColor: '#f5f5f5' },
  likesContainer: { 
    flexDirection: "column", alignItems: "center",
  },
  likesCount: { marginTop: 2, color: '#444', fontSize: 12   },
  dislikeContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  expandButton: { flexDirection: "row", alignItems: "center", marginTop: 8, marginRight: 6 },
});