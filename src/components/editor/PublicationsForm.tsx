import { useState } from 'react';
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edition, Publication } from '@/types/newspaper';

interface Props {
  edition: Edition;
  onUpdate: (edition: Edition) => void;
}

const PublicationsForm = ({ edition, onUpdate }: Props) => {
  const publications = edition.publications || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Publication, 'id'>>({ dept: '', paperDetails: '', claimingAuthor: '', indexing: '' });

  const save = () => {
    if (!form.paperDetails.trim()) return;
    
    if (editingId) {
      onUpdate({
        ...edition,
        publications: publications.map((p) => (p.id === editingId ? { ...p, ...form } : p)),
      });
      setEditingId(null);
    } else {
      onUpdate({
        ...edition,
        publications: [...publications, { id: crypto.randomUUID(), ...form }],
      });
    }
    setForm({ dept: '', paperDetails: '', claimingAuthor: '', indexing: '' });
  };

  const handleEdit = (pub: Publication) => {
    setEditingId(pub.id);
    setForm({
      dept: pub.dept,
      paperDetails: pub.paperDetails,
      claimingAuthor: pub.claimingAuthor,
      indexing: pub.indexing,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ dept: '', paperDetails: '', claimingAuthor: '', indexing: '' });
  };

  const remove = (id: string) => onUpdate({ ...edition, publications: publications.filter((p) => p.id !== id) });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-xl font-bold">R&D Publications</h2>
        <p className="text-sm text-muted-foreground">{publications.length} publications — displayed as a table in the newsletter</p>
      </div>

      <Card className={editingId ? 'ring-2 ring-primary ring-offset-2' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{editingId ? 'Edit Publication' : 'Add R&D Publication'}</CardTitle>
            {editingId && (
              <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-8 gap-1">
                <X className="h-4 w-4" /> Cancel Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Dept</Label>
              <Input value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} placeholder="e.g. MCA" />
            </div>
            <div className="space-y-2">
              <Label>Claiming Author</Label>
              <Input value={form.claimingAuthor} onChange={(e) => setForm({ ...form, claimingAuthor: e.target.value })} placeholder="Author name..." />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Paper Details</Label>
              <span className={`text-xs ${form.paperDetails.length > 200 ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                {form.paperDetails.length} / 200
              </span>
            </div>
            <Textarea value={form.paperDetails} onChange={(e) => setForm({ ...form, paperDetails: e.target.value })} rows={3} placeholder="Paper title, journal name, volume, year..." maxLength={200} />
          </div>
          <div className="space-y-2">
            <Label>Indexing</Label>
            <Input value={form.indexing} onChange={(e) => setForm({ ...form, indexing: e.target.value })} placeholder="e.g. Scopus, SCI, WoS..." />
          </div>
          <Button onClick={save} disabled={!form.paperDetails.trim()} className="gap-2">
            {editingId ? (
              <><Pencil className="h-4 w-4" /> Update Publication</>
            ) : (
              <><Plus className="h-4 w-4" /> Add Publication</>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {publications.map((pub) => (
          <Card key={pub.id} className={`group ${editingId === pub.id ? 'bg-primary/5 border-primary' : ''}`}>
            <CardContent className="flex items-start justify-between p-4">
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{pub.dept}</span>
                  <span className="text-xs text-muted-foreground">{pub.indexing}</span>
                </div>
                <p className="text-sm font-medium truncate">{pub.paperDetails}</p>
                <p className="text-xs text-muted-foreground">{pub.claimingAuthor}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(pub)} className="h-8 w-8 text-primary">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(pub.id)} className="h-8 w-8 text-destructive shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PublicationsForm;
