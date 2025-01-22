import { CreatePost } from "@/entities/post/model/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"

interface PostAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newPost: CreatePost
  setNewPost: (post: CreatePost) => void
  addPost: () => void
}

export const PostAddDialog = ({ open, onOpenChange, newPost, setNewPost, addPost }: PostAddDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={addPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}