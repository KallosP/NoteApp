import {Plus} from "lucide-react";

const AddButton = ({onClick}) => {
	return (
		<button onClick={onClick} className="add-button">
			<Plus size={25} />
		</button>
	);
};

export default AddButton;
