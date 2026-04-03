CREATE TABLE public.note_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    content_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.note_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own note attachments" ON public.note_attachments 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.notes WHERE notes.id = note_attachments.note_id AND notes.user_id = auth.uid())
  );

CREATE POLICY "Users can create attachments for their own notes" ON public.note_attachments 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.notes WHERE notes.id = note_attachments.note_id AND notes.user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own note attachments" ON public.note_attachments 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.notes WHERE notes.id = note_attachments.note_id AND notes.user_id = auth.uid())
  );
