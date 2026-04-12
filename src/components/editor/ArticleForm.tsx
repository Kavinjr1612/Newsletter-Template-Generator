import { useState } from 'react';
import { Plus, Trash2, Pencil, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edition, Article } from '@/types/newspaper';

interface Props {
  edition: Edition;
  onUpdate: (edition: Edition) => void;
}

const emptyForm = { title: '', author: '', body: '', imageUrl: '', sourceUrl: '', category: 'academics' as const, priority: 'feature' as const, isUrgent: false };

const ArticleForm = ({ edition, onUpdate }: Props) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  const handleSave = () => {
    if (editingId) {
      onUpdate({ ...edition, articles: edition.articles.map((a) => a.id === editingId ? { ...a, ...form } : a) });
    } else {
      const article: Article = { id: crypto.randomUUID(), ...form, createdAt: new Date().toISOString() };
      onUpdate({ ...edition, articles: [...edition.articles, article] });
    }
    setForm(emptyForm);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (article: Article) => {
    setForm({ title: article.title, author: article.author, body: article.body, imageUrl: article.imageUrl || '', sourceUrl: article.sourceUrl || '', category: article.category as 'academics', priority: article.priority as 'feature', isUrgent: article.isUrgent || false });
    setEditingId(article.id);
    setIsAdding(true);
  };

  const handleCancel = () => { setForm(emptyForm); setEditingId(null); setIsAdding(false); };
  const handleDelete = (id: string) => onUpdate({ ...edition, articles: edition.articles.filter((a) => a.id !== id) });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-black text-slate-900 tracking-tight uppercase">Tech Articles<span className="text-indigo-600">.</span></h2>
          <p className="text-sm text-slate-500 font-medium">{edition.articles.length} articles compiled — each becomes a full A4 feature page.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => { handleCancel(); setIsAdding(true); }} className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 shadow-lg h-11 px-6 font-black uppercase tracking-widest text-[10px]">
            <Plus className="h-4 w-4" /> Add New Article
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-indigo-100 bg-white shadow-xl ring-1 ring-black/5">
          <CardHeader className="bg-slate-50/50 border-b">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-600">{editingId ? 'Modify Transmission' : 'New Article Entry'}</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Headline</Label>
                <Input className="h-11 border-slate-200 focus-visible:ring-indigo-600" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Article headline..." />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author Signature</Label>
                <Input className="h-11 border-slate-200 focus-visible:ring-indigo-600" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name..." />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Body Content</Label>
                <span className={`text-[10px] font-mono ${form.body.length > 1200 ? 'text-destructive font-bold' : 'text-slate-400'}`}>
                  LOAD: {form.body.length} / 1200
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mb-2 italic">Maintain high semantic density for optimal page layout.</p>
              <Textarea 
                className="border-slate-200 focus-visible:ring-indigo-600 min-h-[250px] text-base leading-relaxed" 
                value={form.body} 
                onChange={(e) => setForm({ ...form, body: e.target.value })} 
                placeholder="Write the article content..." 
                maxLength={1200} 
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hero Image URL (optional)</Label>
                <Input className="border-slate-200 focus-visible:ring-indigo-600" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference Source (optional)</Label>
                <Input className="border-slate-200 focus-visible:ring-indigo-600" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-50">
              <Button onClick={handleSave} disabled={!form.title.trim() || !form.body.trim()} className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 shadow-lg px-8 font-black uppercase tracking-widest text-[10px] h-11">
                {editingId ? 'Update Archive' : 'Save To Edition'}
              </Button>
              <Button variant="ghost" onClick={handleCancel} className="text-slate-400 font-bold uppercase tracking-widest text-[10px] h-11">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {edition.articles.map((article) => (
          <Card key={article.id} className="group border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all duration-300">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-3 mb-1">
                   <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                   <h3 className="font-headline font-black text-lg text-slate-900 truncate uppercase tracking-tight">{article.title}</h3>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Author: {article.author}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{article.body.length} words</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" onClick={() => handleEdit(article)} className="h-9 w-9 p-0 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(article.id)} className="h-9 w-9 p-0 border-slate-200 text-slate-400 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {edition.articles.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
             <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                <FileText className="h-8 w-8 text-slate-300" />
             </div>
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">No Articles In Registry</h3>
             <p className="text-xs text-slate-300 uppercase tracking-tighter">Initialize a new tech feature article to begin page population</p>
             <Button 
                onClick={() => setIsAdding(true)} 
                variant="outline" 
                className="mt-6 border-slate-200 text-slate-500 hover:bg-white hover:text-indigo-600 transition-colors font-bold uppercase tracking-widest text-[9px]"
             >
                Initialize First Article
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleForm;
