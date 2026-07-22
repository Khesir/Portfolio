import {useRef, useState} from 'react';
import {cmsUploadImage} from '@/app/api/cms';
import {toast} from 'sonner';

interface ImageUploadProps {
	value: string;
	onChange: (url: string) => void;
	placeholder?: string;
	uploadImage?: (file: File) => Promise<string>;
}

export default function ImageUpload({
	value,
	onChange,
	placeholder = 'https://...',
	uploadImage = cmsUploadImage,
}: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const url = await uploadImage(file);
			onChange(url);
		} catch {
			toast.error('Image upload failed');
		} finally {
			setUploading(false);
			if (fileRef.current) fileRef.current.value = '';
		}
	};

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
			<div style={{display: 'flex', gap: 8}}>
				<input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					style={{
						flex: 1,
						background: 'rgba(255,255,255,.03)',
						border: '1px solid var(--line)',
						borderRadius: 9, padding: '10px 13px',
						fontFamily: 'var(--sans)', fontSize: 14,
						color: 'var(--ink)', outline: 'none',
					}}
				/>
				<button
					type="button"
					className="btn-ol"
					disabled={uploading}
					onClick={() => fileRef.current?.click()}
				>
					{uploading ? 'Uploading...' : 'Upload'}
				</button>
				<input
					ref={fileRef}
					type="file"
					accept="image/*"
					style={{display: 'none'}}
					onChange={handleFile}
				/>
			</div>
			{value && (
				<img
					src={value}
					alt="preview"
					style={{
						height: 80, width: 'auto', objectFit: 'cover',
						borderRadius: 10, border: '1px solid var(--line-2)',
					}}
				/>
			)}
		</div>
	);
}
