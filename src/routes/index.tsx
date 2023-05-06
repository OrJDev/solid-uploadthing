import { type VoidComponent } from "solid-js";
import { generateSolidHelpers } from "~/utils/uploadthing";
import type { OurFileRouter } from "./api/uploadthing/core";

const { useUploadThing } = generateSolidHelpers<OurFileRouter>();

const Home: VoidComponent = () => {
  const { getRootProps, getInputProps, files, startUpload } =
    useUploadThing("imageUploader");
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div>
        {files().length > 0 && (
          <button onClick={() => startUpload()}>
            Upload {files().length} files
          </button>
        )}
      </div>
      Drop files here!
    </div>
  );
};

export default Home;
