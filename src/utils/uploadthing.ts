import { createSignal } from "solid-js";
import { DANGEROUS__uploadFiles } from "uploadthing/client";
import type { FileRouter } from "uploadthing/server";
import { createDropzone, type OnDropHandler } from "solidjs-dropzone";

type TFile = {
  file: File;
  contents: string;
};

export const generateSolidHelpers = <TRouter extends FileRouter>() => {
  const useUploadThing = (
    endpoint: keyof TRouter extends string ? keyof TRouter : string
  ) => {
    const [files, setFiles] = createSignal<Array<TFile>>([]);
    const resetFiles = () => setFiles([]);

    const onDrop: OnDropHandler = (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          const binaryStr = reader.result;
          if (typeof binaryStr === "object" || !binaryStr) return;
          console.log("file stuff?", file);
          setFiles((currentFiles) => [
            ...currentFiles,
            { file, contents: binaryStr },
          ]);
        };
        reader.readAsDataURL(file);
      });
    };

    const { getRootProps, getInputProps, isDragActive } = createDropzone({
      onDrop,
      useFsAccessApi: true,
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpeg", ".jpg"],
        "image/gif": [".gif"],
        "video/mp4": [".mp4"],
        "video/webm": [".webm"],
        "video/mov": [".mov"],
        "audio/mpeg": [".mp3"],
        "audio/ogg": [".ogg"],
        "audio/wav": [".wav"],
        "audio/webm": [".webm"],
      },
      noClick: true,
    });

    const startUpload = async () => {
      const newfiles = files().map((f) => f.file);
      console.log("newfiles", newfiles);
      const resp = await DANGEROUS__uploadFiles(newfiles, endpoint, {
        url: void 0,
      });
      setFiles([]);
      return resp;
    };

    return {
      getRootProps,
      getInputProps,
      isDragActive,
      files,
      resetFiles,
      startUpload,
    };
  };
  return {
    useUploadThing,
    uploadFiles: DANGEROUS__uploadFiles,
  };
};
