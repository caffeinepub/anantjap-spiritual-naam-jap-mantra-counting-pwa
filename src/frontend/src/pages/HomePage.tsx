import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Plus, Upload, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import GodCard from "../components/GodCard";
import StorageLimitBanner from "../components/StorageLimitBanner";
import StorageLimitDialog from "../components/StorageLimitDialog";
import { useDevotee } from "../contexts/DevoteeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useStorageLimit } from "../hooks/useStorageLimit";

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
  const { safeSetItem } = useStorageLimit();
  const [customGods, setCustomGods] = useState<God[]>([]);
  const [newDevoteeName, setNewDevoteeName] = useState("");
  const [newGodName, setNewGodName] = useState("");
  const [newGodMantra, setNewGodMantra] = useState("");
  const [newGodImage, setNewGodImage] = useState("");
  const [newGodImagePreview, setNewGodImagePreview] = useState<string | null>(
    null,
  );
  const [devoteeDialogOpen, setDevoteeDialogOpen] = useState(false);
  const [godDialogOpen, setGodDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit dialog state
  const [editGod, setEditGod] = useState<God | null>(null);
  const [editGodDialogOpen, setEditGodDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editMantra, setEditMantra] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Validation error states
  const [godNameError, setGodNameError] = useState("");
  const [godMantraError, setGodMantraError] = useState("");
  const [editNameError, setEditNameError] = useState("");
  const [editMantraError, setEditMantraError] = useState("");
  const [devoteeNameError, setDevoteeNameError] = useState("");

  const defaultGods: God[] = [
    {
      id: "ganesh",
      name: t("ganesh"),
      mantra: t("ganesh_mantra"),
      image: "/assets/generated/ganesh-deity.dim_400x400.png",
    },
    {
      id: "vishnu",
      name: t("vishnu"),
      mantra: t("vishnu_mantra"),
      image: "/assets/generated/vishnu-deity.dim_400x400.png",
    },
    {
      id: "shiv",
      name: t("shiv"),
      mantra: t("shiv_mantra"),
      image: "/assets/generated/shiv-deity.dim_400x400.png",
    },
    {
      id: "durga",
      name: t("durga"),
      mantra: t("durga_mantra"),
      image: "/assets/generated/durga-deity.dim_400x400.png",
    },
    {
      id: "surya",
      name: t("surya"),
      mantra: t("surya_mantra"),
      image: "/assets/generated/surya-deity.dim_400x400.png",
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("anantjap_custom_gods");
    if (saved) {
      setCustomGods(JSON.parse(saved));
    }
  }, []);

  const persistCustomGods = (gods: God[]) => {
    const serialized = JSON.stringify(gods);
    const saved = safeSetItem("anantjap_custom_gods", serialized);
    if (!saved) {
      toast.error("Storage full! Please export or delete data in Settings.");
    }
  };

  const handleAddDevotee = () => {
    if (!newDevoteeName.trim()) {
      setDevoteeNameError("Name is required");
      return;
    }
    addDevotee(newDevoteeName.trim());
    setNewDevoteeName("");
    setDevoteeNameError("");
    setDevoteeDialogOpen(false);
    toast.success("Devotee added successfully");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setNewGodImage(dataUrl);
      setNewGodImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setEditImage(dataUrl);
      setEditImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustomGod = () => {
    let hasError = false;
    if (!newGodName.trim()) {
      setGodNameError("God name is required");
      hasError = true;
    }
    if (!newGodMantra.trim()) {
      setGodMantraError("Mantra is required");
      hasError = true;
    }
    if (hasError) return;

    const newGod: God = {
      id: `custom_${Date.now()}`,
      name: newGodName.trim(),
      mantra: newGodMantra.trim(),
      image:
        newGodImage.trim() ||
        "/assets/generated/lotus-mandala-bg.dim_800x600.png",
      isCustom: true,
    };
    const updated = [...customGods, newGod];
    setCustomGods(updated);
    persistCustomGods(updated);
    setNewGodName("");
    setNewGodMantra("");
    setNewGodImage("");
    setNewGodImagePreview(null);
    setGodNameError("");
    setGodMantraError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setGodDialogOpen(false);
    toast.success("Custom god added successfully");
  };

  const handleRemoveCustomGod = (id: string) => {
    const updated = customGods.filter((god) => god.id !== id);
    setCustomGods(updated);
    persistCustomGods(updated);
    toast.success("Custom god removed");
  };

  const openEditDialog = (god: God) => {
    setEditGod(god);
    setEditName(god.name);
    setEditMantra(god.mantra);
    setEditImage(god.image);
    setEditImagePreview(god.image);
    setEditGodDialogOpen(true);
  };

  const handleSaveEdit = () => {
    let hasError = false;
    if (!editName.trim()) {
      setEditNameError("God name is required");
      hasError = true;
    }
    if (!editMantra.trim()) {
      setEditMantraError("Mantra is required");
      hasError = true;
    }
    if (hasError || !editGod) return;

    const updated = customGods.map((g) =>
      g.id === editGod.id
        ? {
            ...g,
            name: editName.trim(),
            mantra: editMantra.trim(),
            image: editImage.trim() || g.image,
          }
        : g,
    );
    setCustomGods(updated);
    persistCustomGods(updated);
    setEditNameError("");
    setEditMantraError("");
    setEditGodDialogOpen(false);
    setEditGod(null);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
    toast.success("Custom god updated");
  };

  const allGods = [...defaultGods, ...customGods];

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      {/* Storage Limit Banner */}
      <StorageLimitBanner />

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
              <h1 className="text-4xl font-bold mb-4 text-terracotta">
                {t("benefits_title")}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {t("benefits_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Devotee Selection */}
      <div className="mb-8 flex justify-center">
        <Dialog
          open={devoteeDialogOpen}
          onOpenChange={(open) => {
            setDevoteeDialogOpen(open);
            if (!open) setDevoteeNameError("");
          }}
        >
          <DialogTrigger asChild>
            <Button
              data-ocid="devotee.open_modal_button"
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Users className="h-5 w-5" />
              {currentDevotee?.name || t("choose_devotee")}
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="devotee.dialog">
            <DialogHeader>
              <DialogTitle>{t("choose_devotee")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                {devotees.map((devotee) => (
                  <Button
                    key={devotee.id}
                    variant={
                      currentDevotee?.id === devotee.id ? "default" : "outline"
                    }
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
                <Label htmlFor="devotee-name">
                  Add New Devotee <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    data-ocid="devotee.input"
                    id="devotee-name"
                    value={newDevoteeName}
                    onChange={(e) => {
                      setNewDevoteeName(e.target.value);
                      if (devoteeNameError) setDevoteeNameError("");
                    }}
                    placeholder="Enter name"
                    onKeyDown={(e) => e.key === "Enter" && handleAddDevotee()}
                    className={
                      devoteeNameError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  <Button
                    data-ocid="devotee.submit_button"
                    onClick={handleAddDevotee}
                  >
                    Add
                  </Button>
                </div>
                {devoteeNameError && (
                  <p
                    data-ocid="devotee.name.error_state"
                    className="text-sm text-red-500 mt-1"
                  >
                    {devoteeNameError}
                  </p>
                )}
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
              onRemove={
                god.isCustom ? () => handleRemoveCustomGod(god.id) : undefined
              }
              onEdit={god.isCustom ? () => openEditDialog(god) : undefined}
            />
          ))}
        </div>

        {/* Add Custom God Button */}
        <div className="flex justify-center">
          <Dialog
            open={godDialogOpen}
            onOpenChange={(open) => {
              setGodDialogOpen(open);
              if (!open) {
                setGodNameError("");
                setGodMantraError("");
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                data-ocid="god.open_modal_button"
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                {t("add_custom_god")}
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="god.dialog">
              <DialogHeader>
                <DialogTitle>{t("add_custom_god")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="god-name">
                    God Name <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    data-ocid="god.input"
                    id="god-name"
                    value={newGodName}
                    onChange={(e) => {
                      setNewGodName(e.target.value);
                      if (godNameError) setGodNameError("");
                    }}
                    placeholder="Enter god name"
                    className={
                      godNameError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {godNameError && (
                    <p
                      data-ocid="god.name.error_state"
                      className="text-sm text-red-500 mt-1"
                    >
                      {godNameError}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="god-mantra">
                    Mantra <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    data-ocid="god.textarea"
                    id="god-mantra"
                    value={newGodMantra}
                    onChange={(e) => {
                      setNewGodMantra(e.target.value);
                      if (godMantraError) setGodMantraError("");
                    }}
                    placeholder="Enter mantra"
                    className={
                      godMantraError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {godMantraError && (
                    <p
                      data-ocid="god.mantra.error_state"
                      className="text-sm text-red-500 mt-1"
                    >
                      {godMantraError}
                    </p>
                  )}
                </div>

                {/* Image Upload Section */}
                <div className="space-y-3">
                  <Label>God Image (optional)</Label>

                  {/* File upload button + preview row */}
                  <div className="flex items-center gap-4">
                    {/* Preview circle */}
                    {newGodImagePreview ? (
                      <div className="h-20 w-20 shrink-0 rounded-full overflow-hidden border-2 border-terracotta/50 shadow-md">
                        <img
                          src={newGodImagePreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 shrink-0 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/40">
                        <ImagePlus className="h-7 w-7 text-muted-foreground/50" />
                      </div>
                    )}

                    {/* Upload button */}
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        id="god-image-file"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileSelect}
                      />
                      <Button
                        data-ocid="god.upload_button"
                        type="button"
                        variant="outline"
                        className="w-full gap-2 border-dashed border-terracotta/40 hover:border-terracotta/70 hover:bg-terracotta/5 text-foreground transition-all"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-terracotta" />
                        {newGodImagePreview
                          ? "Change Image"
                          : "Choose from Device"}
                      </Button>
                      <p className="mt-1.5 text-xs text-muted-foreground text-center">
                        JPG, PNG, WebP supported
                      </p>
                    </div>
                  </div>

                  {/* URL fallback */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="god-image-url"
                      className="text-xs text-muted-foreground"
                    >
                      Or paste image URL
                    </Label>
                    <Input
                      id="god-image-url"
                      value={newGodImage.startsWith("data:") ? "" : newGodImage}
                      onChange={(e) => {
                        setNewGodImage(e.target.value);
                        setNewGodImagePreview(
                          e.target.value.trim() ? e.target.value.trim() : null,
                        );
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="text-sm"
                    />
                  </div>
                </div>

                <Button
                  data-ocid="god.submit_button"
                  onClick={handleAddCustomGod}
                  className="w-full"
                >
                  Add God
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Edit Custom God Dialog */}
      <Dialog
        open={editGodDialogOpen}
        onOpenChange={(open) => {
          setEditGodDialogOpen(open);
          if (!open) {
            setEditNameError("");
            setEditMantraError("");
          }
        }}
      >
        <DialogContent data-ocid="god.edit.dialog">
          <DialogHeader>
            <DialogTitle>Edit Custom God</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-god-name">
                God Name <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                data-ocid="god.edit.input"
                id="edit-god-name"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  if (editNameError) setEditNameError("");
                }}
                placeholder="Enter god name"
                className={
                  editNameError
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {editNameError && (
                <p
                  data-ocid="god.edit.name.error_state"
                  className="text-sm text-red-500 mt-1"
                >
                  {editNameError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-god-mantra">
                Mantra <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                data-ocid="god.edit.textarea"
                id="edit-god-mantra"
                value={editMantra}
                onChange={(e) => {
                  setEditMantra(e.target.value);
                  if (editMantraError) setEditMantraError("");
                }}
                placeholder="Enter mantra"
                className={
                  editMantraError
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {editMantraError && (
                <p
                  data-ocid="god.edit.mantra.error_state"
                  className="text-sm text-red-500 mt-1"
                >
                  {editMantraError}
                </p>
              )}
            </div>

            {/* Photo Browse Section */}
            <div className="space-y-3">
              <Label>God Photo</Label>
              <div className="flex items-center gap-4">
                {/* Preview */}
                <div className="h-20 w-20 shrink-0 rounded-full overflow-hidden border-2 border-terracotta/50 shadow-md bg-muted/40 flex items-center justify-center">
                  {editImagePreview ? (
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="h-7 w-7 text-muted-foreground/50" />
                  )}
                </div>

                {/* Browse button */}
                <div className="flex-1 space-y-2">
                  <input
                    ref={editFileInputRef}
                    id="edit-god-image-file"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleEditFileSelect}
                  />
                  <Button
                    data-ocid="god.edit.upload_button"
                    type="button"
                    variant="outline"
                    className="w-full gap-2 border-dashed border-terracotta/40 hover:border-terracotta/70 hover:bg-terracotta/5 transition-all"
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 text-terracotta" />
                    Browse from Device
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    JPG, PNG, WebP supported
                  </p>
                </div>
              </div>

              {/* URL fallback */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-god-image-url"
                  className="text-xs text-muted-foreground"
                >
                  Or paste image URL
                </Label>
                <Input
                  id="edit-god-image-url"
                  value={editImage.startsWith("data:") ? "" : editImage}
                  onChange={(e) => {
                    setEditImage(e.target.value);
                    setEditImagePreview(
                      e.target.value.trim() ? e.target.value.trim() : null,
                    );
                    if (editFileInputRef.current)
                      editFileInputRef.current.value = "";
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                data-ocid="god.edit.cancel_button"
                variant="outline"
                className="flex-1"
                onClick={() => setEditGodDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                data-ocid="god.edit.save_button"
                className="flex-1"
                onClick={handleSaveEdit}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Storage Limit Dialog — shown when truly full */}
      <StorageLimitDialog />
    </div>
  );
}
