import Header from "@/Headers/Header";
import { SpPage, SpPageBody, SpPageHeader } from "@/layouts/SpPage";
import { fileStore } from "@/store/fileStore";
import { teamStore } from "@/store/teamStore";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import FileQuickActions from "@/components/FileQuickActions";
import FileUploadShad from "@/components/FileUploadShad";
import FileExplorerTable from "@/components/FileExplorerTable";
import { useStore } from "zustand";
import { supabase } from "@/services/supabaseClient";

export default function FileVault() {
  const { getBucketFiles, getRecentFiles } = useStore(fileStore);
  const { teamId } = useStore(teamStore);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (teamId) {
      loadFiles();
    }
  }, [teamId]);

  const loadFiles = async () => {
    await getBucketFiles();
    await getRecentFiles();
  };

  const handleNewFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (folderName && folderName.trim()) {
      try {
        // Since Supabase doesn't support empty folders, we create a placeholder file
        const placeholderContent = new Blob([""], { type: "text/plain" });
        const placeholderFile = new File([placeholderContent], ".folder", { type: "text/plain" });

        // Upload the placeholder file to create the folder structure
        if (teamId) {
          const folderPath = `${teamId}/${folderName}/.folder`;

          const { error } = await supabase.storage.from("team-files").upload(folderPath, placeholderFile);

          if (error) {
            console.error("Error creating folder:", error);
            alert("Failed to create folder");
          } else {
            await loadFiles();
          }
        }
      } catch (err) {
        console.error("Error creating folder:", err);
        alert("Failed to create folder");
      }
    }
  };

  return (
    <SpPage>
      <Header breadcrumbs={[{ label: "File Vault", link: "/file-vault" }]} />
      <SpPageHeader
        title="File Vault"
        subtitle="Upload and manage your files"
        icon={FileText}
        action={[
          { label: "Upload File", onClick: () => setIsOpen(true) },
          { label: "New Folder", onClick: handleNewFolder },
        ]}
      />

      <SpPageBody>
        <div className="flex flex-col h-full w-full sm:px-0 pt-4">
          <FileUploadShad isOpen={isOpen} setIsOpen={setIsOpen} onUpload={loadFiles} />

          {/* Quick Actions */}
          <FileQuickActions onUploadClick={() => setIsOpen(true)} onNewFolderClick={handleNewFolder} />

          {/* File Explorer Section */}
          <section className="w-full">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">File explorer</h3>
            </div>
            <FileExplorerTable />
          </section>
        </div>
      </SpPageBody>
    </SpPage>
  );
}
