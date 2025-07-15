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
        <div className="flex flex-col gap-6 h-full w-full">
          <FileUploadShad isOpen={isOpen} setIsOpen={setIsOpen} />
          <FileRecents recentFiles={recentFiles} />
          <FileExplorerTable />
        </div>
      </SpPageBody>
    </SpPage>
  );
}
