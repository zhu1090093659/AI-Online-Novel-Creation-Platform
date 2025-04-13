"use client"

import React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteChapterDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  chapterTitle: string
}

export function DeleteChapterDialog({
  isOpen,
  onClose,
  onConfirm,
  chapterTitle,
}: DeleteChapterDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除这个章节吗？</AlertDialogTitle>
          <AlertDialogDescription>
            您即将删除章节 <span className="font-semibold">{chapterTitle}</span>。此操作不可恢复，删除后章节内容将永久丢失。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
