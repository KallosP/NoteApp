import {useState, useRef, useEffect} from "react";
import {Star, MoreHorizontal, Copy, Folder, Trash2, RotateCcw, Plus} from "lucide-react";

const NoteCard = ({
	note,
	groups,
	onToggleFavorite,
	onCopy,
	onAddToGroup,
	onMoveToTrash,
	onRestoreNote,
	onCreateGroup,
	onClick,
	isInTrash
}) => {
	const [showMenu, setShowMenu] = useState(false);
	const [showGroupMenu, setShowGroupMenu] = useState(false);
	const [newGroupName, setNewGroupName] = useState("");
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				(showMenu || showGroupMenu) &&
				menuRef.current &&
				!menuRef.current.contains(event.target)
			) {
				setShowMenu(false);
				setShowGroupMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showMenu, showGroupMenu]);

	const handleMoreClick = (e) => {
		e.stopPropagation();
		setShowMenu(!showMenu);
		setShowGroupMenu(false);
	};

	const handleNoteClick = () => {
		if (showMenu || showGroupMenu) {
			setShowMenu(false);
			setShowGroupMenu(false);
		} else {
			onClick();
		}
	};

	const handleCopy = (e) => {
		e.stopPropagation();
		onCopy(note);
		setShowMenu(false);
	};

	const handleAddToGroupClick = (e) => {
		e.stopPropagation();
		setShowGroupMenu(true);
		setShowMenu(false);
	};

	const handleGroupSelect = (e, groupId) => {
		e.stopPropagation();
		onAddToGroup(note, groupId);
		setShowGroupMenu(false);
	};

	const handleNewGroupCreate = (e) => {
		e.stopPropagation();
		if (newGroupName.trim()) {
			onCreateGroup(newGroupName);
			onAddToGroup(note, newGroupName.toLowerCase().replace(/\s+/g, "-"));
			setNewGroupName("");
			setShowGroupMenu(false);
		}
	};

	const handleRestoreOrTrash = (e) => {
		e.stopPropagation();
		isInTrash ? onRestoreNote(note) : onMoveToTrash(note);
		setShowMenu(false);
	};

	return (
		<div className="note-card cursor-pointer relative" onClick={handleNoteClick}>
			<div className="note-header">
				<h3>{note.title}</h3>
				<div className="note-actions">
					<button className="button small relative z-10" onClick={handleMoreClick}>
						<MoreHorizontal size={20} />
					</button>
					{showMenu && (
						<div
							ref={menuRef}
							className="absolute bg-white shadow-lg rounded p-2 right-0 top-0 mt-2 z-[100]">
							{!isInTrash ? (
								<button
									className="block w-full text-left hover:bg-gray-100 px-3 py-2 rounded flex items-center"
									onClick={handleCopy}>
									<Copy size={16} className="mr-2" />
									Copy
								</button>
							) : null}
							{!isInTrash ? (
								<button
									className="block w-full text-left hover:bg-gray-100 px-3 py-2 rounded flex items-center"
									onClick={handleAddToGroupClick}>
									<Folder size={16} className="mr-2" />
									Add to group
								</button>
							) : null}
							<button
								className="block w-full text-left hover:bg-gray-100 px-3 py-2 rounded flex items-center"
								onClick={handleRestoreOrTrash}>
								{isInTrash ? (
									<>
										<RotateCcw size={16} className="mr-2" />
										Restore
									</>
								) : (
									<>
										<Trash2 size={16} className="mr-2" />
										Move to trash
									</>
								)}
							</button>
						</div>
					)}
					{showGroupMenu && (
						<div
							ref={menuRef}
							className="absolute bg-white shadow-lg rounded p-2 right-0 top-0 mt-2 z-[100] w-64">
							<div className="flex items-center gap-1 px-2 mb-2">
								<input
									type="text"
									placeholder="Group name"
									value={newGroupName}
									onChange={(e) => setNewGroupName(e.target.value)}
									className="border rounded py-1 px-2 text-sm flex-1 min-w-0"
									onClick={(e) => e.stopPropagation()}
								/>
								<button
									onClick={handleNewGroupCreate}
									className="bg-blue-500 hover:bg-blue-600 text-white rounded p-1 flex-shrink-0"
									title="Add new group">
									<Plus size={16} color="white" />
								</button>
							</div>
							{groups.map((group) => (
								<button
									key={group.id}
									onClick={(e) => handleGroupSelect(e, group.id)}
									className="block w-full text-left hover:bg-gray-100 px-3 py-2 rounded flex items-center">
									<Folder size={16} className="mr-2" />
									{group.name}
								</button>
							))}
						</div>
					)}
					<button
						onClick={(e) => {
							e.stopPropagation();
							onToggleFavorite(note);
						}}
						className={`button small ${note.isFavorite ? "favorite" : ""}`}>
						<Star size={20} />
					</button>
				</div>
			</div>
			<div className="mt-2">
				{note.content && <p className="text-gray-600 text-sm line-clamp-3">{note.content}</p>}
			</div>
		</div>
	);
};

export default NoteCard;
