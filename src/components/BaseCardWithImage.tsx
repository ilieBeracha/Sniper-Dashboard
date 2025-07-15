import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";

export default function BaseCardWithImage({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  const fileType = image?.split(".").pop()?.toLowerCase();

  return (
    <Card className={`${theme === "dark" ? "bg-zinc-900/50" : "bg-white/50"}`} shadow="lg" radius="lg" isHoverable={isMobile}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{subtitle}</p>
        <small className="text-default-500">{subtitle}</small>
        <h4 className="font-bold text-large">{title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        {fileType === "pdf" ? (
          <img alt="Card background" className="object-cover rounded-xl w-full" src={image} />
        ) : fileType === "docx" || fileType === "doc" ? (
          <img alt="Card background" className="object-cover rounded-xl w-full" src={image} />
        ) : fileType === "xls" || fileType === "xlsx" ? (
          <img alt="Card background" className="object-cover rounded-xl w-full" src={image} />
        ) : fileType === "pptx" || fileType === "ppt" ? (
          <img alt="Card background" className="object-cover rounded-xl w-full" src={image} />
        ) : fileType === "jpg" || fileType === "jpeg" || fileType === "png" ? (
          <img alt="Card background" className="object-cover rounded-xl w-full" src={image} />
        ) : fileType === "txt" ? (
          <img alt="Card background" className="object-cover rounded-xl w-full" src={image} />
        ) : fileType === "csv" ? (
          <img alt="Card background" className="object-cover rounded-xl w-full" src={image} />
        ) : fileType === "json" ? (
          <img alt="Card background" className="object-cover rounded-xl w-full" src={image} />
        ) : (
          <img alt="Card background" className="object-cover rounded-xl w-full" src={image} />
        )}
      </CardBody>
      <CardFooter>
        <Button>View</Button>
      </CardFooter>
    </Card>
  );
}
