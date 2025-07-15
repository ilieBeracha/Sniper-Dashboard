import Header from "@/Headers/Header";
import { SpPage, SpPageBody, SpPageDivider, SpPageHeader } from "@/layouts/SpPage";
import { fileStore } from "@/store/fileStore";
import { useEffect } from "react";
import { FileText, Upload } from "lucide-react";
import FileRecents from "@/components/FileRecents";
import BaseButton from "@/components/base/BaseButton";
import FileUploadShad from "@/components/FileUploadShad";

export default function FileVault() {
  const { getBucketFiles, getRecentFiles, recentFiles } = fileStore();
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
          <BaseButton style="purple" className="flex items-center" onClick={() => {}}>
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </BaseButton>,
        ]}
      />

      <SpPageDivider />

      <SpPageBody>
        <div className="grid grid-cols-12 gap-4 h-full w-full">
          <div className="col-span-12 md:col-span-12 h-full w-full flex flex-col gap-4">
            <FileUploadShad />
            <FileRecents recentFiles={recentFiles} />
          </div>
          <div className="col-span-12 md:col-span-3 h-full w-full flex flex-col gap-4 hidden md:flex"></div>
        </div>
      </SpPageBody>
    </SpPage>
  );
}
