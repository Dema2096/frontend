import React from 'react'

function TaskForm({createTask, name, handleInputChange, isEditing, updateTask}) {
    return (
        <form className='task-form' onSubmit={isEditing ? updateTask : createTask}>
            <input type="text" placeholder='Crear tarea' name='name' value={name} onChange={handleInputChange}/>
            <button type='submit'>{isEditing ? "Editar" : "Crear"}</button>
        </form>
    )
}

export default TaskForm