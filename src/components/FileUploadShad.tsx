import { AlertCircleIcon, ImageUpIcon, XIcon, UploadIcon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Drawer, DrawerHeader, DrawerFooter, Button, Input, Select, SelectItem, DrawerContent } from "@heroui/react";
import { fileStore } from "@/store/fileStore";
import { TrainingStore } from "@/store/trainingStore";
import { useState, useEffect } from "react";
import { userStore } from "@/store/userStore";
import { useTheme } from "@/contexts/ThemeContext";

export default function FileUploadShad({
  isOpen,
  setIsOpen,
  onUpload,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onUpload: () => void;
}) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedTrainingId, setSelectedTrainingId] = useState("");
  const { uploadFile } = fileStore();
  const { trainings, loadTrainingByTeamId } = TrainingStore();
  const { user } = userStore();
  const { theme } = useTheme();
  const [{ files, isDragging, errors }, { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      maxSize,
    });

  const previewUrl = files[0]?.preview || null;

  useEffect(() => {
    if (user?.team_id && isOpen) {
      loadTrainingByTeamId(user.team_id, 50, 0);
    }
  }, [user?.team_id, isOpen, loadTrainingByTeamId]);

  useEffect(() => {
    if (files[0]?.file) {
      setFileName(files[0].file.name);
    }
  }, [files]);

  const handleUpload = async () => {
    if (!files[0]?.file || !(files[0].file instanceof File)) return;

    setIsUploading(true);
    try {
      // Create a new file with the custom name if it's different
      let fileToUpload = files[0].file;
      if (fileName && fileName !== files[0].file.name) {
        fileToUpload = new File([files[0].file], fileName, { type: files[0].file.type });
      }

      await uploadFile(fileToUpload, selectedTrainingId || undefined);
      onUpload();
      setIsOpen(false);
      removeFile(files[0].id);
      setFileName("");
      setSelectedTrainingId("");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Drawer
      size="2xl"
      isOpen={isOpen}
      backdrop="blur"
      onOpenChange={setIsOpen}
      placement="right"
      className={`${theme === "dark" ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-zinc-200"}`}
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-4 p-8">
          <h2 className="text-2xl font-bold">Upload File</h2>
          <div className="flex flex-col gap-4 w-full h-full">
            <div className="relative">
              {/* Drop area */}
              <div
                role="button"
                onClick={openFileDialog}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
              >
                <input {...getInputProps()} className="sr-only" aria-label="Upload file" />
                {previewUrl ? (
                  <div className="absolute inset-0">
                    <img src={previewUrl} alt={files[0]?.file?.name || "Uploaded image"} className="size-full object-cover" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-1 text-center">
                    <div className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
                      <ImageUpIcon className="size-4 opacity-60" />
                    </div>
                    <p className="mb-1.5 text-sm font-medium">Drop your image here or click to browse</p>
                    <p className="text-muted-foreground text-xs">Max size: {maxSizeMB}MB</p>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center gap-2 absolute bottom-4 right-4">
                  {previewUrl && (
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                        onClick={() => removeFile(files[0]?.id)}
                        aria-label="Remove image"
                      >
                        <XIcon className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                  {errors.length > 0 && (
                    <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
                      <AlertCircleIcon className="size-3 shrink-0" />
                      <span>{errors[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* File settings */}
            {files[0] && (
              <div className="flex flex-col gap-4 mt-4">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    File Name
                  </label>
                  <Input
                    placeholder="Enter file name"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    classNames={{
                      base: "max-w-full",
                      input: theme === "dark" ? "bg-transparent text-white placeholder:text-zinc-500" : "bg-transparent text-zinc-900 placeholder:text-zinc-400",
                      inputWrapper: theme === "dark" 
                        ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-800/80 data-[hover=true]:bg-zinc-800/80 group-data-[focus=true]:bg-zinc-800 group-data-[focus=true]:border-indigo-400" 
                        : "bg-white border-zinc-300 hover:bg-zinc-50 data-[hover=true]:bg-zinc-50 group-data-[focus=true]:bg-white group-data-[focus=true]:border-indigo-500",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Training Session Assignment (Optional)
                  </label>
                  <Select
                    placeholder="Select a training session"
                    selectedKeys={selectedTrainingId ? [selectedTrainingId] : []}
                    onChange={(e) => setSelectedTrainingId(e.target.value)}
                    classNames={{
                      base: "max-w-full",
                      trigger: theme === "dark"
                        ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-800/80 text-white data-[hover=true]:bg-zinc-800/80"
                        : "bg-white border-zinc-300 hover:bg-zinc-50 text-zinc-900 data-[hover=true]:bg-zinc-50",
                      value: theme === "dark" ? "text-white" : "text-zinc-900",
                      popoverContent: theme === "dark" ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-zinc-200",
                      listboxWrapper: "max-h-[200px]",
                    }}
                  >
                    {trainings.map((training) => (
                      <SelectItem 
                        key={training.id || ""}
                        className={theme === "dark" ? "text-white" : "text-zinc-900"}
                      >
                        {training.session_name} - {new Date(training.date).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            )}
          </div>
        </DrawerHeader>
        <DrawerFooter className="p-6 pt-0">
          <Button
            color="danger"
            variant="light"
            onPress={() => {
              files.forEach((f) => removeFile(f.id));
              setFileName("");
              setSelectedTrainingId("");
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleUpload}
            isDisabled={!files.length || isUploading}
            isLoading={isUploading}
            startContent={!isUploading && <UploadIcon className="w-4 h-4" />}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
