import React from 'react';
import { Edition } from '@/types/newspaper';
import { AlertCircle, CheckCircle2, ListChecks, FileText, Layout, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  edition: Edition;
  onContinue?: () => void;
}

const ValidationReport = ({ edition, onContinue }: Props) => {
  const criticalSections = [
    { id: 'vision', label: 'Vision Statement', value: edition.visionMission?.deptVision },
    { id: 'mission', label: 'Mission Statement', value: edition.visionMission?.deptMission },
    { id: 'po', label: 'Program Outcomes (PO)', value: edition.visionMission?.programOutcomes?.length },
    { id: 'peo', label: 'Program Educational Objectives (PEO)', value: edition.visionMission?.peos?.length },
    { id: 'pso', label: 'Program Specific Outcomes (PSO)', value: edition.visionMission?.psos?.length },
  ];

  const contentSections = [
    { id: 'hod', label: 'HOD Message', value: edition.hodMessage },
    { id: 'faculty', label: 'Faculty Message', value: edition.facultyMessage },
    { id: 'student', label: 'Student Message', value: edition.studentMessage },
    { id: 'articles', label: 'Articles', value: edition.articles?.length },
    { id: 'placements', label: 'Placements', value: edition.placements?.length },
    { id: 'publications', label: 'Research Publications', value: edition.publications?.length },
    { id: 'team', label: 'Editorial Team', value: edition.editorialTeam?.members?.length },
  ];

  const missingCritical = criticalSections.filter(s => !s.value);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
            <ListChecks className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Template Engine Audit</h1>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest leading-none mt-1">Pre-flight Validation & Input Transparency</p>
          </div>
        </div>
        <Button onClick={onContinue} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
          Continue to Newsletter
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Critical Health Check */}
        <Card className="col-span-12 border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-600" /> Academic Health Check
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-5 gap-4">
              {criticalSections.map(s => (
                <div key={s.id} className={`p-4 rounded-2xl border-2 transition-all ${s.value ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                    {s.value ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1 leading-none">{s.label}</p>
                  <p className={`text-sm font-bold ${s.value ? 'text-emerald-700' : 'text-red-700'}`}>
                    {s.value ? (typeof s.value === 'number' ? `${s.value} Entries` : 'Provided') : 'Missing'}
                  </p>
                </div>
              ))}
            </div>
            {missingCritical.length > 0 && (
              <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-xl flex gap-3 items-center">
                <Info className="w-5 h-5 text-orange-600 shrink-0" />
                <p className="text-sm text-orange-800 font-bold uppercase tracking-tight">Warning: {missingCritical.length} critical academic sections are missing. Proceeding with placeholders.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section Preview */}
        <Card className="col-span-7 border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
              <Layout className="w-4 h-4 text-indigo-600" /> Layout Rendering Order
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[
                { order: 1, label: 'Cover Page' },
                { order: 2, label: 'Vision & Mission' },
                { order: 3, label: 'Academic Standards (PO/PEO/PSO)' },
                { order: 4, label: 'Administrative Messages' },
                { order: 5, label: 'Feature Articles' },
                { order: 6, label: 'Career & Achievements' },
                { order: 7, label: 'Research Index' },
                { order: 8, label: 'Editorial Team' },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="w-6 h-6 flex items-center justify-center bg-slate-900 text-white rounded-md text-[10px] font-black">{p.order}</span>
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{p.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Input Transparency */}
        <Card className="col-span-5 border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Input Transparency
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Used Input Fields</p>
                <div className="flex flex-wrap gap-2">
                  {['name', 'date', 'department', 'college', 'tagline', 'logos'].map(f => (
                    <span key={f} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase">{f}</span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Unused Fields (Current Layout)</p>
                <div className="flex flex-wrap gap-2">
                  {['events', 'alumni', 'funContent', 'people', 'customSections'].map(f => (
                    <span key={f} className="px-2 py-1 bg-red-50 text-red-300 rounded text-[9px] font-bold uppercase">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ValidationReport;
