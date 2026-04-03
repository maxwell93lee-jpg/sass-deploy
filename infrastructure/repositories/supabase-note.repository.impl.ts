import { NoteRepositoryPort } from '../../application/ports/note.repository.port';
import { Note, CreateNoteInput } from '../../core/entities/note.entity';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseNoteRepositoryImpl implements NoteRepositoryPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async getNotes(userId: string): Promise<Note[]> {
    const { data: notes, error } = await this.supabase
      .from('notes')
      .select(`
        id,
        title,
        content,
        category,
        tags,
        created_at,
        note_attachments (
          id, name, file_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (notes || []).map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      category: note.category || '기타',
      tags: note.tags || [],
      createdAt: note.created_at,
      attachments: note.note_attachments?.map((att: any) => ({
        id: att.id,
        name: att.name,
        url: att.file_url,
      })) || [],
    }));
  }

  async getNoteById(id: string): Promise<Note | null> {
    const { data: note, error } = await this.supabase
      .from('notes')
      .select(`
        id,
        title,
        content,
        category,
        tags,
        created_at,
        note_attachments (
          id, name, file_url
        )
      `)
      .eq('id', id)
      .single();

    if (error || !note) {
      return null;
    }

    return {
      id: note.id,
      title: note.title,
      content: note.content,
      category: note.category || '기타',
      tags: note.tags || [],
      createdAt: note.created_at,
      attachments: note.note_attachments?.map((att: any) => ({
        id: att.id,
        name: att.name,
        url: att.file_url,
      })) || [],
    };
  }

  async createNote(userId: string, data: CreateNoteInput): Promise<Note> {
    const { data: note, error } = await this.supabase
      .from('notes')
      .insert({
        user_id: userId,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: note.id,
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags || [],
      createdAt: note.created_at,
      attachments: [],
    };
  }
}
