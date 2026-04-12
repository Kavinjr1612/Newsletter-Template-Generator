import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edition } from '@/types/newspaper';

interface Props {
  edition: Edition;
  onUpdate: (edition: Edition) => void;
}

const CoverForm = ({ edition, onUpdate }: Props) => {
  const update = (partial: Partial<Edition>) => onUpdate({ ...edition, ...partial });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/60 mb-2">
        <h2 className="font-headline text-3xl font-black text-slate-900 tracking-tight uppercase">Cover Page</h2>
        <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mt-1">College details, identity logos & edition settings</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Basic Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>College Name</Label>
              <Input value={edition.collegeName || ''} onChange={(e) => update({ collegeName: e.target.value })} placeholder="Kongu Engineering College" />
            </div>
            <div className="space-y-2">
              <Label>Department Name</Label>
              <Input value={edition.departmentName} onChange={(e) => update({ departmentName: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Newsletter Name (e.g. The Chronicle)</Label>
              <Input value={edition.name} onChange={(e) => update({ name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Edition Number</Label>
              <Input type="number" value={edition.editionNumber} onChange={(e) => update({ editionNumber: parseInt(e.target.value) || 1 })} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={edition.date} onChange={(e) => update({ date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={edition.tagline} onChange={(e) => update({ tagline: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>College Location</Label>
            <Input value={edition.collegeLocation || ''} onChange={(e) => update({ collegeLocation: e.target.value })} placeholder="Perundurai - 638 060" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>College Logo URL</Label>
              <Input value={edition.collegeLogoUrl || ''} onChange={(e) => update({ collegeLogoUrl: e.target.value })} placeholder="https://..." />
              {edition.collegeLogoUrl && <img src={edition.collegeLogoUrl} alt="Logo" className="h-12 mt-2 object-contain" />}
            </div>
            <div className="space-y-2">
              <Label>Secondary Logo URL (e.g. NAAC)</Label>
              <Input value={edition.logoUrl || ''} onChange={(e) => update({ logoUrl: e.target.value })} placeholder="https://..." />
              {edition.logoUrl && <img src={edition.logoUrl} alt="Logo 2" className="h-12 mt-2 object-contain" />}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Building / Campus Photo URL</Label>
            <Input value={edition.buildingPhotoUrl || ''} onChange={(e) => update({ buildingPhotoUrl: e.target.value })} placeholder="https://..." />
            {edition.buildingPhotoUrl && <img src={edition.buildingPhotoUrl} alt="Building" className="w-full h-32 mt-2 object-cover rounded-lg" />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverForm;
