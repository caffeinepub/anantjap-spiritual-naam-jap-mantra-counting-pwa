import { useState, useEffect } from 'react';
import { Moon, Sun, Download, Upload, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [japMethod, setJapMethod] = useState<'tap' | 'swipe'>('swipe');

  useEffect(() => {
    const saved = localStorage.getItem('anantjap_jap_method');
    if (saved) {
      setJapMethod(saved as 'tap' | 'swipe');
    }
  }, []);

  const handleJapMethodChange = (value: string) => {
    setJapMethod(value as 'tap' | 'swipe');
    localStorage.setItem('anantjap_jap_method', value);
    toast.success('Jap method updated');
  };

  const handleExportData = () => {
    const data: Record<string, any> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('anantjap_')) {
        data[key] = localStorage.getItem(key);
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anantjap_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            Object.entries(data).forEach(([key, value]) => {
              if (key.startsWith('anantjap_')) {
                localStorage.setItem(key, value as string);
              }
            });
            toast.success('Data imported successfully');
            window.location.reload();
          } catch (error) {
            toast.error('Failed to import data');
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  };

  const handleDeleteAllData = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('anantjap_')) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => localStorage.removeItem(key));
    toast.success('All data deleted');
    window.location.reload();
  };

  return (
    <div className="container px-4 py-8 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 spiritual-gradient bg-clip-text text-transparent">
          {t('settings')}
        </h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('theme')}</CardTitle>
            <CardDescription>Choose your preferred theme</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={theme} onValueChange={setTheme}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                  <Sun className="h-4 w-4" />
                  {t('light')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  {t('dark')}
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Jap Method Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('jap_method')}</CardTitle>
            <CardDescription>Choose how to count japs</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={japMethod} onValueChange={handleJapMethodChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tap" id="tap" />
                <Label htmlFor="tap" className="cursor-pointer">
                  {t('tap')} - Tap on mantra to count
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="swipe" id="swipe" />
                <Label htmlFor="swipe" className="cursor-pointer">
                  {t('swipe')} - Swipe up to count
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>{t('data_management')}</CardTitle>
            <CardDescription>{t('local_storage_note')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleExportData} variant="outline" className="w-full gap-2">
              <Download className="h-4 w-4" />
              {t('export_data')}
            </Button>
            
            <Button onClick={handleImportData} variant="outline" className="w-full gap-2">
              <Upload className="h-4 w-4" />
              {t('import_data')}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2">
                  <Trash2 className="h-4 w-4" />
                  {t('delete_all_data')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your jap data, custom gods, and bhajans from this device.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAllData} className="bg-destructive text-destructive-foreground">
                    Delete All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

