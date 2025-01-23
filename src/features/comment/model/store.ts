import { commentApi } from "@/entities/comment/api/commentApi"
import { INITIAL_NEW_COMMENT_STATE } from "@/entities/comment/model/constants"
import { Comment, NewComment } from "@/entities/comment/model/types"
import { create } from "zustand"

interface useCommentStoreProps {
  comments: Record<number, Comment[] | []>
  newComment: NewComment
  selectedComment: Comment | undefined

  fetchComments: (postId: number) => void
  addComment: () => void
  updateComment: () => void
  deleteComment: (id: number, postId: number) => void
  likeComment: (id: number, postId: number) => void

  // 임시
  showAddCommentDialog: boolean
  setShowAddCommentDialog: (open: boolean) => void
  showEditCommentDialog: boolean
  setShowEditCommentDialog: (open: boolean) => void
  setNewComment: (updater: (prev: NewComment) => NewComment) => void
  setSelectedComment: (comment: Comment) => void
}

export const useCommentStore = create<useCommentStoreProps>((set, get) => ({
  comments: [],
  newComment: INITIAL_NEW_COMMENT_STATE,
  selectedComment: undefined,

  // 임시
  showAddCommentDialog: false,
  setShowAddCommentDialog: (open) => set({ showAddCommentDialog: open }),
  showEditCommentDialog: false,
  setShowEditCommentDialog: (open) => set({ showEditCommentDialog: open }),
  setNewComment: (updater) =>
    set((state) => ({
      newComment: updater(state.newComment),
    })),
  setSelectedComment: (comment) => set({ selectedComment: comment }),

  // 댓글 가져오기
  fetchComments: async (postId) => {
    const { comments } = get()
    if (comments[postId]) return

    try {
      const data = await commentApi.getComments(postId)
      set({ comments: { ...comments, [postId]: data.comments } })
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  },

  // 댓글 추가
  addComment: async () => {
    try {
      const { comments, newComment } = get()
      const data = await commentApi.addComment(newComment)
      set({ comments: { ...comments, [data.postId]: [...(comments[data.postId] || []), data] } })
      set({ showAddCommentDialog: false })
      set({ newComment: INITIAL_NEW_COMMENT_STATE })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  },

  // 댓글 업데이트
  updateComment: async () => {
    try {
      const { selectedComment, comments } = get()

      if (!selectedComment) {
        throw new Error("선택된 댓글이 없습니다.")
      }

      const data = await commentApi.updateComment(selectedComment.id, { body: selectedComment.body })

      set({
        comments: {
          ...comments,
          [data.postId]: comments[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
        },
      })
      set({ showEditCommentDialog: false })
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  },

  // 댓글 삭제
  deleteComment: async (id, postId) => {
    try {
      const { comments } = get()
      await commentApi.removeComment(id)

      set({ comments: { ...comments, [postId]: comments[postId].filter((comment) => comment.id !== id) } })
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  },

  // 댓글 좋아요
  likeComment: async (id, postId) => {
    try {
      const { comments } = get()

      const matchComment = comments[postId].find((c) => c.id === id)

      if (!matchComment) {
        throw new Error("댓글이 없습니다.")
      }

      const data = await commentApi.likeComment(id, { likes: matchComment.likes + 1 })

      set({
        comments: {
          ...comments,
          [postId]: comments[postId].map((comment) =>
            comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
          ),
        },
      })
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  },
}))