import { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '../contexts/LanguageContext';
import { useDevotee } from '../contexts/DevoteeContext';
import GodCard from '../components/GodCard';
import { toast } from 'sonner';

interface God {
  id: string;
  name: string;
  mantra: string;
  image: string;
  isCustom?: boolean;
}

interface HomePageProps {
  onGodSelect: (godId: string) => void;
}

export default function HomePage({ onGodSelect }: HomePageProps) {
  const { t } = useLanguage();
  const { currentDevotee, devotees, addDevotee, selectDevotee } = useDevotee();
  const [customGods, setCustomGods] = useState<God[]>([]);
  const [newDevoteeName, setNewDevoteeName] = useState('');
  const [newGodName, setNewGodName] = useState('');
  const [newGodMantra, setNewGodMantra] = useState('');
  const [newGodImage, setNewGodImage] = useState('');
  const [devoteeDialogOpen, setDevoteeDialogOpen] = useState(false);
  const [godDialogOpen, setGodDialogOpen] = useState(false);

  const defaultGods: God[] = [
    {
      id: 'ganesh',
      name: t('ganesh'),
      mantra: t('ganesh_mantra'),
      image: '/assets/generated/ganesh-deity.dim_400x400.png',
    },
    {
      id: 'vishnu',
      name: t('vishnu'),
      mantra: t('vishnu_mantra'),
      image: '/assets/generated/vishnu-deity.dim_400x400.png',
    },
    {
      id: 'shiv',
      name: t('shiv'),
      mantra: t('shiv_mantra'),
      image: '/assets/generated/shiv-deity.dim_400x400.png',
    },
    {
      id: 'durga',
      name: t('durga'),
      mantra: t('durga_mantra'),
      image: '/assets/generated/durga-deity.dim_400x400.png',
    },
    {
      id: 'surya',
      name: t('surya'),
      mantra: t('surya_mantra'),
      image: '/assets/generated/surya-deity.dim_400x400.png',
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('anantjap_custom_gods');
    if (saved) {
      setCustomGods(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('anantjap_custom_gods', JSON.stringify(customGods));
  }, [customGods]);

  const handleAddDevotee = () => {
    if (newDevoteeName.trim()) {
      addDevotee(newDevoteeName.trim());
      setNewDevoteeName('');
      setDevoteeDialogOpen(false);
      toast.success('Devotee added successfully');
    }
  };

  const handleAddCustomGod = () => {
    if (newGodName.trim() && newGodMantra.trim()) {
      const newGod: God = {
        id: `custom_${Date.now()}`,
        name: newGodName.trim(),
        mantra: newGodMantra.trim(),
        image: newGodImage.trim() || '/assets/generated/lotus-mandala-bg.dim_800x600.png',
        isCustom: true,
      };
      setCustomGods([...customGods, newGod]);
      setNewGodName('');
      setNewGodMantra('');
      setNewGodImage('');
      setGodDialogOpen(false);
      toast.success('Custom god added successfully');
    }
  };

  const handleRemoveCustomGod = (id: string) => {
    setCustomGods(customGods.filter(god => god.id !== id));
    toast.success('Custom god removed');
  };

  const allGods = [...defaultGods, ...customGods];

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      {/* Intro Section */}
      <section className="mb-12 text-center">
        <div className="relative mb-8 h-48 rounded-2xl overflow-hidden">
          <img
            src="/assets/generated/lotus-mandala-bg.dim_800x600.png"
            alt="Lotus Mandala"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 spiritual-gradient opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-4xl font-bold mb-4 spiritual-gradient bg-clip-text text-transparent">
                {t('benefits_title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {t('benefits_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Devotee Selection */}
      <div className="mb-8 flex justify-center">
        <Dialog open={devoteeDialogOpen} onOpenChange={setDevoteeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2">
              <Users className="h-5 w-5" />
              {currentDevotee?.name || t('choose_devotee')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('choose_devotee')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                {devotees.map((devotee) => (
                  <Button
                    key={devotee.id}
                    variant={currentDevotee?.id === devotee.id ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => {
                      selectDevotee(devotee.id);
                      setDevoteeDialogOpen(false);
                    }}
                  >
                    {devotee.name}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="devotee-name">Add New Devotee</Label>
                <div className="flex gap-2">
                  <Input
                    id="devotee-name"
                    value={newDevoteeName}
                    onChange={(e) => setNewDevoteeName(e.target.value)}
                    placeholder="Enter name"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddDevotee()}
                  />
                  <Button onClick={handleAddDevotee}>Add</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* God Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {allGods.map((god) => (
            <GodCard
              key={god.id}
              god={god}
              onSelect={() => onGodSelect(god.id)}
              onRemove={god.isCustom ? () => handleRemoveCustomGod(god.id) : undefined}
            />
          ))}
        </div>

        {/* Add Custom God Button */}
        <div className="flex justify-center">
          <Dialog open={godDialogOpen} onOpenChange={setGodDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                {t('add_custom_god')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('add_custom_god')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="god-name">God Name</Label>
                  <Input
                    id="god-name"
                    value={newGodName}
                    onChange={(e) => setNewGodName(e.target.value)}
                    placeholder="Enter god name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="god-mantra">Mantra</Label>
                  <Input
                    id="god-mantra"
                    value={newGodMantra}
                    onChange={(e) => setNewGodMantra(e.target.value)}
                    placeholder="Enter mantra"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="god-image">Image URL (optional)</Label>
                  <Input
                    id="god-image"
                    value={newGodImage}
                    onChange={(e) => setNewGodImage(e.target.value)}
                    placeholder="Enter image URL"
                  />
                </div>
                <Button onClick={handleAddCustomGod} className="w-full">
                  Add God
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}

