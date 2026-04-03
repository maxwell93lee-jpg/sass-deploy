import { Note, CreateNoteInput } from '../../core/entities/note.entity';

export interface NoteRepositoryPort {
  getNotes(userId: string): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | null>;
  createNote(userId: string, data: CreateNoteInput): Promise<Note>;
}
