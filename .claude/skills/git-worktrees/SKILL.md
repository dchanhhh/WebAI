---
name: git-worktrees
description: Quy trình dùng git worktree để phát triển nhiều tính năng song song trong repo này — dùng khi cần tạo/dọn worktree cho một tính năng mới.
---

# Git Worktrees Workflow

Khi cần phát triển nhiều tính năng song song:

1. Tạo worktree riêng cho mỗi tính năng: `git worktree add ../[project]-[feature] [feature]`
2. Mỗi worktree là thư mục độc lập — agent chỉ làm việc trong thư mục của mình.
3. Không sửa các file shared trừ khi được yêu cầu rõ ràng.
4. Sau khi xong: merge về `main`, xoá worktree đã dùng (`git worktree remove …`).
