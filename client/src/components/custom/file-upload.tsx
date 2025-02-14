import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface FileUploadProps {
	onFileUpload: (files: File[]) => void;
	showText?: boolean;
}

export function FileUpload({
	onFileUpload,
	showText = false,
}: FileUploadProps) {
	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			onFileUpload(acceptedFiles);
		},
		[onFileUpload]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div
			{...getRootProps()}
			className={`flex flex-col items-center justify-center rounded-lg h-full w-full cursor-pointer transition-colors ${
				isDragActive
					? "border-primary bg-primary/10"
					: "border-muted-foreground/25 hover:border-primary"
			}`}>
			<input {...getInputProps()} accept="image/*" />
			<Upload className="w-10 h-10 text-muted-foreground mb-2" />
			{isDragActive ? (
				<p className="text-sm text-muted-foreground">Drop the files here ...</p>
			) : (
				<p
					className={`${
						showText ? "block" : "hidden"
					} text-sm text-muted-foreground`}>
					Drag & drop files here, or click to select files
				</p>
			)}
		</div>
	);
}
