import {useState, useEffect, useRef} from "react";
import {Check} from "lucide-react";

const NoteEditor = ({note, isOpen, onClose, onSave}) => {
	const modalRef = useRef(null);
	const [editedTitle, setEditedTitle] = useState(note.title);
	const [editedContent, setEditedContent] = useState(note.content);

	useEffect(() => {
		setEditedTitle(note.title);
		setEditedContent(note.content);
	}, [note]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			// Check if the click is outside lil enter text
			if (isOpen && !modalRef.current?.contains(event.target)) {
				const updatedNote = {
					...note,
					title: editedTitle,
					content: editedContent
				};
				onSave(updatedNote);
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, editedTitle, editedContent, note, onSave, onClose]);

	const handleCloseClick = () => {
		const updatedNote = {
			...note,
			title: editedTitle,
			content: editedContent
		};
		onSave(updatedNote);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div ref={modalRef} className="bg-white rounded-lg w-full max-w-2xl shadow-xl">
				<div className="p-4 border-b flex justify-between items-center">
					<input
						type="text"
						value={editedTitle}
						onChange={(e) => setEditedTitle(e.target.value)}
						className="text-xl font-semibold focus:outline-none w-full"
					/>
					<button onClick={handleCloseClick} className="p-2 hover:bg-gray-100 rounded-full">
						<Check size={20} />
					</button>
				</div>
				<div className="p-4">
					<textarea
						value={editedContent}
						onChange={(e) => setEditedContent(e.target.value)}
						className="w-full h-64 focus:outline-none resize-none"
						placeholder="Write your note here..."
						autoFocus
					/>
				</div>
			</div>
		</div>
	);
};

export default NoteEditor;
