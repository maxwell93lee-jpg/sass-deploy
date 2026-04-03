import { NoteRepositoryPort } from '../../../application/ports/note.repository.port';
import { Note } from '../../entities/note.entity';

export class GetNotesUseCase {
  constructor(private readonly noteRepository: NoteRepositoryPort) {}

  async execute(userId: string): Promise<Note[]> {
    return this.noteRepository.getNotes(userId);
  }
}
