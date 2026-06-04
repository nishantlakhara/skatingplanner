import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlanner } from '../context/PlannerContext';
import { format, parseISO } from 'date-fns';
import { 
    ChevronLeft, CheckCircle2, Droplets, Moon, 
    Utensils, Zap, Star, Coffee, Stethoscope, Plane, Dumbbell,
    Settings2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Dialog, DialogContent, DialogHeader, 
    DialogTitle, DialogTrigger, DialogFooter 
} from '@/components/ui/dialog';
import { getWeekNumber } from '../utils/dateUtils';
import { WEEKLY_FOCUS } from '../constants';
import { motion } from 'framer-motion';

const DAY_TYPE_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
    training: { icon: Dumbbell, color: 'text-blue-600 bg-blue-50 border-blue-100', label: 'Training' },
    rest: { icon: Coffee, color: 'text-green-600 bg-green-50 border-green-100', label: 'Rest Day' },
    sick: { icon: Stethoscope, color: 'text-red-600 bg-red-50 border-red-100', label: 'Sick Day' },
    travel: { icon: Plane, color: 'text-orange-600 bg-orange-50 border-orange-100', label: 'Travel' }
};

const DailyPlanner: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { 
    getRecord, activeProfile, calculateRecordCompletion, 
    toggleItem, updateHydration, updateSleep, assignTemplateToDates 
  } = usePlanner();

  const record = useMemo(() => getRecord(date!), [date, getRecord]);
  const displayDate = useMemo(() => parseISO(date!), [date]);
  const completion = useMemo(() => calculateRecordCompletion(record), [record, calculateRecordCompletion]);

  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const templateName = useMemo(() => {
    if (!record.templateId || !activeProfile) return null;
    return activeProfile.templates?.find(t => t.id === record.templateId)?.name;
  }, [record.templateId, activeProfile]);

  const currentWeekFocus = useMemo(() => {
    const weekNum = getWeekNumber(displayDate);
    return WEEKLY_FOCUS.find(f => f.week === weekNum) || WEEKLY_FOCUS[0];
  }, [displayDate]);

  const handleQuickAssign = () => {
    if (selectedTemplate && date) {
        assignTemplateToDates(selectedTemplate === 'CLEAR' ? '' : selectedTemplate, [date]);
        setIsAssigning(false);
        alert('Template updated for this day!');
        window.location.reload(); // Force refresh to show new template tasks
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (!activeProfile) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
                <Zap size={40} />
            </div>
            <div>
                <h3 className="font-black text-slate-900">Access Denied</h3>
                <p className="text-sm text-slate-400">Please select a skater to log training.</p>
            </div>
        </div>
    );
  }

  return (
    <motion.div 
        className="space-y-6 pb-6"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.1 }}
    >
      <header className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ChevronLeft size={24} className="text-slate-600" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-slate-900 leading-tight truncate">{format(displayDate, 'MMM do')}</h1>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest leading-none">{format(displayDate, 'EEEE')}</p>
            {templateName && (
                <>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">{templateName}</p>
                </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Dialog open={isAssigning} onOpenChange={setIsAssigning}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-blue-600">
                        <Settings2 size={20} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90%] rounded-[32px]">
                    <DialogHeader>
                        <DialogTitle className="font-black italic uppercase text-blue-600">Set Day Plan</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-xs font-bold text-slate-400">Choose a template to apply to {format(displayDate, 'MMMM do')}:</p>
                        <Select onValueChange={setSelectedTemplate} value={selectedTemplate}>
                            <SelectTrigger className="w-full h-12 rounded-2xl border-slate-100 font-bold bg-slate-50">
                                <SelectValue placeholder="Select template..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CLEAR">(Default / Static)</SelectItem>
                                {(activeProfile?.templates || []).map(t => (
                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button 
                            className="w-full h-12 rounded-2xl bg-blue-600 font-black uppercase tracking-widest text-white"
                            onClick={handleQuickAssign}
                            disabled={!selectedTemplate}
                        >
                            Apply Plan
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${DAY_TYPE_CONFIG[record.type || 'training']?.color || 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                {React.createElement(DAY_TYPE_CONFIG[record.type || 'training']?.icon || Dumbbell, { size: 20 })}
            </div>
            <div className={`px-3 py-1.5 rounded-full border flex flex-col items-center justify-center min-w-[60px] transition-colors ${completion >= 90 ? 'bg-green-500 border-green-600 shadow-lg shadow-green-100' : completion >= 60 ? 'bg-amber-400 border-amber-500 shadow-lg shadow-amber-100' : completion > 0 ? 'bg-red-500 border-red-600 shadow-lg shadow-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <span className={`text-[8px] font-black uppercase leading-none ${completion > 0 ? 'text-white/80' : 'text-slate-400'}`}>Intensity</span>
                <span className={`text-sm font-black leading-none ${completion > 0 ? 'text-white' : 'text-slate-400'}`}>{Math.round(completion)}%</span>
            </div>
        </div>
      </header>

      {/* Routine Section */}
      <motion.section variants={sectionVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Zap size={14} className="text-yellow-500" fill="currentColor" /> Daily Routine
            </h3>
        </div>
        <Card className="border-none shadow-md overflow-hidden rounded-3xl">
            <CardContent className="p-0">
                {(record.tasks || []).map((task) => (
                    <motion.div 
                        key={task.id} 
                        whileTap={{ backgroundColor: "rgba(241, 245, 249, 1)" }}
                        className={`flex items-center justify-between p-4 border-b border-slate-50 last:border-0 transition-colors ${task.completed ? 'bg-green-50/30' : 'bg-white'}`}
                        onClick={() => toggleItem(date!, 'tasks', task.id)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${task.completed ? 'bg-green-500 border-green-500 scale-110 shadow-lg shadow-green-200' : 'border-slate-200'}`}>
                                {task.completed && <CheckCircle2 size={16} className="text-white" />}
                            </div>
                            <span className={`text-sm font-bold tracking-tight ${task.completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                                {task.label}
                            </span>
                        </div>
                        <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-tighter ${task.completed ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {task.category}
                        </Badge>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
      </motion.section>

      {/* Nutrition Section */}
      <motion.section variants={sectionVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Utensils size={14} className="text-green-500" /> Fuel & Nutrition
            </h3>
        </div>
        <Card className="border-none shadow-md overflow-hidden rounded-3xl">
            <CardContent className="p-0">
                {['breakfast', 'lunch', 'dinner'].map((meal) => (
                    <div key={meal} className="p-4 border-b border-slate-50 last:border-0 bg-white">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">{meal}</p>
                        <div className="grid grid-cols-1 gap-2">
                            {(record.nutrition || []).filter(n => n.category === meal).map(item => (
                                <motion.div 
                                    key={item.id} 
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${item.completed ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}
                                    onClick={() => toggleItem(date!, 'nutrition', item.id)}
                                >
                                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${item.completed ? 'bg-green-500 rotate-0 shadow-lg shadow-green-100' : 'bg-white border-2 border-slate-200 rotate-45'}`}>
                                        {item.completed && <CheckCircle2 size={14} className="text-white" />}
                                    </div>
                                    <span className={`text-xs font-bold tracking-tight ${item.completed ? 'text-green-700' : 'text-slate-600'}`}>
                                        {item.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </motion.section>

      {/* Hydration Section */}
      <motion.section variants={sectionVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Droplets size={14} className="text-blue-500" fill="currentColor" /> Hydration Level
            </h3>
            <span className="text-xs font-black text-blue-600">{(record.hydration?.glasses || 0)}/10</span>
        </div>
        <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-6">
                <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                        <motion.button
                            key={i}
                            whileTap={{ scale: 0.9, rotate: 10 }}
                            onClick={() => updateHydration(date!, i)}
                            className={`aspect-square rounded-2xl transition-all flex items-center justify-center relative overflow-hidden ${i <= (record.hydration?.glasses || 0) ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-50 border border-slate-100'}`}
                        >
                            <Droplets 
                                size={20} 
                                className={`${i <= (record.hydration?.glasses || 0) ? 'text-white' : 'text-slate-200'}`} 
                                fill={i <= (record.hydration?.glasses || 0) ? 'white' : 'transparent'} 
                            />
                            {i <= (record.hydration?.glasses || 0) && (
                                <motion.div 
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    className="absolute inset-0 bg-white/20 pointer-events-none"
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
            </CardContent>
        </Card>
      </motion.section>

      {/* Sleep Section */}
      <motion.section variants={sectionVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Moon size={14} className="text-indigo-600" fill="currentColor" /> Recovery (Sleep)
            </h3>
        </div>
        <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Lights Out</label>
                        <Input 
                            type="time" 
                            className="bg-slate-50 border-none rounded-2xl h-12 font-bold focus-visible:ring-indigo-500"
                            value={record.sleep?.bedTime || ''} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSleep(date!, 'bedTime', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Wake Up</label>
                        <Input 
                            type="time" 
                            className="bg-slate-50 border-none rounded-2xl h-12 font-bold focus-visible:ring-indigo-500"
                            value={record.sleep?.wakeTime || ''} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSleep(date!, 'wakeTime', e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total Hours</label>
                        <div className="relative">
                            <Input 
                                type="number" 
                                className="bg-slate-50 border-none rounded-2xl h-12 font-bold pr-10 focus-visible:ring-indigo-500"
                                value={record.sleep?.hours || ''} 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSleep(date!, 'hours', parseFloat(e.target.value))}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">hrs</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sleep Score</label>
                        <Select 
                            value={record.sleep?.score || 'needs-improvement'} 
                            onValueChange={(v: string) => updateSleep(date!, 'score', v)}
                        >
                            <SelectTrigger className="bg-slate-50 border-none rounded-2xl h-12 font-bold focus-visible:ring-indigo-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-xl">
                                <SelectItem value="excellent">Excellent 💎</SelectItem>
                                <SelectItem value="good">Good ✨</SelectItem>
                                <SelectItem value="needs-improvement">Needs Work 🔋</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
      </motion.section>

      {/* Weekly Focus Sticky Note */}
      <motion.section variants={sectionVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Target</h3>
        </div>
        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Star size={60} />
            </div>
            <h4 className="text-lg font-black tracking-tight mb-2">
                {record.drills && record.drills.length > 0 ? (templateName || 'Daily Target') : currentWeekFocus.title}
            </h4>
            <ul className="grid grid-cols-2 gap-2">
                {(record.drills && record.drills.length > 0 ? record.drills : currentWeekFocus.drills).map((d, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] font-bold bg-white/10 px-2 py-1.5 rounded-lg backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        {d}
                    </li>
                ))}
            </ul>
            {(!record.drills || record.drills.length === 0) && (
                <p className="text-[8px] font-black uppercase mt-3 opacity-50 italic">Showing standard week {currentWeekFocus.week} focus</p>
            )}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default DailyPlanner;
