import Header from "@/Headers/Header";
import { SpPage, SpPageBody, SpPageDivider, SpPageHeader } from "@/layouts/SpPage";
import { fileStore } from "@/store/fileStore";
import { teamStore } from "@/store/teamStore";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import FileRecents from "@/components/FileRecents";
import FileUploadShad from "@/components/FileUploadShad";
import FileExplorerTable from "@/components/FileExplorerTable";
import { useStore } from "zustand";

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

  return (
    <SpPage>
      <Header />
      <SpPageHeader
        title="File Vault"
        subtitle="Upload and manage your files"
        icon={<FileText className="w-5 h-5" />}
        dropdownItems={[{ label: "Upload File", onClick: () => setIsOpen(true) }]}
      />

      <SpPageDivider />

      <SpPageBody>
        <div className="flex flex-col gap-4 sm:gap-6 h-full w-full sm:px-0">
          <FileUploadShad isOpen={isOpen} setIsOpen={setIsOpen} onUpload={loadFiles} />

          {/* Recent Files Section */}
          <section className="w-full">
            <FileRecents />
          </section>

          {/* File Explorer Section */}
          <section className="w-full">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">File Explorer</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Browse and manage all your files and folders</p>
            </div>
            <FileExplorerTable />
          </section>
        </div>
      </SpPageBody>
    </SpPage>
  );
}
