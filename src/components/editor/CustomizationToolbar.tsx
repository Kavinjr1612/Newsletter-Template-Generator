import React, { useState } from 'react';
import { CustomizationMode } from '@/types/newspaper';
import { ShieldCheck, Sparkles, RotateCcw, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  mode: CustomizationMode;
  onModeChange: (mode: CustomizationMode) => void;
  onReset: () => void;
}

const CustomizationToolbar = ({ mode, onModeChange, onReset }: Props) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setShowWarning(true);
    } else {
      onModeChange('academic');
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
        <div className={`p-2 rounded-lg ${mode === 'academic' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
          {mode === 'academic' ? <ShieldCheck className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Editor Mode</p>
          <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{mode} Mode</p>
        </div>
        <Switch 
          checked={mode === 'advanced'} 
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-amber-500"
        />
      </div>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onReset}
        className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 gap-2 px-3"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset to Academic Style
      </Button>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tight">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              Entering Advanced Mode
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 font-medium leading-relaxed pt-2">
              Advanced Mode allows customization that may affect institutional consistency. 
              While layout structure and page integrity will be preserved, visual defaults will be unlocked for manual editing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-slate-200 font-bold uppercase tracking-widest text-[10px]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onModeChange('advanced');
                setShowWarning(false);
              }}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-widest text-[10px]"
            >
              Enable Advanced Mode
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomizationToolbar;
