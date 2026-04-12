import { useState } from 'react';
import { Plus, Trash2, Scissors, X, ArrowRight, RotateCcw, ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edition, VisionMission, PageBreak } from '@/types/newspaper';

interface Props {
  edition: Edition;
  onUpdate: (edition: Edition) => void;
}

const CharCount = ({ current, max }: { current: number; max: number }) => (
  <span className={`text-xs ${current > max ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
    {current} / {max}
  </span>
);

const PageBreakIndicator = ({
  breakInfo,
  onRemove,
}: {
  breakInfo: PageBreak;
  onRemove: () => void;
}) => (
  <div className="flex items-center gap-2 my-2 px-3 py-2 rounded-md border-2 border-dashed border-orange-400 bg-orange-50">
    <Scissors className="h-4 w-4 text-orange-500 shrink-0" />
    <span className="text-xs font-semibold text-orange-700 flex-1">
      Page break — {breakInfo.continueNumbering ? 'continues numbering' : 'resets numbering'}
    </span>
    <Button variant="ghost" size="icon" className="h-6 w-6 text-orange-500 hover:text-destructive" onClick={onRemove}>
      <X className="h-3 w-3" />
    </Button>
  </div>
);

const ImageUrlInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-2 mt-4 p-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30">
    <div className="flex items-center gap-2">
      <ImageIcon className="h-4 w-4 text-muted-foreground" />
      <Label className="text-sm">{label}</Label>
    </div>
    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste image URL..." />
    {value && (
      <div className="mt-2 rounded-lg overflow-hidden border">
        <img src={value} alt="Preview" className="w-full max-h-32 object-cover" />
      </div>
    )}
  </div>
);

const VisionMissionForm = ({ edition, onUpdate }: Props) => {
  const vm = edition.visionMission || {
    institutionVision: '', institutionMission: '', deptVision: '', deptMission: '',
    programOutcomes: [], peos: [], psos: [],
    programOutcomeBreaks: [], peoBreaks: [], psoBreaks: [],
  };
  const [newPO, setNewPO] = useState('');
  const [newPEO, setNewPEO] = useState('');
  const [newPSO, setNewPSO] = useState('');

  const updateVM = (partial: Partial<VisionMission>) => {
    onUpdate({ ...edition, visionMission: { ...vm, ...partial } });
  };

  const addItem = (field: 'programOutcomes' | 'peos' | 'psos', value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    updateVM({ [field]: [...(vm[field] || []), value.trim()] });
    setter('');
  };

  const removeItem = (field: 'programOutcomes' | 'peos' | 'psos', i: number) => {
    const breaksField = field === 'programOutcomes' ? 'programOutcomeBreaks' : field === 'peos' ? 'peoBreaks' : 'psoBreaks';
    const currentBreaks = (vm[breaksField] || []) as PageBreak[];
    const updatedBreaks = currentBreaks
      .filter(b => b.afterIndex !== i)
      .map(b => b.afterIndex > i ? { ...b, afterIndex: b.afterIndex - 1 } : b);
    updateVM({
      [field]: vm[field].filter((_, idx) => idx !== i),
      [breaksField]: updatedBreaks,
    });
  };

  const addPageBreak = (
    breaksField: 'programOutcomeBreaks' | 'peoBreaks' | 'psoBreaks',
    afterIndex: number,
    continueNumbering: boolean
  ) => {
    const currentBreaks = (vm[breaksField] || []) as PageBreak[];
    const filtered = currentBreaks.filter(b => b.afterIndex !== afterIndex);
    updateVM({ [breaksField]: [...filtered, { afterIndex, continueNumbering }] });
  };

  const removePageBreak = (
    breaksField: 'programOutcomeBreaks' | 'peoBreaks' | 'psoBreaks',
    afterIndex: number
  ) => {
    const currentBreaks = (vm[breaksField] || []) as PageBreak[];
    updateVM({ [breaksField]: currentBreaks.filter(b => b.afterIndex !== afterIndex) });
  };

  const hasBreakAfter = (breaksField: 'programOutcomeBreaks' | 'peoBreaks' | 'psoBreaks', index: number): PageBreak | undefined => {
    return ((vm[breaksField] || []) as PageBreak[]).find(b => b.afterIndex === index);
  };

  // Get page group index for a given item index based on breaks
  const getPageGroupIndex = (breaksField: 'programOutcomeBreaks' | 'peoBreaks' | 'psoBreaks', itemIndex: number): number => {
    const breaks = ((vm[breaksField] || []) as PageBreak[]).sort((a, b) => a.afterIndex - b.afterIndex);
    let group = 0;
    for (const brk of breaks) {
      if (itemIndex > brk.afterIndex) group++;
    }
    return group;
  };

  const updateGroupImage = (
    imageField: 'programOutcomeImageUrls' | 'peoImageUrls' | 'psoImageUrls',
    groupIndex: number,
    url: string
  ) => {
    const current = (vm[imageField] || {}) as Record<number, string>;
    if (url) {
      updateVM({ [imageField]: { ...current, [groupIndex]: url } });
    } else {
      const updated = { ...current };
      delete updated[groupIndex];
      updateVM({ [imageField]: updated });
    }
  };

  const renderListWithBreaks = (
    items: string[],
    field: 'programOutcomes' | 'peos' | 'psos',
    breaksField: 'programOutcomeBreaks' | 'peoBreaks' | 'psoBreaks',
    imageField: 'programOutcomeImageUrls' | 'peoImageUrls' | 'psoImageUrls',
    prefix: string,
    newValue: string,
    setNewValue: (v: string) => void,
  ) => {
    // Compute which group indices have breaks right before them for image inputs
    const breaks = ((vm[breaksField] || []) as PageBreak[]).sort((a, b) => a.afterIndex - b.afterIndex);
    const imageUrls = (vm[imageField] || {}) as Record<number, string>;

    return (
      <div className="space-y-1">
        {/* Group 0 image (before any break) */}
        <ImageUrlInput
          label="Page image (group 1)"
          value={imageUrls[0] || ''}
          onChange={(url) => updateGroupImage(imageField, 0, url)}
        />

        {items.map((item, i) => (
          <div key={i}>
            <div className="flex gap-2 items-start mt-2">
              <span className="text-xs font-bold text-muted-foreground w-10 mt-3 shrink-0">{prefix}{i + 1}</span>
              <div className="flex-1">
                <Input
                  value={item}
                  onChange={(e) => { const arr = [...items]; arr[i] = e.target.value; updateVM({ [field]: arr }); }}
                  maxLength={200}
                />
                <div className="text-right"><CharCount current={item.length} max={200} /></div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeItem(field, i)} className="text-destructive shrink-0 mt-0.5">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {i < items.length - 1 && (
              <>
                {hasBreakAfter(breaksField, i) ? (
                  <>
                    <PageBreakIndicator
                      breakInfo={hasBreakAfter(breaksField, i)!}
                      onRemove={() => removePageBreak(breaksField, i)}
                    />
                    {/* Image input for the new group after this break */}
                    <ImageUrlInput
                      label={`Page image (group ${getPageGroupIndex(breaksField, i + 1) + 1})`}
                      value={imageUrls[getPageGroupIndex(breaksField, i + 1)] || ''}
                      onChange={(url) => updateGroupImage(imageField, getPageGroupIndex(breaksField, i + 1), url)}
                    />
                  </>
                ) : (
                  <div className="flex justify-center my-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-1.5 px-3 py-1 text-xs text-muted-foreground hover:text-orange-600 hover:bg-orange-50 rounded-full border border-dashed border-transparent hover:border-orange-300 transition-colors">
                          <Scissors className="h-3 w-3" />
                          Insert page break
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" align="center">
                        <p className="text-xs font-semibold mb-2 text-foreground">Page break after item {i + 1}</p>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs"
                            onClick={() => addPageBreak(breaksField, i, true)}>
                            <ArrowRight className="h-3 w-3" /> Continue numbering
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs"
                            onClick={() => addPageBreak(breaksField, i, false)}>
                            <RotateCcw className="h-3 w-3" /> Reset numbering
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Add ${prefix || 'item'}...`}
            maxLength={200}
            onKeyDown={(e) => e.key === 'Enter' && addItem(field, newValue, setNewValue)}
          />
          <Button onClick={() => addItem(field, newValue, setNewValue)} disabled={!newValue.trim()} className="gap-1">
            <Plus className="h-4 w-4" />Add
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-xl font-bold">Vision & Mission</h2>
        <p className="text-sm text-muted-foreground">Institution and department vision, mission, POs, PEOs, PSOs</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Institution Vision & Mission</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Vision</Label>
              <CharCount current={vm.institutionVision?.length || 0} max={350} />
            </div>
            <Textarea value={vm.institutionVision} onChange={(e) => updateVM({ institutionVision: e.target.value })} rows={3} placeholder="Institution vision statement..." maxLength={350} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Mission</Label>
              <CharCount current={vm.institutionMission?.length || 0} max={500} />
            </div>
            <Textarea value={vm.institutionMission} onChange={(e) => updateVM({ institutionMission: e.target.value })} rows={4} placeholder="Institution mission..." maxLength={500} />
          </div>
          <ImageUrlInput
            label="Section Photo (appears below mission)"
            value={vm.institutionImageUrl || ''}
            onChange={(url) => updateVM({ institutionImageUrl: url })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Department Vision & Mission</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Dept Vision</Label>
              <CharCount current={vm.deptVision?.length || 0} max={350} />
            </div>
            <Textarea value={vm.deptVision} onChange={(e) => updateVM({ deptVision: e.target.value })} rows={3} placeholder="Department vision..." maxLength={350} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Dept Mission</Label>
              <CharCount current={vm.deptMission?.length || 0} max={500} />
            </div>
            <Textarea value={vm.deptMission} onChange={(e) => updateVM({ deptMission: e.target.value })} rows={4} placeholder="Department mission..." maxLength={500} />
          </div>
          <ImageUrlInput
            label="Section Photo (appears below mission)"
            value={vm.deptImageUrl || ''}
            onChange={(url) => updateVM({ deptImageUrl: url })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Program Outcomes (PO) — {vm.programOutcomes.length}
            <span className="text-xs text-muted-foreground font-normal ml-1">(max 200 chars each, use page breaks to split across pages)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderListWithBreaks(vm.programOutcomes, 'programOutcomes', 'programOutcomeBreaks', 'programOutcomeImageUrls', '', newPO, setNewPO)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Program Educational Objectives (PEO) — {vm.peos.length}
            <span className="text-xs text-muted-foreground font-normal ml-1">(200 chars each)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderListWithBreaks(vm.peos, 'peos', 'peoBreaks', 'peoImageUrls', 'PEO', newPEO, setNewPEO)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Program Specific Outcomes (PSO) — {vm.psos.length}
            <span className="text-xs text-muted-foreground font-normal ml-1">(200 chars each)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderListWithBreaks(vm.psos, 'psos', 'psoBreaks', 'psoImageUrls', 'PSO', newPSO, setNewPSO)}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisionMissionForm;
