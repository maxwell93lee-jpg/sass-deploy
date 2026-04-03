import { NoteRepositoryPort } from '../../../application/ports/note.repository.port';
import { Note, CreateNoteInput } from '../../entities/note.entity';

export class CreateNoteUseCase {
  constructor(private readonly noteRepository: NoteRepositoryPort) {}

  async execute(userId: string, data: CreateNoteInput): Promise<Note> {
    return this.noteRepository.createNote(userId, data);
  }
}
