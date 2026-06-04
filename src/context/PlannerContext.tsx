import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
    DailyRecord, SkaterProfile, DailyTemplate, 
    RoutineSnippet, MealPlanSnippet, DrillSetSnippet 
} from '../types';
import { StorageService } from '../services/StorageService';
import { DEFAULT_TASKS, DEFAULT_NUTRITION } from '../constants';

interface PlannerContextType {
  records: Record<string, DailyRecord>;
  profiles: SkaterProfile[];
  activeProfile: SkaterProfile | null;
  loading: boolean;
  getRecord: (date: string) => DailyRecord;
  updateRecord: (record: DailyRecord) => Promise<void>;
  toggleItem: (date: string, category: 'tasks' | 'nutrition', id: string) => void;
  updateHydration: (date: string, glasses: number) => void;
  updateSleep: (date: string, field: string, value: any) => void;
  calculateRecordCompletion: (record: DailyRecord) => number;
  getStats: () => {
    currentStreak: number;
    longestStreak: number;
    monthlyCompletion: number;
    perfectDays: number;
  };
  exportData: () => Promise<string>;
  importData: (json: string) => Promise<void>;
  addProfile: (name: string) => void;
  switchProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  
  // Custom Planning
  saveTemplate: (template: DailyTemplate) => void;
  deleteTemplate: (id: string) => void;
  assignTemplateToDates: (templateId: string, dates: string[]) => void;

  // Snippet Library
  saveToLibrary: (type: 'routines' | 'mealPlans' | 'drillSets', snippet: any) => void;
  deleteFromLibrary: (type: 'routines' | 'mealPlans' | 'drillSets', id: string) => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<SkaterProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<SkaterProfile | null>(null);
  const [records, setRecords] = useState<Record<string, DailyRecord>>({});
  const [loading, setLoading] = useState(true);

  const calculateRecordCompletion = useCallback((record: DailyRecord) => {
    // Sick and Rest days are always 100% complete for streak purposes
    if (record.type === 'sick' || record.type === 'rest') return 100;
    
    const tasks = record.tasks || [];
    const nutrition = record.nutrition || [];
    
    // Rest days might have fewer tasks, we still calculate based on what's there
    // If a day has NO tasks/nutrition (unlikely with templates), it's 100%
    const totalItems = tasks.length + nutrition.length;
    if (totalItems === 0) return 100;

    const completedItems = 
      tasks.filter(t => t.completed).length + 
      nutrition.filter(n => n.completed).length;
    return (completedItems / totalItems) * 100;
  }, []);

  const loadData = useCallback(async (profileId: string) => {
    setLoading(true);
    const data = await StorageService.getAllRecords(profileId);
    setRecords(data);
    setLoading(false);
  }, []);

  const formatDate = useCallback((date: Date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }, []);

  const createDefaultRecord = useCallback((date: string): DailyRecord => {
    // Check if there is a template assigned to this date
    const templateId = activeProfile?.schedule?.[date];
    const template = activeProfile?.templates?.find(t => t.id === templateId);

    if (template) {
        return {
            date,
            type: template.type,
            templateId: template.id,
            tasks: (template.tasks || []).map((t, i) => ({ ...t, id: `task-${i}`, completed: false })),
            nutrition: (template.nutrition || []).map((n, i) => ({ ...n, id: `nut-${i}`, completed: false })),
            drills: template.drills || [],
            hydration: { glasses: 0 },
            sleep: { bedTime: '', wakeTime: '', hours: 0, score: 'needs-improvement' },
        };
    }

    // Default Fallback
    return {
        date,
        type: 'training',
        tasks: DEFAULT_TASKS.map((t, i) => ({ ...t, id: `task-${i}`, completed: false })),
        nutrition: DEFAULT_NUTRITION.map((n, i) => ({ ...n, id: `nut-${i}`, completed: false })),
        drills: [],
        hydration: { glasses: 0 },
        sleep: { bedTime: '', wakeTime: '', hours: 0, score: 'needs-improvement' },
    };

  }, [activeProfile]);

  // Initial Load
  useEffect(() => {
    const init = async () => {
        const storedProfiles = StorageService.getProfiles().map(p => ({
            ...p,
            templates: p.templates || [],
            schedule: p.schedule || {}
        }));
        setProfiles(storedProfiles);
        
        const activeId = StorageService.getActiveProfileId();
        const active = storedProfiles.find(p => p.id === activeId) || storedProfiles[0] || null;
        
        if (active) {
            setActiveProfile(active);
            StorageService.setActiveProfileId(active.id);
            await loadData(active.id);
        } else {
            setLoading(false);
        }
    };
    init();
  }, [loadData]);

