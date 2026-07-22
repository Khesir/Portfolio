import {useRef, useState} from 'react';
import {toast} from 'sonner';

interface ImageGalleryProps {
	value: string[];
	onChange: (urls: string[]) => void;
	uploadImage: (file: File) => Promise<string>;
}

export default function ImageGallery({
	value,
	onChange,
	uploadImage,
}: ImageGalleryProps) {
	const [uploading, setUploading] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		if (!files.length) return;
		setUploading(true);
		try {
			const urls = await Promise.all(files.map((f) => uploadImage(f)));
			onChange([...value, ...urls]);
		} catch {
			toast.error('Image upload failed');
		} finally {
			setUploading(false);
			if (fileRef.current) fileRef.current.value = '';
		}
	};

	const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
			<div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
				{value.map((url, i) => (
					<div key={url + i} style={{position: 'relative'}}>
						<img
							src={url}
							alt=""
							style={{
								height: 80,
								width: 80,
								objectFit: 'cover',
								borderRadius: 10,
								border: '1px solid var(--line-2)',
							}}
						/>
						<button
							type="button"
							onClick={() => removeAt(i)}
							title="Remove"
							style={{
								position: 'absolute',
								top: -6,
								right: -6,
								width: 20,
								height: 20,
								borderRadius: '50%',
								border: '1px solid var(--line)',
								background: 'var(--panel-2)',
								color: 'var(--ink)',
								cursor: 'pointer',
								fontSize: 12,
								lineHeight: 1,
							}}
						>
							×
						</button>
					</div>
				))}
			</div>
			<div>
				<button
					type="button"
					className="btn-ol"
					disabled={uploading}
					onClick={() => fileRef.current?.click()}
				>
					{uploading ? 'Uploading...' : 'Add images'}
				</button>
				<input
					ref={fileRef}
					type="file"
					accept="image/*"
					multiple
					style={{display: 'none'}}
					onChange={handleFiles}
				/>
			</div>
		</div>
	);
}
