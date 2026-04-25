import {useState} from "react";
import {Star, FileText, Trash2, Plus, Folder} from "lucide-react";

const Sidebar = ({
	user,
	notes,
	activeGroup,
	setActiveGroup,
	onCreateGroup,
	onDeleteGroup,
	groups
}) => {
	const [isAddingGroup, setIsAddingGroup] = useState(false);
	const [newGroupName, setNewGroupName] = useState("");
	const [hoveredGroup, setHoveredGroup] = useState(null);

	const categoryCounts = {
		favorites: notes.filter((note) => note.isFavorite && !note.isDeleted).length,
		all: notes.filter((note) => !note.isDeleted).length,
		trash: notes.filter((note) => note.isDeleted).length,
		groups: {}
	};

	groups.forEach((group) => {
		categoryCounts.groups[group.id] = notes.filter(
			(note) => note.groupId === group.id && !note.isDeleted
		).length;
	});

	const handleCreateGroup = () => {
		if (newGroupName.trim()) {
			onCreateGroup(newGroupName);
			setNewGroupName("");
			setIsAddingGroup(false);
		}
	};

	const handleDeleteGroup = (e, group) => {
		e.stopPropagation();
		onDeleteGroup(group);
		if (activeGroup === group.id) {
			setActiveGroup("all");
		}
	};

	return (
		<aside className="sidebar w-64 bg-white border-r h-full flex flex-col">
			<div className="user-profile p-4 border-b flex items-center space-x-3">
				<div className="avatar w-10 h-10 bg-gray-200 rounded-full"></div>
				<span className="font-semibold">{user}</span>
			</div>

			<nav className="nav p-2">
				<SidebarButton
					icon={<Star size={18} />}
					label="Favorites"
					count={categoryCounts.favorites}
					isActive={activeGroup === "favorites"}
					onClick={() => setActiveGroup("favorites")}
				/>

				<SidebarButton
					icon={<FileText size={18} />}
					label="All Notes"
					count={categoryCounts.all}
					isActive={activeGroup === "all"}
					onClick={() => setActiveGroup("all")}
				/>

				<SidebarButton
					icon={<Trash2 size={18} />}
					label="Trash"
					count={categoryCounts.trash}
					isActive={activeGroup === "trash"}
					onClick={() => setActiveGroup("trash")}
				/>
			</nav>

			<div className="groups-section p-2 flex-grow">
				<div className="groups-header flex justify-between items-center mb-2">
					<span className="font-semibold">Note Groups</span>
					<button
						className="button small p-1 hover:bg-gray-100 rounded"
						onClick={() => setIsAddingGroup(!isAddingGroup)}>
						<Plus size={18} />
					</button>
				</div>

				{isAddingGroup && (
					<div className="new-group-input flex mb-2">
						<input
							type="text"
							placeholder="Group name"
							value={newGroupName}
							onChange={(e) => setNewGroupName(e.target.value)}
							className="border rounded p-1 mr-1 flex-grow"
						/>
						<button onClick={handleCreateGroup} className="bg-blue-500 text-white rounded p-1">
							<Plus size={16} color="white" />
						</button>
					</div>
				)}

				{groups.map((group) => (
					<div
						key={group.id}
						className="relative group"
						onMouseEnter={() => setHoveredGroup(group.id)}
						onMouseLeave={() => setHoveredGroup(null)}>
						<button
							onClick={() => setActiveGroup(group.id)}
							className={`
                nav-item flex justify-between items-center w-full p-2 rounded
                ${activeGroup === group.id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}
              `}>
							<div className="flex items-center space-x-2">
								<Folder size={18} />
								<span>{group.name}</span>
							</div>
							<div className="flex items-center space-x-2">
								{hoveredGroup === group.id && (
									<button
										onClick={(e) => handleDeleteGroup(e, group)}
										className="p-1 hover:bg-gray-200 rounded transition-colors">
										<Trash2 size={14} className="text-gray-500 hover:text-red-500" />
									</button>
								)}
								{categoryCounts.groups[group.id] > 0 && (
									<span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5">
										{categoryCounts.groups[group.id]}
									</span>
								)}
							</div>
						</button>
					</div>
				))}
			</div>
		</aside>
	);
};

const SidebarButton = ({icon, label, count, isActive, onClick}) => (
	<button
		onClick={onClick}
		className={`
      nav-item flex justify-between items-center w-full p-2 rounded
      ${isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}
    `}>
		<div className="flex items-center space-x-2">
			{icon}
			<span>{label}</span>
		</div>
		{count > 0 && (
			<span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5">{count}</span>
		)}
	</button>
);

export default Sidebar;