  const addProfile = useCallback((name: string) => {
    const newProfile: SkaterProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        createdAt: new Date().toISOString(),
        templates: [],
        schedule: {}
    };
    setProfiles(prev => {
        const updated = [...(prev || []), newProfile];
        StorageService.saveProfiles(updated);
        return updated;
    });
    setActiveProfile(newProfile);
    StorageService.setActiveProfileId(newProfile.id);
    setRecords({});
  }, []);

  const switchProfile = useCallback(async (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
        setRecords({});
        const safeProfile: SkaterProfile = {
            ...profile,
            templates: profile.templates || [],
            schedule: profile.schedule || {},
            library: profile.library || { routines: [], mealPlans: [], drillSets: [] }
        };
        setActiveProfile(safeProfile);
        StorageService.setActiveProfileId(id);
        await loadData(id);
    }
  }, [profiles, loadData]);

  const deleteProfile = useCallback((id: string) => {
      setProfiles(prev => {
          const updated = (prev || []).filter(p => p.id !== id);
          StorageService.saveProfiles(updated);
          return updated;
      });
      localStorage.removeItem(`skate-data-${id}`);
      setActiveProfile(current => (current?.id === id ? null : current));
  }, []);

  const saveTemplate = useCallback((template: DailyTemplate) => {
    if (!activeProfile) return;
    
    const updatedProfile: SkaterProfile = {
        ...activeProfile,
        templates: (activeProfile.templates || []).some(t => t.id === template.id)
            ? activeProfile.templates.map(t => t.id === template.id ? template : t)
            : [...(activeProfile.templates || []), template]
    };

    setProfiles(prev => {
        const updated = (prev || []).map(p => p.id === activeProfile.id ? updatedProfile : p);
        StorageService.saveProfiles(updated);
        return updated;
    });
    setActiveProfile(updatedProfile);
  }, [activeProfile]);

  const deleteTemplate = useCallback((id: string) => {
    if (!activeProfile) return;

    const updatedTemplates = (activeProfile.templates || []).filter(t => t.id !== id);
    const updatedSchedule = { ...(activeProfile.schedule || {}) };
    Object.keys(updatedSchedule).forEach(date => {
        if (updatedSchedule[date] === id) delete updatedSchedule[date];
    });

    const updatedProfile: SkaterProfile = { 
        ...activeProfile, 
        templates: updatedTemplates, 
        schedule: updatedSchedule 
    };

    setProfiles(prev => {
        const updated = (prev || []).map(p => p.id === activeProfile.id ? updatedProfile : p);
        StorageService.saveProfiles(updated);
        return updated;
    });
    setActiveProfile(updatedProfile);
  }, [activeProfile]);

  const assignTemplateToDates = useCallback((templateId: string, dates: string[]) => {
    if (!activeProfile) return;

    const updatedSchedule = { ...(activeProfile.schedule || {}) };
    dates.forEach(date => {
        if (!date) return;
        if (templateId === '') {
            delete updatedSchedule[date];
        } else {
            updatedSchedule[date] = templateId;
        }
    });

    const updatedProfile: SkaterProfile = { 
        ...activeProfile, 
        schedule: updatedSchedule 
    };

    setProfiles(prev => {
        const updated = (prev || []).map(p => p.id === activeProfile.id ? updatedProfile : p);
        StorageService.saveProfiles(updated);
        return updated;
    });
    setActiveProfile(updatedProfile);
  }, [activeProfile]);

  const saveToLibrary = useCallback((type: 'routines' | 'mealPlans' | 'drillSets', snippet: any) => {
    if (!activeProfile) return;

    const currentLibrary = activeProfile.library || { routines: [], mealPlans: [], drillSets: [] };
    const list = currentLibrary[type] || [];
    const isExisting = list.some((s: any) => s.id === snippet.id);
    
    const updatedList = isExisting
        ? list.map((s: any) => s.id === snippet.id ? snippet : s)
        : [...list, snippet];
    
    const updatedLibrary = { ...currentLibrary, [type]: updatedList };
    const updatedProfile: SkaterProfile = { ...activeProfile, library: updatedLibrary };

    setProfiles(prev => {
        const updated = (prev || []).map(p => p.id === activeProfile.id ? updatedProfile : p);
        StorageService.saveProfiles(updated);
        return updated;
    });
    setActiveProfile(updatedProfile);
  }, [activeProfile]);

  const deleteFromLibrary = useCallback((type: 'routines' | 'mealPlans' | 'drillSets', id: string) => {
    if (!activeProfile) return;

    const currentLibrary = activeProfile.library || { routines: [], mealPlans: [], drillSets: [] };
    const updatedList = (currentLibrary[type] || []).filter((s: any) => s.id !== id);
    
    const updatedLibrary = { ...currentLibrary, [type]: updatedList };
    const updatedProfile: SkaterProfile = { ...activeProfile, library: updatedLibrary };

    setProfiles(prev => {
        const updated = (prev || []).map(p => p.id === activeProfile.id ? updatedProfile : p);
        StorageService.saveProfiles(updated);
        return updated;
    });
    setActiveProfile(updatedProfile);
  }, [activeProfile]);

  const getRecord = useCallback((date: string): DailyRecord => {
    return records[date] || createDefaultRecord(date);
  }, [records, createDefaultRecord]);

  const updateRecord = useCallback(async (record: DailyRecord) => {
    if (!activeProfile) return;
    await StorageService.saveRecord(activeProfile.id, record);
    setRecords((prev) => ({ ...prev, [record.date]: { ...record } }));
  }, [activeProfile]);

  const toggleItem = useCallback((date: string, category: 'tasks' | 'nutrition', id: string) => {
    if (!activeProfile) return;
    setRecords(prev => {
        const currentRecord = prev[date] || createDefaultRecord(date);
        const updatedItems = currentRecord[category].map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        const updatedRecord = { ...currentRecord, [category]: updatedItems };
        StorageService.saveRecord(activeProfile.id, updatedRecord);
        return { ...prev, [date]: updatedRecord };
    });
  }, [activeProfile, createDefaultRecord]);

  const updateHydration = useCallback((date: string, glasses: number) => {
    if (!activeProfile) return;
    setRecords(prev => {
        const currentRecord = prev[date] || createDefaultRecord(date);
        const updatedRecord = { ...currentRecord, hydration: { glasses } };
        StorageService.saveRecord(activeProfile.id, updatedRecord);
        return { ...prev, [date]: updatedRecord };
    });
  }, [activeProfile, createDefaultRecord]);

  const updateSleep = useCallback((date: string, field: string, value: any) => {
    if (!activeProfile) return;
    setRecords(prev => {
        const currentRecord = prev[date] || createDefaultRecord(date);
        const updatedRecord = { ...currentRecord, sleep: { ...currentRecord.sleep, [field]: value } };
        StorageService.saveRecord(activeProfile.id, updatedRecord);
        return { ...prev, [date]: updatedRecord };
    });
  }, [activeProfile, createDefaultRecord]);

  const getStats = useCallback(() => {
    const allRecords = Object.values(records);
    const activeDates = Object.entries(records)
      .filter(([_, record]) => calculateRecordCompletion(record) >= 90) // Changed to 90
      .map(([date]) => date)
      .sort();

    let tempStreak = 0;
    let longestStreak = 0;
    let prevDate: Date | null = null;

    activeDates.forEach(dateStr => {
        const currentDate = new Date(dateStr);
        if (prevDate) {
            const diff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);
            if (Math.round(diff) === 1) tempStreak++;
            else tempStreak = 1;
        } else {
            tempStreak = 1;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        prevDate = currentDate;
    });

    let currentStreak = 0;
    let checkDate = new Date();
    while (calculateRecordCompletion(getRecord(formatDate(checkDate))) >= 90) { // Changed to 90
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
        if (currentStreak > 1000) break;
    }
    // If today wasn't elite, check if yesterday was to keep streak alive
    if (currentStreak === 0) {
        checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - 1);
        while (calculateRecordCompletion(getRecord(formatDate(checkDate))) >= 90) { // Changed to 90
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
            if (currentStreak > 1000) break;
        }
    }

    const perfectDays = allRecords.filter(r => calculateRecordCompletion(r) === 100).length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const monthlyPoints = allRecords
        .filter(r => {
            const d = new Date(r.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((acc, r) => acc + calculateRecordCompletion(r), 0);
        
    const monthlyCompletion = monthlyPoints / daysInMonth;

    return { currentStreak, longestStreak, monthlyCompletion, perfectDays };
  }, [records, calculateRecordCompletion, getRecord, formatDate]);

  const exportData = useCallback(async () => activeProfile ? await StorageService.exportData(activeProfile.id) : '', [activeProfile]);
  
  const importData = useCallback(async (json: string) => {
    if (!activeProfile) return;
    await StorageService.importData(activeProfile.id, json);
    await loadData(activeProfile.id);
  }, [activeProfile, loadData]);

  const value = useMemo(() => ({ 
    records, profiles, activeProfile, loading, 
    getRecord, updateRecord, toggleItem, updateHydration, updateSleep,
    calculateRecordCompletion, getStats, exportData, importData,
    addProfile, switchProfile, deleteProfile,
    saveTemplate, deleteTemplate, assignTemplateToDates,
    saveToLibrary, deleteFromLibrary
  }), [
    records, profiles, activeProfile, loading, 
    getRecord, updateRecord, toggleItem, updateHydration, updateSleep,
    calculateRecordCompletion, getStats, exportData, importData, 
    addProfile, switchProfile, deleteProfile,
    saveTemplate, deleteTemplate, assignTemplateToDates,
    saveToLibrary, deleteFromLibrary
  ]);

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) throw new Error('usePlanner must be used within a PlannerProvider');
  return context;
};
