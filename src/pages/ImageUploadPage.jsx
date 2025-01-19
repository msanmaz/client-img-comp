import { ImageUploadContainer } from "../components/ImageUploadContainer";

export function ImageUploadPage() {

    return (
      <div className="container mx-auto p-6" data-testid="image-upload-page">
        <ImageUploadContainer/>
      </div>
    );
  }