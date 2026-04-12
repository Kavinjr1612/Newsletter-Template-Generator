import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edition, TemplateStyle } from '@/types/newspaper';

interface Props {
  edition: Edition;
  onUpdate: (edition: Edition) => void;
}

const EditionSettings = ({ edition, onUpdate }: Props) => {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md overflow-hidden rounded-2xl">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="font-headline text-lg font-bold text-slate-800 uppercase tracking-widest">Master Template Style</CardTitle>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Affects high-fidelity PDF output and overall aesthetics</p>
        </CardHeader>
        <CardContent className="pt-6">
          <Select 
            value={edition.templateStyle} 
            onValueChange={(v) => onUpdate({ ...edition, templateStyle: v as TemplateStyle })}
          >
            <SelectTrigger className="h-14 bg-white border-slate-200 shadow-sm focus:ring-indigo-500 rounded-xl">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200">

              <SelectItem value="academic" className="py-3">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 uppercase">Academic Institutional</span>
                  <span className="text-[10px] text-indigo-600 uppercase tracking-wider font-bold">University Standard • Grid-Based • Professional</span>
                </div>
              </SelectItem>
              <SelectItem value="modern-nexus" className="py-3">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 uppercase">Professional Executive</span>
                  <span className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold">Departmental Standard • High Clarity • Professional Alignment</span>
                </div>
              </SelectItem>
              <SelectItem value="modern-academic-minimal" className="py-3">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 uppercase">Modern Academic Minimal</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Clean & Spaced • Subtle Accents • High Whitespace Design</span>
                </div>
              </SelectItem>
              <SelectItem value="editorial-magazine" className="py-3">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 uppercase">Editorial Magazine</span>
                  <span className="text-[10px] text-amber-600 uppercase tracking-wider font-bold">Bold Serif • Dynamic Hierarchy • Story-First Layout</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm">
        <p className="font-black mb-2 uppercase tracking-[0.2em] text-[10px] text-indigo-700">System Information</p>
        <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
          The selected template determines the grid layout, typography, and page segregation for your final A4 document. 
          Use the <strong>Live Preview</strong> window to visualize how your data is distributed across pages before printing.
        </p>
      </div>
    </div>
  );
};

export default EditionSettings;
