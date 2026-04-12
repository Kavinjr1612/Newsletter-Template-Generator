import { useState } from 'react';
import { Plus, Trash2, MapPin, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edition, Event } from '@/types/newspaper';

interface Props {
  edition: Edition;
  onUpdate: (edition: Edition) => void;
}

const emptyForm = { name: '', date: '', time: '', venue: '', description: '', imageUrl: '' };

const EventForm = ({ edition, onUpdate }: Props) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleSave = () => {
    if (editingId) {
      onUpdate({ ...edition, events: edition.events.map((e) => e.id === editingId ? { ...e, ...form } : e) });
    } else {
      const event: Event = { id: crypto.randomUUID(), ...form, createdAt: new Date().toISOString() };
      onUpdate({ ...edition, events: [...edition.events, event] });
    }
    setForm(emptyForm);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (event: Event) => {
    setForm({ name: event.name, date: event.date, time: event.time, venue: event.venue, description: event.description, imageUrl: event.imageUrl });
    setEditingId(event.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onUpdate({ ...edition, events: edition.events.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-xl font-bold">Events & Calendar</h2>
          <p className="text-sm text-muted-foreground">{edition.events.length} events added</p>
        </div>
        <Button onClick={() => { handleCancel(); setIsAdding(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Event</Button>
      </div>

      {isAdding && (
        <Card className="border-accent/30">
          <CardHeader><CardTitle className="text-base">{editingId ? 'Edit Event' : 'New Event'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Event Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Event name..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Venue</Label>
                <Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Location..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Event details..." rows={3} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!form.name.trim()}>{editingId ? 'Update Event' : 'Save Event'}</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {edition.events.map((event) => (
          <Card key={event.id} className="group">
            <CardContent className="flex items-start justify-between p-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-headline font-bold">{event.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>{event.date}</span>
                  {event.time && <span>at {event.time}</span>}
                  {event.venue && <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {event.venue}</span>}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)} className="text-destructive">
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

export default EventForm;
