import { useState } from 'react';
import { Plus, Trash2, UserPlus, Users, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edition, Placement, PlacementStudent } from '@/types/newspaper';

interface Props {
  edition: Edition;
  onUpdate: (edition: Edition) => void;
}

const PlacementsForm = ({ edition, onUpdate }: Props) => {
  const placements = edition.placements || [];
  const [companyForm, setCompanyForm] = useState({ companyName: '', companyLogoUrl: '', lpa: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState<{ [id: string]: PlacementStudent }>({});

  const addCompany = () => {
    if (!companyForm.companyName.trim()) return;
    
    if (editingId) {
      // Update existing
      onUpdate({
        ...edition,
        placements: placements.map(p => p.id === editingId ? { ...p, ...companyForm } : p)
      });
      setEditingId(null);
    } else {
      // Add new
      const newP: Placement = { id: crypto.randomUUID(), ...companyForm, students: [] };
      onUpdate({ ...edition, placements: [...placements, newP] });
    }
    setCompanyForm({ companyName: '', companyLogoUrl: '', lpa: '' });
  };

  const startEdit = (p: Placement) => {
    setEditingId(p.id);
    setCompanyForm({ companyName: p.companyName, companyLogoUrl: p.companyLogoUrl, lpa: p.lpa || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCompanyForm({ companyName: '', companyLogoUrl: '', lpa: '' });
  };

  const removeCompany = (id: string) => onUpdate({ ...edition, placements: placements.filter((p) => p.id !== id) });

  const addStudent = (placementId: string) => {
    const sf = studentForm[placementId] || { name: '', photoUrl: '' };
    if (!sf.name.trim()) return;
    onUpdate({
      ...edition,
      placements: placements.map((p) =>
        p.id === placementId ? { ...p, students: [...p.students, sf] } : p
      ),
    });
    setStudentForm({ ...studentForm, [placementId]: { name: '', photoUrl: '' } });
  };
  const removeStudent = (placementId: string, i: number) => {
    onUpdate({
      ...edition,
      placements: placements.map((p) =>
        p.id === placementId ? { ...p, students: p.students.filter((_, idx) => idx !== i) } : p
      ),
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline text-2xl font-black text-slate-900 tracking-tight uppercase">Placements<span className="text-indigo-600">.</span></h2>
        <p className="text-sm text-slate-500 font-medium">Manage recruitment partners and placed students. Each company entry generates a dedicated congratulations page.</p>
      </div>

      {/* Add/Edit Company Section */}
      <Card className={`border-2 overflow-hidden shadow-sm transition-all ${editingId ? 'border-amber-200 bg-amber-50/20' : 'border-indigo-100 bg-indigo-50/30'}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${editingId ? 'bg-amber-500' : 'bg-indigo-600'} animate-pulse`}></div>
            <CardTitle className={`text-xs font-black uppercase tracking-widest ${editingId ? 'text-amber-900' : 'text-indigo-900'}`}>
              {editingId ? 'Update Recruitment Partner' : 'New Recruitment Partner'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-indigo-700 font-bold text-xs uppercase tracking-wider">Company Name</Label>
              <Input
                className="bg-white border-indigo-100 focus-visible:ring-indigo-600 h-11"
                value={companyForm.companyName}
                onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                placeholder="e.g. Microsoft, Google..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-indigo-700 font-bold text-xs uppercase tracking-wider">Salary Package (LPA)</Label>
              <Input
                className="bg-white border-indigo-100 focus-visible:ring-indigo-600 h-11"
                value={companyForm.lpa}
                onChange={(e) => setCompanyForm({ ...companyForm, lpa: e.target.value })}
                placeholder="e.g. 12 LPA, 45 LPA..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-indigo-700 font-bold text-xs uppercase tracking-wider">Partner Logo URL</Label>
              <Input
                className="bg-white border-indigo-100 focus-visible:ring-indigo-600 h-11"
                value={companyForm.companyLogoUrl}
                onChange={(e) => setCompanyForm({ ...companyForm, companyLogoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={addCompany}
              disabled={!companyForm.companyName.trim()}
              className={`w-full sm:w-auto gap-2 ${editingId ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'} shadow-lg h-11 px-8 font-black uppercase tracking-widest text-[10px] text-white`}
            >
              {editingId ? 'Update Partition' : 'Add Company Partition'}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={cancelEdit}
                className="w-full sm:w-auto h-11 px-8 font-black uppercase tracking-widest text-[10px]"
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {placements.map((p) => (
          <Card key={p.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="px-3 py-1 bg-white border rounded-md text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                      Partner Log
                   </div>
                   <CardTitle className="text-base font-bold text-slate-900">{p.companyName}</CardTitle>
                </div>
                 <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" onClick={() => startEdit(p)} className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                     <Plus className="h-4 w-4 rotate-45 scale-75" />
                   </Button>
                   <Button variant="ghost" size="icon" onClick={() => removeCompany(p.id)} className="text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-colors">
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              {/* Student Roster */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <Users className="h-3 w-3" /> Selected Operatives ({p.students.length})
                   </h4>
                </div>

                <div className="flex flex-wrap gap-6 min-h-[60px] p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  {p.students.map((s, i) => (
                    <div key={i} className="flex flex-col items-center w-24 group/item relative">
                       <div className="relative">
                          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-0 group-hover/item:opacity-20 transition-opacity"></div>
                          {s.photoUrl ? (
                            <img src={s.photoUrl} alt={s.name} className="w-16 h-16 rounded-full object-cover border-[3px] border-white shadow-md relative z-10" />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-400 font-black text-xl border-[3px] border-slate-100 shadow-sm relative z-10 uppercase">
                              {s.name[0]}
                            </div>
                          )}
                       </div>
                      <p className="text-[10px] font-black text-center mt-3 leading-tight text-slate-700 uppercase tracking-tight truncate w-full">{s.name}</p>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full opacity-0 group-hover/item:opacity-100 transition-all scale-75 group-hover/item:scale-100 shadow-lg z-20"
                        onClick={() => removeStudent(p.id, i)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  {p.students.length === 0 && (
                    <div className="w-full flex items-center justify-center py-4">
                       <p className="text-xs font-bold text-slate-300 uppercase tracking-widest italic">Awaiting Operative Data Selection</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Student Flow */}
              <div className="bg-indigo-50/30 p-6 rounded-2xl border border-indigo-100/50 space-y-6">
                <div className="flex items-center gap-2">
                   <UserPlus className="h-3 w-3 text-indigo-400" />
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Enroll Selected Operative</h5>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">Operative Name</Label>
                    <Input
                      className="bg-white border-indigo-100/50 h-10 shadow-sm"
                      value={(studentForm[p.id] || { name: '' }).name}
                      onChange={(e) => setStudentForm({ ...studentForm, [p.id]: { ...(studentForm[p.id] || { name: '', photoUrl: '' }), name: e.target.value } })}
                      placeholder="Enter student name..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">Deployment Photo URL</Label>
                    <Input
                      className="bg-white border-indigo-100/50 h-10 shadow-sm"
                      value={(studentForm[p.id] || { photoUrl: '' }).photoUrl}
                      onChange={(e) => setStudentForm({ ...studentForm, [p.id]: { ...(studentForm[p.id] || { name: '', photoUrl: '' }), photoUrl: e.target.value } })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <Button
                  onClick={() => addStudent(p.id)}
                  disabled={!(studentForm[p.id]?.name?.trim())}
                  size="sm"
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 shadow-lg h-10 px-6 font-bold uppercase tracking-wider text-[10px]"
                >
                  <Plus className="h-3.5 w-3.5" /> Confirm Deployment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {placements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
             <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-slate-300" />
             </div>
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">No Placements Registered</h3>
             <p className="text-xs text-slate-300 uppercase tracking-tighter">Initialize a new recruitment partner to begin roster population</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementsForm;
