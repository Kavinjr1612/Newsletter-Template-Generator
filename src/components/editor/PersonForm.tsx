import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edition, DeskMessage } from '@/types/newspaper';

interface Props {
  edition: Edition;
  onUpdate: (edition: Edition) => void;
}

const CharCount = ({ current, max }: { current: number; max: number }) => (
  <span className={`text-xs ${current > max ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
    {current} / {max}
  </span>
);

const emptyDesk: DeskMessage = { name: '', title: '', photoUrl: '', message: '' };

const DeskForm = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: DeskMessage;
  onChange: (v: DeskMessage) => void;
}) => {
  const desk = value || emptyDesk;
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{label}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={desk.name} onChange={(e) => onChange({ ...desk, name: e.target.value })} placeholder="Full name..." />
          </div>
          <div className="space-y-2">
            <Label>Designation / Title</Label>
            <Input value={desk.title} onChange={(e) => onChange({ ...desk, title: e.target.value })} placeholder="e.g. Head of Department" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Photo URL (optional)</Label>
          <Input value={desk.photoUrl} onChange={(e) => onChange({ ...desk, photoUrl: e.target.value })} placeholder="https://..." />
          {desk.photoUrl && (
            <img src={desk.photoUrl} alt="Preview" className="h-20 w-20 rounded-lg object-cover border mt-2" />
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Message</Label>
            <CharCount current={desk.message?.length || 0} max={900} />
          </div>
          <Textarea value={desk.message} onChange={(e) => onChange({ ...desk, message: e.target.value })} placeholder="Write the desk message..." rows={8} maxLength={900} />
        </div>
      </CardContent>
    </Card>
  );
};

const PersonForm = ({ edition, onUpdate }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-xl font-bold">Desk Messages</h2>
        <p className="text-sm text-muted-foreground">HOD, Faculty, and Student desk messages — each becomes a dedicated page. <span className="font-medium">Max 900 characters per message.</span></p>
      </div>

      <Tabs defaultValue="hod">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="hod">HOD Desk</TabsTrigger>
          <TabsTrigger value="faculty">Faculty Desk</TabsTrigger>
          <TabsTrigger value="student">Student Desk</TabsTrigger>
        </TabsList>

        <TabsContent value="hod" className="mt-4">
          <DeskForm
            label="HOD Desk Message"
            value={edition.hodMessage}
            onChange={(v) => onUpdate({ ...edition, hodMessage: v })}
          />
        </TabsContent>

        <TabsContent value="faculty" className="mt-4">
          <DeskForm
            label="Faculty Desk Message"
            value={edition.facultyMessage}
            onChange={(v) => onUpdate({ ...edition, facultyMessage: v })}
          />
        </TabsContent>

        <TabsContent value="student" className="mt-4">
          <DeskForm
            label="Student Secretary Desk Message"
            value={edition.studentMessage}
            onChange={(v) => onUpdate({ ...edition, studentMessage: v })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonForm;
