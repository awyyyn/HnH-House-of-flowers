import { useEditor, EditorContent, Editor, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Heading1,
	Heading2,
	Heading3,
	Italic,
	List,
	ListOrdered,
	Redo,
	Strikethrough,
	Underline,
	Undo,
} from "lucide-react";
import UnderlineExe from "@tiptap/extension-underline";
import BulletExe from "@tiptap/extension-bullet-list";
import ListItemExe from "@tiptap/extension-list-item";
import OrderedListExe from "@tiptap/extension-ordered-list";
// import { MdFormatListBulleted } from "react-icons/md";
import { Button } from "@/components";

interface RichTextEditorProps {
	handleValue: (editor: Editor) => void;
	editable?: boolean;
	content?: string;
	isEditing?: boolean;
}

export const RichTextEditor = ({
	handleValue,
	editable = false,
	content,
}: // isEditing = false,
RichTextEditorProps) => {
	const editor = useEditor({
		autofocus: false,
		extensions: [
			BulletExe,
			ListItemExe,
			OrderedListExe,
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
		],
		editorProps: {
			attributes: {
				class:
					"prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
			},
		},
		editable: editable,
		// injectCSS: true,
		content: content
			? `${generateHTML(JSON.parse(String(content)), [
					UnderlineExe,
					BulletExe,
					ListItemExe,
					OrderedListExe,
					StarterKit.configure({
						heading: {
							levels: [1, 2, 3],
						},
					}),
			  ])}`
			: "",
		onTransaction: ({ editor }) => handleValue(editor),
	});

	return (
		<div
			className={`${
				editable &&
				"bg-blue-50/50   border dark:bg-zinc-900  dark:border-transparent border-stone-200 "
			}  rounded-lg overflow-hidden w-full`}>
			{editable && (
				<div className="space-x-0.5  p-1.5 dark:bg-zinc-900 dark:border-zinc-950  bg-white border-b pb-1.5 flex items-center">
					<Button
						type="button"
						variant={"ghost"}
						size="icon"
						className="dark:bg-zinc-900"
						disabled={!editor?.can().undo()}
						onClick={() => editor?.commands.undo()}>
						<Undo />
					</Button>
					<Button
						type="button"
						variant={"ghost"}
						size="icon"
						className="dark:bg-zinc-900"
						disabled={!editor?.can().redo()}
						onClick={() => editor?.commands.redo()}>
						<Redo />
					</Button>
					<div className="w-0.5 bg-stone-300 h-6 mx-2"></div>

					<Button
						type="button"
						variant={"ghost"}
						size="icon"
						className={
							editor?.isActive("heading", { level: 1 })
								? "bg-gray-100 dark:bg-primary/50"
								: ""
						}
						onClick={() =>
							editor?.chain().focus().toggleHeading({ level: 1 }).run()
						}>
						<Heading1 />
					</Button>
					<Button
						type="button"
						variant={"ghost"}
						size="icon"
						className={
							editor?.isActive("heading", { level: 2 })
								? "bg-gray-100 dark:bg-primary/50"
								: ""
						}
						onClick={() =>
							editor?.chain().focus().toggleHeading({ level: 2 }).run()
						}>
						<Heading2 />
					</Button>
					<Button
						type="button"
						variant={"ghost"}
						size="icon"
						className={
							editor?.isActive("heading", { level: 3 })
								? "bg-gray-100 dark:bg-primary/50"
								: ""
						}
						onClick={() =>
							editor?.chain().focus().toggleHeading({ level: 3 }).run()
						}>
						<Heading3 />
					</Button>
					<div className="w-0.5 bg-stone-300 h-6 mx-2"></div>
					<Button
						type="button"
						variant={"ghost"}
						size="icon"
						className={
							editor?.isActive("bold") ? "bg-gray-100 dark:bg-primary/50" : ""
						}
						onClick={() => editor?.chain().focus().toggleBold().run()}>
						<Bold />
					</Button>
					<Button
						type="button"
						variant={"ghost"}
						size="icon"
						className={
							editor?.isActive("italic") ? "bg-gray-100 dark:bg-primary/50" : ""
						}
						onClick={() => editor?.chain().focus().toggleItalic().run()}>
						<Italic />
					</Button>
					<Button
						type="button"
						variant={"ghost"}
						size="icon"
						className={
							editor?.isActive("underline")
								? "bg-gray-100 dark:bg-primary/50"
								: ""
						}
						onClick={() => editor?.chain().focus().toggleUnderline().run()}>
						<Underline />
					</Button>
					<Button
						type="button"
						variant={"ghost"}
						size="icon"
						className={
							editor?.isActive("strike") ? "bg-gray-100 dark:bg-primary/50" : ""
						}
						onClick={() => editor?.chain().focus().toggleStrike().run()}>
						<Strikethrough />
					</Button>
					<div className="w-0.5 bg-stone-300 h-6"></div>
					<Button
						type="button"
						variant={"ghost"}
						size="icon"
						className={
							editor?.isActive("bulletList")
								? "bg-gray-100 dark:bg-primary/50"
								: ""
						}
						onClick={() => editor?.chain().focus().toggleBulletList().run()}>
						<List />
					</Button>
					<Button
						type="button"
						variant={"ghost"}
						size="icon"
						className={
							editor?.isActive("orderedList")
								? "bg-gray-100 dark:bg-primary/50"
								: ""
						}
						onClick={() => {
							editor?.chain().focus().toggleOrderedList().run();
						}}>
						<ListOrdered />
					</Button>
				</div>
			)}
			<EditorContent
				placeholder="Description here..."
				editor={editor}
				id="richTextEditor"
				name="description"
				onClick={() => editor?.chain().focus()}
				style={{}}
				className={` cursor-text  p-1.5 rounded-md ${
					editable && " "
				} min-h-[100px] w-full   `}
			/>
		</div>
	);
};
