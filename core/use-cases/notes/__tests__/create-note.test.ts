import { CreateNoteUseCase } from '../create-note.use-case';
import { NoteRepositoryPort } from '../../../../application/ports/note.repository.port';

describe('CreateNoteUseCase', () => {
  let mockNoteRepo: jest.Mocked<NoteRepositoryPort>;
  let useCase: CreateNoteUseCase;

  beforeEach(() => {
    mockNoteRepo = {
      getNotes: jest.fn(),
      getNoteById: jest.fn(),
      createNote: jest.fn(),
    };
    useCase = new CreateNoteUseCase(mockNoteRepo);
  });

  it('should create a new note and return it', async () => {
    const userId = 'user-1';
    const noteData = { title: 'New Note', content: 'Body', category: '기타', tags: ['hi'] };
    
    mockNoteRepo.createNote.mockResolvedValue({
      id: 'note-1',
      ...noteData,
      createdAt: '2024-01-01',
    });
    
    const result = await useCase.execute(userId, noteData);
    expect(result.id).toBe('note-1');
    expect(mockNoteRepo.createNote).toHaveBeenCalledWith(userId, noteData);
  });
});
