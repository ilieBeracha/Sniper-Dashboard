import Header from "@/Headers/Header";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import { fileStore } from "@/store/fileStore";
import { useEffect, useState } from "react";
import { FileText, Folder } from "lucide-react";
import BaseButton from "@/components/base/BaseButton";

export default function FileVault() {
  const { getBucketFiles } = fileStore();
  const [activeTab, setActiveTab] = useState("files");
  useEffect(() => {
    getBucketFiles();
  }, []);

  return (
    <SpPage>
      <Header />
      <SpPageHeader
        title="File Vault"
        subtitle="Upload and manage your files"
        icon={<FileText className="w-5 h-5" />}
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "File Vault", link: "/file-vault" },
        ]}
        button={[
          <BaseButton style="purple" onClick={() => {}}>
            Upload File
          </BaseButton>,
        ]}
      />
      <SpPageTabs
        tabs={[
          { id: "files", label: "Files", icon: FileText },
          { id: "folders", label: "Folders", icon: Folder },
        ]}
        activeTab="files"
        onChange={setActiveTab}
      />
      <SpPageBody>{activeTab === "files" ? "files" : "folders"}</SpPageBody>
    </SpPage>
  );
}
