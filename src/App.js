import { useState } from "react";

const initialToDos = [
	{
		id: 0,
		text: "create a to-do app",
		date: "10/9/23",
		checked: false,
	},
	{
		id: 1,
		text: "begin coding",
		date: "10/10/23",
		checked: true,
	},
];

export default function App() {
	const [toDos, setToDos] = useState(initialToDos);
	const [showAddTask, setAddTask] = useState(false);
	const [selectedToDo, setSelectedToDo] = useState(null);

	function handleShowAddTask() {
		setAddTask(!showAddTask);
	}

	function handleDeleteAll() {
		const clearArray = [];
		setToDos(Array.from(clearArray));
	}

	function handleSelection(toDo) {
		setSelectedToDo((cur) => (cur?.id === toDo?.id ? null : toDo));
	}

	return (
		<div className="app">
			<h1 className="header">My ToDo list App</h1>
			<ToDoList
				initialToDos={initialToDos}
				showAddTask={showAddTask}
				onSetAddTask={handleShowAddTask}
				toDos={toDos}
				setToDos={setToDos}
				onSelect={handleSelection}
				setSelect={setSelectedToDo}
				selectedToDo={selectedToDo}
			/>

			<div className="buttonRow">
				<Button color={"green"} onClick={handleShowAddTask}>
					{showAddTask ? "Cancel" : "Add task"}
				</Button>
				<Button color={"red"} onClick={handleDeleteAll}>
					Clear all
				</Button>
			</div>
		</div>
	);
}

function Button({ children, color, onClick }) {
	return (
		<button className={color} onClick={onClick}>
			{children}
		</button>
	);
}

function ToDoList({
	toDos,
	setToDos,
	showAddTask,
	onSetAddTask,
	onSelect,
	setSelect,
	selectedToDo,
}) {
	function handleAddToDos(task) {
		const id = crypto.randomUUID();
		const toDo = {
			id,
			text: task,
			date: new Date(),
			checked: false,
		};

		setToDos([...toDos, toDo]);
	}

	function handleDeleteToDo() {
		setToDos(toDos.filter((e) => e.id !== selectedToDo.id));
	}

	return (
		<ul>
			{toDos.length === 0 ? (
				<li className="empty-list">Add a Task</li>
			) : (
				toDos.map((toDo) => (
					<ToDo
						toDo={toDo}
						onDelete={handleDeleteToDo}
						key={toDo.id}
						onSelect={onSelect}
						setSelect={setSelect}
						selectedToDo={selectedToDo}
					/>
				))
			)}
			{showAddTask && (
				<li className="block">
					<FormAddTask
						toDos={toDos}
						onAddTask={handleAddToDos}
						onSetAddTask={onSetAddTask}
					/>
				</li>
			)}
		</ul>
	);
}

function ToDo({ toDo, onDelete, onSelect, setSelect, selectedToDo }) {
	const [checked, setChecked] = useState(toDo.checked);
	const [edit, setEdit] = useState(false);
	const [editTask, setEditTask] = useState(toDo.text);
	const isSelected = selectedToDo?.id === toDo?.id;

	function countDate() {
		const date = new Date(toDo.date).toDateString();
		return date.toString().split(" ").slice(1).join(" ");
	}

	function handleCheckbox() {
		setSelect(false);
		toDo.checked = !checked;
		setChecked(!checked);
	}

	function handleEditToDo() {
		setEdit(true);
	}

	function handleEditSubmit(e) {
		e.preventDefault();
		toDo.text = editTask;
		setEdit(false);
	}

	if (edit) {
		setSelect(false);
	}

	return (
		<li
			className={`${checked ? "crossed" : ""} ${isSelected ? "selected" : ""}`}
			onClick={() => onSelect(toDo)}
		>
			<div className="edit-button-container">
				<button
					className={`editButton ${isSelected ? "shown" : ""}`}
					onClick={handleEditToDo}
				>
					✏️
				</button>
				<button
					className={`deleteButton ${isSelected ? "shown" : ""}`}
					onClick={onDelete}
				>
					🗑️
				</button>
			</div>

			<input
				type="checkbox"
				defaultChecked={checked}
				onChange={handleCheckbox}
			/>
			{!edit ? (
				<p className="todo">{toDo.text}</p>
			) : (
				<form onSubmit={handleEditSubmit}>
					<input
						type="text"
						value={editTask}
						onChange={(e) => setEditTask(e.target.value)}
					/>
				</form>
			)}

			<p>{countDate()}</p>
		</li>
	);
}

function FormAddTask({ onAddTask, onSetAddTask }) {
	const [task, setTask] = useState("");

	function handleSubmit(e) {
		e.preventDefault();

		if (!task) return;

		onAddTask(task);
		setTask("");
		onSetAddTask();
	}
	return (
		<form className="form-add-task" onSubmit={handleSubmit}>
			<input
				type="text"
				value={task}
				onChange={(e) => setTask(e.target.value)}
			/>
			<Button onClick={handleSubmit}>Add</Button>
		</form>
	);
}
