import { GetNotesUseCase } from '../get-notes.use-case';
import { NoteRepositoryPort } from '../../../../application/ports/note.repository.port';

describe('GetNotesUseCase', () => {
  let mockNoteRepo: jest.Mocked<NoteRepositoryPort>;
  let useCase: GetNotesUseCase;

  beforeEach(() => {
    mockNoteRepo = {
      getNotes: jest.fn(),
      getNoteById: jest.fn(),
      createNote: jest.fn(),
    };
    useCase = new GetNotesUseCase(mockNoteRepo);
  });

  it('should return a list of notes for a user', async () => {
    const userId = 'user-1';
    mockNoteRepo.getNotes.mockResolvedValue([
      { id: '1', title: 'Note 1', content: 'Content', category: '기획', tags: [], createdAt: '2024-01-01' }
    ]);
    
    const result = await useCase.execute(userId);
    expect(result).toHaveLength(1);
    expect(mockNoteRepo.getNotes).toHaveBeenCalledWith(userId);
  });
});
