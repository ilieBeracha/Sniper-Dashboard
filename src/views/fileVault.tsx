import Header from "@/Headers/Header";
import { SpPage, SpPageBody, SpPageDivider, SpPageHeader } from "@/layouts/SpPage";
import { fileStore } from "@/store/fileStore";
import { useEffect, useState } from "react";
import { FileText, Upload } from "lucide-react";
import FileRecents from "@/components/FileRecents";
import BaseButton from "@/components/base/BaseButton";
import FileUploadShad from "@/components/FileUploadShad";
import FileExplorerTable from "@/components/FileExplorerTable";

export default function FileVault() {
  const { getBucketFiles, getRecentFiles, recentFiles } = fileStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getBucketFiles();
    getRecentFiles();
  }, []);

  return (
    <SpPage>
      <Header />
      <SpPageHeader
        title="File Vault"
        subtitle="Upload and manage your files"
        icon={<FileText className="w-5 h-5" />}
        button={[
          <BaseButton style="purple" className="flex items-center" onClick={() => setIsOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </BaseButton>,
        ]}
      />

      <SpPageDivider />

      <SpPageBody>
        <div className="flex flex-col gap-4 sm:gap-6 h-full w-full px-2 sm:px-0">
          <FileUploadShad isOpen={isOpen} setIsOpen={setIsOpen} />
          
          {/* Recent Files Section */}
          <section className="w-full">
            <FileRecents recentFiles={recentFiles} />
          </section>
          
          {/* File Explorer Section */}
          <section className="w-full">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                File Explorer
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Browse and manage all your files and folders
              </p>
            </div>
            <FileExplorerTable />
          </section>
        </div>
      </SpPageBody>
    </SpPage>
  );
}
