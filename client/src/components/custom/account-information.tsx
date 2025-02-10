import { FileUpload } from "../aceternity/file-upload";

export default function AccountInformation() {
	return (
		<div className="mx-auto bg-red-400 sm:max-w-[80%]">
			<FileUpload onChange={(files) => console.log(files)} />
		</div>
	);
}
