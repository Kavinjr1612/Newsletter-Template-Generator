import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Newspaper, Calendar, Trash2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Edition, createEdition, CustomizationMode } from '@/types/newspaper';
import { getEditions, saveEdition, deleteEdition, exportAllData, importData } from '@/lib/store';
import { createSampleEdition } from '@/lib/sampleData';

import { toast } from 'sonner';

const Dashboard = () => {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [newName, setNewName] = useState('');
  const [deptName, setDeptName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportAllData();
    toast.success('Data exported successfully!');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importData(file);
      setEditions(imported);
      toast.success(`Imported ${imported.length} edition(s) successfully!`);
    } catch {
      toast.error('Failed to import data. Please check the file format.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    setEditions(getEditions());
  }, []);

  const handleCreate = () => {
    if (!newName.trim() || !deptName.trim()) return;
    const edition = createEdition(newName.trim(), deptName.trim());
    saveEdition(edition);
    setEditions(getEditions());
    setNewName('');
    setDeptName('');
    setDialogOpen(false);
    navigate(`/editor/${edition.id}`);
  };

  const handleDelete = (id: string) => {
    deleteEdition(id);
    setEditions(getEditions());
  };

  const handleLoadSample = () => {
    const sample = createSampleEdition();
    saveEdition(sample);
    setEditions(getEditions());
    toast.success('Sample edition created!');
    navigate(`/preview/${sample.id}`);
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between py-6 px-4">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-accent" />
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight">
                The Press Room
              </h1>
              <p className="text-sm text-muted-foreground">
                Department Newspaper Template Generator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="secondary" size="sm" className="gap-2" onClick={handleLoadSample}>
              <Newspaper className="h-4 w-4" />
              Load Sample
            </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Edition
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-headline text-xl">Create New Edition</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Edition Name</Label>
                  <Input
                    placeholder="e.g. Spring 2026 Newsletter"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department Name</Label>
                  <Input
                    placeholder="e.g. Computer Science Department"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={!newName.trim() || !deptName.trim()}>
                  Create & Start Editing
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {editions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 rounded-full bg-secondary p-6">
              <Newspaper className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="font-headline text-2xl font-bold mb-2">No editions yet</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Create your first newspaper edition to get started. Add articles, events, alumni stories, and more — then generate a beautiful newspaper layout.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Edition
            </Button>
          </div>
        ) : (
          <div>
            <h2 className="font-headline text-2xl font-bold mb-6">Your Editions</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {editions.map((edition) => (
                <Card key={edition.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">{edition.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(edition.date).toLocaleDateString()} · Edition #{edition.editionNumber}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{edition.departmentName}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{edition.articles.length} articles</span>
                      <span>·</span>
                      <span>{edition.events.length} events</span>
                      <span>·</span>
                      <span>{edition.people.length} profiles</span>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/editor/${edition.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const updated = { ...edition, mode: 'academic' as CustomizationMode };
                        saveEdition(updated);
                        navigate(`/preview/${edition.id}`);
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto text-destructive"
                      onClick={() => handleDelete(edition.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
