import React from 'react';
import { Note } from '../../../../core/entities/note.entity';

interface NoteLayoutProps {
  notes: Note[];
  selectedNoteId: string | null;
}

export default function NoteLayout({ notes, selectedNoteId }: NoteLayoutProps) {
  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* TopAppBar */}
      <header className="flex justify-between items-center px-6 h-16 w-full bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-surface-container/50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tighter headline-tight">내 노트</h1>
        </div>
      </header>

      {/* Dual Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left List (30%) */}
        <section className="w-[30%] min-w-[320px] bg-surface-container-low border-r border-slate-200/50 flex flex-col">
          <div className="p-6">
            <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]">
              <span className="material-symbols-outlined font-[300]">add</span>
              새 노트 작성
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6 space-y-3">
            {notes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all hover:translate-x-1 group ${
                    isSelected
                      ? 'bg-surface-container-lowest shadow-sm border-l-4 border-primary'
                      : 'hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      className={`font-semibold line-clamp-1 ${
                        isSelected ? 'font-bold text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'
                      }`}
                    >
                      {note.title}
                    </h3>
                    <span className="text-[10px] text-outline font-medium shrink-0">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-2">
                    {note.content}
                  </p>
                  <div className="flex gap-1">
                    {note.category && (
                      <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[9px] rounded-full font-bold">
                        {note.category}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Detail (70%) */}
        <section className="flex-1 bg-surface-container-lowest overflow-y-auto custom-scrollbar relative pb-32">
          {selectedNote ? (
            <div className="max-w-4xl mx-auto p-12">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-xs rounded-lg font-bold">
                  {selectedNote.category}
                </span>
                <span className="text-sm text-outline font-medium">|</span>
                <span className="text-sm text-outline">
                  작성일: {new Date(selectedNote.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h2 className="text-4xl font-bold text-on-surface mb-8 headline-tight leading-tight">
                {selectedNote.title}
              </h2>

              <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
                {selectedNote.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-surface-container text-on-surface-variant text-xs rounded-full whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-sm">tag</span>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-slate max-w-none text-on-surface-variant leading-relaxed space-y-6 text-lg">
                {/* Note Content (Currently string, could be React Markdown later) */}
                <p className="whitespace-pre-wrap">{selectedNote.content}</p>

                {/* Attachments Section */}
                {selectedNote.attachments && selectedNote.attachments.length > 0 && (
                  <div className="mt-12 p-8 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">attachment</span>
                      <span className="font-bold text-on-surface">첨부 파일 ({selectedNote.attachments.length})</span>
                    </div>
                    {selectedNote.attachments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600">description</span>
                          </div>
                          <a href={file.url} className="text-sm font-medium hover:underline" target="_blank" rel="noreferrer">
                            {file.name}
                          </a>
                        </div>
                        <button className="text-outline hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              선택된 노트가 없습니다.
            </div>
          )}

          {/* Floating Note Component Placeholder */}
          <div className="fixed bottom-8 right-12 w-[calc(70%-6rem)] max-w-xl z-20">
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-2 flex items-center gap-2">
              <button className="p-3 text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">image</span>
              </button>
              <button className="p-3 text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">format_bold</span>
              </button>
              <input
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder-slate-400 outline-none"
                placeholder="여기에 바로 메모를 남기세요..."
                type="text"
              />
              <button className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
