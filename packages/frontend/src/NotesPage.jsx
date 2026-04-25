import {useState, useEffect} from "react";
import Sidebar from "./Components/Sidebar.jsx";
import NoteCard from "./Components/Notecard.jsx";
import AddButton from "./Components/AddButton.jsx";
import NoteEditor from "./Components/NoteEditor.jsx";
import EmptyTrashButton from "./Components/EmptyTrashButton.jsx";
import {useLocation} from "react-router-dom";
import backendURL from "./Constants/url-constants.jsx";

const NotesPage = ({addAuthHeader}) => {
	const location = useLocation();
	const {currUser, userCredId, token} = location.state || {};

	const [groups, setGroups] = useState([]);

	const [notes, setNotes] = useState([]);

	const [activeGroup, setActiveGroup] = useState("all");
	const [editingNote, setEditingNote] = useState(null);

	const toggleFavorite = (noteToUpdate) => {
		const updatedNoteAttempt = {...noteToUpdate, isFavorite: !noteToUpdate.isFavorite};
		updateNote(updatedNoteAttempt).then((updatedNote) => {
			setNotes(
				notes.map((note) =>
					note._id === updatedNote._id ? {...note, isFavorite: !note.isFavorite} : note
				)
			);
		});
	};

	const addNote = () => {
		const newNote = {
			title: `New Note`,
			content: "Content",
			isFavorite: false,
			isDeleted: false,
			groupId:
				activeGroup !== "all" && activeGroup !== "favorites" && activeGroup !== "trash"
					? activeGroup
					: "all",
			user: [userCredId]
		};
		// Add newNote to backend
		postNote(newNote).then((savedNote) => {
			// Only update FE if newNote was successfully added to BE
			setNotes([...notes, savedNote]);
			setEditingNote(savedNote);
		});
	};

	const handleNoteClick = (note) => {
		setEditingNote(note);
	};

	const handleNoteSave = (noteToUpdate) => {
		updateNote(noteToUpdate).then((updatedNote) => {
			setNotes(notes.map((note) => (note._id === updatedNote._id ? updatedNote : note)));
		});
	};

	const handleCreateGroup = (groupName) => {
		const newGroup = {
			id: groupName.toLowerCase().replace(/\s+/g, "-") + "-user-created",
			name: groupName,
			user: [userCredId]
		};

		getGroup(newGroup).then((result) => {
			// Create new group only if it does not exist
			if (result == undefined) {
				postGroup(newGroup).then((addedNewGroup) => {
					setGroups([...groups, addedNewGroup]);
				});
			} else {
				alert("Group already exists!");
			}
		});
	};

	const handleCopy = (note) => {
		const copiedNote = {
			title: `Copy of ${note.title}`,
			content: note.content,
			isFavorite: false,
			isDeleted: false,
			groupId: note.groupId,
			user: [userCredId]
		};
		// Add copiedNote to backend
		postNote(copiedNote).then((savedNote) => {
			// Only update FE if copiedNote was successfully added to BE
			setNotes([...notes, savedNote]);
			console.log("Copied note:", copiedNote);
		});
	};

	const handleAddToGroup = (note, groupId) => {
		const noteToAddGroup = {...note, groupId};
		updateNote(noteToAddGroup).then((updatedNote) => {
			setNotes(notes.map((n) => (n._id === updatedNote._id ? {...n, groupId} : n)));
			console.log("Added note to group:", updatedNote);
		});
	};

	const handleMoveToTrash = (note) => {
		const noteToDelete = {...note, isDeleted: true, isFavorite: false};
		updateNote(noteToDelete).then((updatedNote) => {
			setNotes(
				notes.map((n) =>
					n._id === updatedNote._id ? {...n, isDeleted: true, isFavorite: false} : n
				)
			);
			console.log("Moved note to trash:", updatedNote);
		});
	};

	const handleRestoreNote = (note) => {
		const noteToRestore = {...note, isDeleted: false};
		updateNote(noteToRestore).then((updatedNote) => {
			setNotes(notes.map((n) => (n._id === updatedNote._id ? {...n, isDeleted: false} : n)));
			console.log("Restored note:", note);
		});
	};

	const handleEmptyTrash = () => {
		// Filter all notes marked as deleted into notesToDelete
		const notesToDelete = notes.filter((note) => note.isDeleted);
		// Delete notes from FE only if successfully deleted from BE
		deleteNotes(notesToDelete).then(() => {
			setNotes(notes.filter((note) => !note.isDeleted));
		});
	};

	const handleDeleteGroup = (group) => {
		// Reset all notes that have this group assigned to them back to "all" (default group assigned to notes)
		const notesToUpdate = notes.filter((note) => note.groupId === group.id);
		updateFieldForManyNotes(notesToUpdate, "groupId", "all").then(() => {
			setNotes(notes.map((note) => (note.groupId === group.id ? {...note, groupId: "all"} : note)));
		});
		// Delete this group from BE then from FE
		deleteGroup(group).then(() => {
			setGroups(groups.filter((g) => g.id !== group.id));
		});
	};

	const filteredNotes = notes.filter((note) => {
		switch (activeGroup) {
			case "favorites":
				return note.isFavorite && !note.isDeleted;
			case "all":
				return !note.isDeleted;
			case "trash":
				return note.isDeleted;
			default:
				return note.groupId === activeGroup && !note.isDeleted;
		}
	});

	function postGroup(newGroup) {
		return fetch(`${backendURL}groups`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...addAuthHeader(token)
			},
			body: JSON.stringify(newGroup)
		})
			.then((response) => {
				if (response.status != 201) {
					throw new Error("Failed to create group");
				}
				return response.json();
			})
			.then((addedNewGroup) => {
				return addedNewGroup;
			})
			.catch((error) => {
				console.log(error);
				throw new Error("Something went wrong adding a group...");
			});
	}

	function deleteGroup(group) {
		return fetch(`${backendURL}groups/${group._id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				...addAuthHeader(token)
			}
		})
			.then((response) => {
				if (response.status != 204) {
					throw new Error("Could not delete group");
				}
				return;
			})
			.catch(() => {
				throw new Error("Something went wrong deleting group...");
			});
	}

	function getGroup(group) {
		return fetch(`${backendURL}groups/${group.id}/${userCredId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...addAuthHeader(token)
			}
		})
			.then((response) => {
				if (response.status == 200) {
					return response.json();
				} else if (response.status == 404) {
					return undefined;
				} else {
					throw new Error("Failed to get group");
				}
			})
			.then((group) => {
				return group;
			})
			.catch((error) => {
				console.log(error);
				throw new Error("Something went wrong getting a group...");
			});
	}

	function updateNote(noteToUpdate) {
		return fetch(`${backendURL}notes/${noteToUpdate._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...addAuthHeader(token)
			},
			body: JSON.stringify(noteToUpdate)
		})
			.then((response) => {
				if (response.status != 201) {
					throw new Error("Failed to update note");
				}
				return response.json();
			})
			.then((updatedNote) => {
				return updatedNote;
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function updateFieldForManyNotes(notesToUpdate, fieldToUpdate, newFieldValue) {
		return fetch(`${backendURL}notes`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...addAuthHeader(token)
			},
			body: JSON.stringify({
				notes: notesToUpdate,
				fieldToUpdate,
				newFieldValue
			})
		})
			.then((response) => {
				if (response.status != 204) {
					throw new Error("Failed to update all notes");
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function postNote(newNote) {
		return fetch(`${backendURL}notes`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...addAuthHeader(token)
			},
			body: JSON.stringify(newNote)
		})
			.then((response) => {
				if (response.status != 201) {
					throw new Error("Failed to create note");
				}
				return response.json();
			})
			.then((addedNewNote) => {
				return addedNewNote;
			})
			.catch((error) => {
				console.log(error);
				throw new Error("Something went wrong adding a note...");
			});
	}

	function deleteNotes(notes) {
		const notesToDeleteById = notes.map((note) => note._id);
		return fetch(`${backendURL}notes`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				...addAuthHeader(token)
			},
			body: JSON.stringify(notesToDeleteById)
		})
			.then((response) => {
				if (response.status != 204) {
					throw new Error("Could not delete notes.");
				}
				return;
			})
			.catch(() => {
				throw new Error("Something went wrong deleting notes...");
			});
	}

	useEffect(() => {
		function fetchNotes() {
			const promise = fetch(`${backendURL}notes/user/${userCredId}`, {
				headers: addAuthHeader(token)
			});

			return promise;
		}
		function fetchGroups() {
			const promise = fetch(`${backendURL}groups/user/${userCredId}`, {
				headers: addAuthHeader(token)
			});

			return promise;
		}

		fetchNotes()
			.then((res) => res.json())
			.then((json) => setNotes(json))
			.catch((error) => {
				console.log(error);
			});
		fetchGroups()
			.then((res) => res.json())
			.then((json) => setGroups(json))
			.catch((error) => {
				console.log(error);
			});
	}, [addAuthHeader, token, userCredId]);

	return (
		<div className="flex h-screen">
			<Sidebar
				user={currUser}
				notes={notes}
				groups={groups}
				activeGroup={activeGroup}
				setActiveGroup={setActiveGroup}
				onCreateGroup={handleCreateGroup}
				onDeleteGroup={handleDeleteGroup}
			/>
			<main className="content flex-grow p-4 overflow-y-auto relative">
				<div className="notes-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredNotes.map((note, index) => (
						<NoteCard
							key={index}
							note={note}
							groups={groups}
							onToggleFavorite={toggleFavorite}
							onCopy={handleCopy}
							onAddToGroup={handleAddToGroup}
							onMoveToTrash={handleMoveToTrash}
							onRestoreNote={handleRestoreNote}
							onCreateGroup={handleCreateGroup}
							onClick={() => handleNoteClick(note)}
							isInTrash={activeGroup === "trash"}
						/>
					))}
				</div>
				{activeGroup === "trash" && filteredNotes.length > 0 && (
					<EmptyTrashButton onEmptyTrash={handleEmptyTrash} />
				)}
			</main>
			{activeGroup !== "trash" && <AddButton onClick={addNote} />}
			{editingNote && (
				<NoteEditor
					note={editingNote}
					isOpen={true}
					onClose={() => setEditingNote(null)}
					onSave={handleNoteSave}
				/>
			)}
		</div>
	);
};

export default NotesPage;
