import Header from "@/Headers/Header";
import { SpPage, SpPageHeader } from "@/layouts/SpPage";
import { fileStore } from "@/store/fileStore";
import { useEffect } from "react";
import { FileText } from "lucide-react";
import BaseButton from "@/components/base/BaseButton";

export default function FileVault() {
  const { getBucketFiles } = fileStore();

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
    </SpPage>
  );
}
