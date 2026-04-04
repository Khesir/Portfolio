import {useRef, useState} from 'react';
import {cmsUploadImage} from '@/app/api/cms';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/Button';
import {toast} from 'sonner';

interface ImageUploadProps {
	value: string;
	onChange: (url: string) => void;
	placeholder?: string;
}

export default function ImageUpload({
	value,
	onChange,
	placeholder = 'https://...',
}: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const url = await cmsUploadImage(file);
			onChange(url);
		} catch {
			toast.error('Image upload failed');
		} finally {
			setUploading(false);
			if (fileRef.current) fileRef.current.value = '';
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex gap-2">
				<Input
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="flex-1"
				/>
				<Button
					type="button"
					variant="outline"
					disabled={uploading}
					onClick={() => fileRef.current?.click()}
				>
					{uploading ? 'Uploading...' : 'Upload'}
				</Button>
				<input
					ref={fileRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleFile}
				/>
			</div>
			{value && (
				<img
					src={value}
					alt="preview"
					className="h-20 w-auto rounded border border-slate-200 dark:border-slate-700 object-cover"
				/>
			)}
		</div>
	);
}
