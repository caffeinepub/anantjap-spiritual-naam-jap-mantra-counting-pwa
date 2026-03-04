import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Music, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

interface Bhajan {
  id: string;
  title: string;
  lyrics: string;
  audioLink?: string;
  isDefault?: boolean;
}

const defaultBhajans: Bhajan[] = [
  {
    id: "bhajan1",
    title: "Raghupati Raghav Raja Ram",
    lyrics:
      "Raghupati Raghav Raja Ram\nPatit Pavan Sita Ram\nSita Ram Sita Ram\nBhaj Pyare Tu Sita Ram",
    isDefault: true,
  },
  {
    id: "bhajan2",
    title: "Hare Krishna Hare Rama",
    lyrics:
      "Hare Krishna Hare Krishna\nKrishna Krishna Hare Hare\nHare Rama Hare Rama\nRama Rama Hare Hare",
    isDefault: true,
  },
  {
    id: "bhajan3",
    title: "Om Jai Jagdish Hare",
    lyrics:
      "Om Jai Jagdish Hare\nSwami Jai Jagdish Hare\nBhakt Jano Ke Sankat\nDas Jano Ke Sankat\nKshan Mein Door Kare",
    isDefault: true,
  },
  {
    id: "bhajan4",
    title: "Shri Ram Jai Ram",
    lyrics: "Shri Ram Jai Ram Jai Jai Ram\nShri Ram Jai Ram Jai Jai Ram",
    isDefault: true,
  },
  {
    id: "bhajan5",
    title: "Achyutam Keshavam",
    lyrics:
      "Achyutam Keshavam Krishna Damodaram\nRama Narayanam Janaki Vallabham",
    isDefault: true,
  },
];

export default function BhajanMargPage() {
  const { t } = useLanguage();
  const [bhajans, setBhajans] = useState<Bhajan[]>(defaultBhajans);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLyrics, setNewLyrics] = useState("");
  const [newAudioLink, setNewAudioLink] = useState("");
  const [titleError, setTitleError] = useState("");
  const [lyricsError, setLyricsError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("anantjap_custom_bhajans");
    if (saved) {
      const customBhajans = JSON.parse(saved);
      setBhajans([...defaultBhajans, ...customBhajans]);
    }
  }, []);

  const saveCustomBhajans = (customBhajans: Bhajan[]) => {
    localStorage.setItem(
      "anantjap_custom_bhajans",
      JSON.stringify(customBhajans),
    );
  };

  const handleAddBhajan = () => {
    let hasError = false;

    if (!newTitle.trim()) {
      setTitleError("Title is required");
      hasError = true;
    }
    if (!newLyrics.trim()) {
      setLyricsError("Lyrics are required");
      hasError = true;
    }
    if (hasError) return;

    const customBhajans = bhajans.filter((b) => !b.isDefault);
    if (customBhajans.length >= 5) {
      toast.error("Maximum 5 custom bhajans allowed");
      return;
    }

    const newBhajan: Bhajan = {
      id: `custom_${Date.now()}`,
      title: newTitle.trim(),
      lyrics: newLyrics.trim(),
      audioLink: newAudioLink.trim() || undefined,
    };

    const updatedBhajans = [...bhajans, newBhajan];
    setBhajans(updatedBhajans);
    saveCustomBhajans(updatedBhajans.filter((b) => !b.isDefault));

    setNewTitle("");
    setNewLyrics("");
    setNewAudioLink("");
    setTitleError("");
    setLyricsError("");
    setDialogOpen(false);
    toast.success("Bhajan added successfully");
  };

  const handleRemoveBhajan = (id: string) => {
    const updatedBhajans = bhajans.filter((b) => b.id !== id);
    setBhajans(updatedBhajans);
    saveCustomBhajans(updatedBhajans.filter((b) => !b.isDefault));
    toast.success("Bhajan removed");
  };

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-terracotta">
          {t("bhajans")}
        </h1>
        <p className="text-muted-foreground">Sacred songs for devotion</p>
      </div>

      <div className="space-y-4 mb-6">
        {bhajans.map((bhajan) => (
          <Card key={bhajan.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-lotus" />
                  <CardTitle className="text-xl">{bhajan.title}</CardTitle>
                </div>
                {!bhajan.isDefault && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleRemoveBhajan(bhajan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm text-muted-foreground mb-3">
                {bhajan.lyrics}
              </p>
              {bhajan.audioLink && (
                <a
                  href={bhajan.audioLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Listen Audio
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              {t("add_bhajan")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("add_bhajan")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bhajan-title">
                  {t("title")} <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <Input
                  data-ocid="bhajan.title.input"
                  id="bhajan-title"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (titleError) setTitleError("");
                  }}
                  placeholder="Enter bhajan title"
                  className={
                    titleError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {titleError && (
                  <p
                    data-ocid="bhajan.title.error_state"
                    className="text-sm text-red-500 mt-1"
                  >
                    {titleError}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bhajan-lyrics">
                  {t("lyrics")} <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <Textarea
                  data-ocid="bhajan.lyrics.textarea"
                  id="bhajan-lyrics"
                  value={newLyrics}
                  onChange={(e) => {
                    setNewLyrics(e.target.value);
                    if (lyricsError) setLyricsError("");
                  }}
                  placeholder="Enter bhajan lyrics"
                  rows={6}
                  className={
                    lyricsError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {lyricsError && (
                  <p
                    data-ocid="bhajan.lyrics.error_state"
                    className="text-sm text-red-500 mt-1"
                  >
                    {lyricsError}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bhajan-audio">
                  {t("audio_link")} (optional)
                </Label>
                <Input
                  id="bhajan-audio"
                  value={newAudioLink}
                  onChange={(e) => setNewAudioLink(e.target.value)}
                  placeholder="Enter audio link"
                />
              </div>
              <Button
                data-ocid="bhajan.submit_button"
                onClick={handleAddBhajan}
                className="w-full"
              >
                Add Bhajan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
