import { useState } from 'react';
import { Plus, Trash2, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edition, EditorialMember } from '@/types/newspaper';

interface Props {
  edition: Edition;
  onUpdate: (edition: Edition) => void;
}

const EditorialTeamForm = ({ edition, onUpdate }: Props) => {
  const [memberForm, setMemberForm] = useState({ name: '', photoUrl: '' });
  const team = edition.editorialTeam || { facultyAdvisor: { name: '', title: '', photoUrl: '' }, members: [] };

  const updateTeam = (partial: Partial<typeof team>) => {
    onUpdate({ ...edition, editorialTeam: { ...team, ...partial } });
  };

  const addMember = () => {
    if (!memberForm.name.trim()) return;
    updateTeam({ members: [...team.members, { ...memberForm }] });
    setMemberForm({ name: '', photoUrl: '' });
  };

  const removeMember = (i: number) => {
    updateTeam({ members: team.members.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-xl font-bold text-indigo-700">Editorial Team</h2>
        <p className="text-sm text-muted-foreground">Faculty advisor and student members displayed on the last page</p>
      </div>

      {/* Faculty Advisor */}
      <Card className="border-indigo-100 bg-indigo-50/30">
        <CardHeader><CardTitle className="text-base text-indigo-900">Faculty Advisor</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-indigo-700">Name</Label>
              <Input
                className="bg-white"
                value={team.facultyAdvisor.name}
                onChange={(e) => updateTeam({ facultyAdvisor: { ...team.facultyAdvisor, name: e.target.value } })}
                placeholder="Faculty advisor name..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-indigo-700">Title / Designation</Label>
              <Input
                className="bg-white"
                value={team.facultyAdvisor.title}
                onChange={(e) => updateTeam({ facultyAdvisor: { ...team.facultyAdvisor, title: e.target.value } })}
                placeholder="e.g. Assistant Professor"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-indigo-700">Photo URL (optional)</Label>
            <Input
              className="bg-white"
              value={team.facultyAdvisor.photoUrl}
              onChange={(e) => updateTeam({ facultyAdvisor: { ...team.facultyAdvisor, photoUrl: e.target.value } })}
              placeholder="https://..."
            />
            {team.facultyAdvisor.photoUrl && (
              <img src={team.facultyAdvisor.photoUrl} alt="Advisor" className="h-20 w-20 rounded-full object-cover border-2 border-indigo-200 mt-2 shadow-sm" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Members */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b"><CardTitle className="text-base font-bold">Student Members ({team.members.length})</CardTitle></CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-inner">
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Add New Operative</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Member Name</Label>
                <Input className="bg-white shadow-sm" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} placeholder="Student name..." />
              </div>
              <div className="space-y-2">
                <Label>Photo URL (optional)</Label>
                <Input className="bg-white shadow-sm" value={memberForm.photoUrl} onChange={(e) => setMemberForm({ ...memberForm, photoUrl: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <Button onClick={addMember} disabled={!memberForm.name.trim()} className="mt-4 gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 shadow-lg w-full sm:w-auto h-11 px-8 font-bold uppercase tracking-wider text-xs">
              <UserPlus className="h-4 w-4" /> Add Team Member
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 mt-2 justify-center sm:justify-start">
            {team.members.map((m, i) => (
              <div key={i} className="flex flex-col items-center w-24 group relative">
                <div className="relative">
                   <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.name} className="w-16 h-16 rounded-full object-cover border-[3px] border-white shadow-md relative z-10" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl border-[3px] border-white shadow-md relative z-10 uppercase">
                        {m.name[0]}
                      </div>
                    )}
                </div>
                <p className="text-[10px] font-black text-center mt-3 leading-tight text-slate-700 uppercase tracking-tight">{m.name}</p>
                <Button
                  variant="destructive" size="icon"
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg z-20"
                  onClick={() => removeMember(i)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
            {team.members.length === 0 && (
              <div className="w-full flex flex-col items-center py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                 <Users className="h-8 w-8 text-slate-200 mb-2" />
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-none">Awaiting Operative Enrollment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditorialTeamForm;
