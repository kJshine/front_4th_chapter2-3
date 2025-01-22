import { NewComment } from "@/entities/comment/model/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared/ui"

interface CommentAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newComment: NewComment
  setNewComment: (comment: NewComment) => void
  addComment: () => void
}

export const CommentAddDialog = ({
  open,
  onOpenChange,
  newComment,
  setNewComment,
  addComment,
}: CommentAddDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>0
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={addComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}