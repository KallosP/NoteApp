import {Trash2} from "lucide-react";

const EmptyTrashButton = ({onEmptyTrash}) => {
	return (
		<div className="absolute bottom-4 right-4 z-10">
			<button
				onClick={onEmptyTrash}
				className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
				<Trash2 size={20} />
				<span>Empty Trash</span>
			</button>
		</div>
	);
};

export default EmptyTrashButton;
