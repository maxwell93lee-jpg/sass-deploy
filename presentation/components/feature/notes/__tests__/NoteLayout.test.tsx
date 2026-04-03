import React from 'react';
import { render, screen } from '@testing-library/react';
import NoteLayout from '../NoteLayout';
import { Note } from '../../../../../core/entities/note.entity';

describe('NoteLayout', () => {
  const mockNotes: Note[] = [
    {
      id: '1',
      title: '2024년 4분기 프로젝트 회의록',
      content: '오늘 회의에서는 다음 분기의 주요 마일스톤과...',
      category: '기획',
      tags: ['프로젝트', '4분기'],
      createdAt: '2024-12-06T14:20:00.000Z',
    },
    {
      id: '2',
      title: '아이디어: 개인 명상 앱 브랜딩',
      content: '심플하고 차분한 무드의 디자인...',
      category: '브랜딩',
      tags: [],
      createdAt: '2024-12-05T10:00:00.000Z',
    }
  ];

  it('renders the note list and detail view correctly', () => {
    // Render layout with mock notes and the first one selected
    render(<NoteLayout notes={mockNotes} selectedNoteId="1" />);
    
    // Check list
    expect(screen.getAllByText('2024년 4분기 프로젝트 회의록').length).toBeGreaterThan(0);
    expect(screen.getAllByText('아이디어: 개인 명상 앱 브랜딩').length).toBeGreaterThan(0);
    
    // Check detail view (Tag '4분기' should be visible)
    expect(screen.getByText('4분기')).toBeInTheDocument();
  });
});
