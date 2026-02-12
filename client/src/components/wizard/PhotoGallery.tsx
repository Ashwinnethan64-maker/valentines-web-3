import { useRef, ChangeEvent } from 'react';
import { useWizardStore } from '../../store/wizardStore';
import { Upload, X } from 'lucide-react';

const PhotoGallery = () => {
    const { data, updateData } = useWizardStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            files.forEach(file => {
                // Limit size to 500KB for Vercel/DB compatibility
                if (file.size > 500 * 1024) {
                    alert(`File ${file.name} is too large (max 500KB). Please compress it.`);
                    return;
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    updateData({ photos: [...useWizardStore.getState().data.photos, { url: base64String }] });
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...data.photos];
        newPhotos.splice(index, 1);
        updateData({ photos: newPhotos });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-heading text-primary">Add your memories</h2>

            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/30 rounded-xl p-10 text-center cursor-pointer hover:bg-primary/5 transition"
            >
                <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Click to upload photos</p>
                <p className="text-sm text-gray-400">Supported: JPG, PNG</p>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.photos.map((photo, idx) => (
                    <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img src={photo.url} alt={`Memory ${idx}`} className="w-full h-full object-cover" />
                        <button
                            onClick={() => removePhoto(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoGallery;
