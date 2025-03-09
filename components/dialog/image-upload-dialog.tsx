/* eslint-disable @typescript-eslint/no-explicit-any */
// @flow
import { HelpCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useDropzone } from "react-dropzone";
// import { User } from "@/types/main";
import { toast } from "sonner";

import { UploadGenotype } from "@/app/actions/auth.actions";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
type Props = {
  trigger: React.ReactNode;
  dialogTitle: string;
  showAction?: boolean;
  performAction?: boolean;
  pathname: string;
  name: string;
  form: any;
};
export type UploadedFile = {
  file: File;
  preview: string;
  size: number;
  name: string;
  date: Date;
};
export const ImageUploadDialog = (props: Props) => {
  const pathname = usePathname();
  const [thumbnail, setThumbail] = React.useState<UploadedFile[]>([]);
  const [isPending, startTransition] = React.useTransition();

  const [openImageDialog, setOpenImageDialog] = React.useState(false);
  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      accept: {
        "application/pdf": [],
        "image/jpeg": [],
        "image/png": [],
        "image/jpg": [],
      },
      onDrop: (acceptedFiles) => {
        // if (!setValue) {
        //   console.error(
        //     "setValue is not defined. Make sure you're using react-hook-form."
        //   );
        //   return;
        // }
        props.form.setValue(props.name, acceptedFiles[0], {
          shouldValidate: true,
        });
        const updatedFiles = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          size: file.size,
          name: file.name,
          date: new Date(),
        }));

        setThumbail((prevFiles) => [...prevFiles, ...updatedFiles]); // Add new files to existing ones
        if (!props.performAction) {
          setOpenImageDialog(false);
        }
      },
    });

  console.log(thumbnail);

  const handleSubmit = () => {
    startTransition(async () => {
      if (props.performAction) {
        const formData = new FormData();
        formData.append("upload_result", thumbnail[0].file);

        await UploadGenotype(formData, pathname).then((data) => {
          if (data?.error) {
            toast(data.error);
          }
          if (data?.invalid) {
            data.invalid.forEach((error) => toast(error));
          }

          if (data?.message) {
            toast(data.message);
          }

          if (data?.success) {
            setOpenImageDialog(false);
            toast(data.success);
          }
        });
      }
    });
  };
  return (
    <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
      <DialogTrigger>{props.trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.dialogTitle}</DialogTitle>
        </DialogHeader>
        <div>
          <div className="space-y-6">
            {/* <label className="font-poppins text-sm font-medium">
              Upload Photo
            </label> */}
            <div
              {...getImageRootProps({
                className:
                  "border dark:light-border-2 bg-white dark:bg-transparent flex flex-col items-center justify-center gap-4 border-dashed h-[216px] border-[#CCCCCC] rounded-[4px] py-[33px] px-[14px] cursor-pointer",
              })}
            >
              <Image
                alt="Upload Icon"
                src="/assets/images/upload.png"
                width={94}
                height={94}
                className="size-[94px] object-contain"
              />
              <input {...getImageInputProps()} />
              <div className="space-y-1">
                <Button
                  type="button"
                  variant={"link"}
                  //   disabled={isPending}
                  className="h-fit border-none bg-transparent p-0 text-xs font-normal text-primary underline shadow-none"
                >
                  Click here to choose a file
                </Button>
                <p className="max-w-[225px] text-center text-xs text-[#2d2d2d]/60 dark:text-light-400">
                  or drag a file in here{" "}
                </p>
              </div>
            </div>
            {thumbnail.length > 0 && (
              <div className="relative mt-4 flex flex-col items-start gap-2 rounded-md border border-[#F3A218] bg-[#FEF6E7] px-3 py-2">
                {/* <p className="text-sm font-medium">File Preview:</p> */}
                <div className="flex items-center gap-4">
                  {/* <Image
                    src={thumbnail[0].preview}
                    alt="pdf"
                    width={32}
                    height={32}
                    className="size-[45px] object-cover object-top"
                  /> */}

                  <div>
                    <p className="text-sm font-medium">File Preview:</p>
                    <p className="text-xs font-normal">
                      {thumbnail[0]?.name} |{" "}
                      {(thumbnail[0]?.size / 1024).toFixed(2)} KB |{" "}
                      {/* {formatDate(new Date(thumbnail[0]?.date))} */}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {props.showAction && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="size-4 text-[#8E8E93]" />
                  <span className="text-sm font-normal text-[#8E8E93]">
                    Help center
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <DialogClose>
                    <Button className="border-none bg-[#E4E4E4] text-black shadow-none hover:text-white">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="flex items-center"
                  >
                    {isPending && (
                      <Loader2 className="me-2 size-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
