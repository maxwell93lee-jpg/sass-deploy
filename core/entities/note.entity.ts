export interface NoteAttachment {
  id: string;
  name: string;
  url: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  attachments?: NoteAttachment[];
}

export type CreateNoteInput = Omit<Note, 'id' | 'createdAt' | 'attachments'>;
