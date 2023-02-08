import React from 'react'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Task from './Task'
import TaskForm from './TaskForm'
import axios from "axios"
import { URL } from '../App'
import loadingImg from "../assets/loader.gif"
// http://localhost:5000/api/tasks


function TaskList() {
    const [tasks, setTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [taskId, setTaskId] = useState("")
    const [formData, setFormData] = useState({
        name:"",
        completed : false
    })
    const {name} = formData
    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]:value })
    }
    const getTasks = async ()=>{
        setIsLoading(true)
        try {
            const {data} = await axios.get(`${URL}/api/tasks`)
            setTasks(data)
            setIsLoading(false)
        } catch (error) {
            toast.error(error.message)
            setIsLoading(false)
        }
    }
    useEffect(() => {
        getTasks()
    }, [])
    
    const createTask = async(e) => {
        e.preventDefault()
        if(name ===""){
            return toast.error("El campo no puede estar vacio")
        }
        try {
            await axios.post(`${URL}/api/tasks`, formData)
            toast.success("Tarea creada con exito")
            setFormData({...FormData, name:""})
            getTasks()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${URL}/api/tasks/${id}`)
            toast.success("Tarea eliminada con exito")
            getTasks()
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const cTask = tasks.filter((task)=>{
            return task.completed === true
        })
        setCompletedTasks(cTask)
    }, [tasks])
    
    
    const getSingleTask = async (task) => {
        setFormData({name:task.name, completed:false})
        setTaskId(task._id)
        setIsEditing(true)
    }

    const updateTask = async (e) =>{
        e.preventDefault()
        if(name === ""){
            return toast.error("El campo no puede estar vacio")
        }
        try {
            await axios.put(`${URL}/api/tasks/${taskId}`, formData)
            setFormData({...FormData, name:""})
            setIsEditing(false)
            setTaskId("")
            getTasks()
            toast.success("Tarea acutalizada con exito")
        } catch (error) {
            toast.error(error.message)
        }
    }

    const setToCompleted = async (task) => {
        const newFormData = {
            name : task.name,
            completed : true
        }
        try {
            await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
            getTasks()
            toast.success("Tarea completada")
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div>
            <h2>Administrador de Tareas</h2>
            <TaskForm  name={name} handleInputChange={handleInputChange} createTask={createTask} isEditing={isEditing} updateTask={updateTask}/>
            {tasks.length>0 && (<div className='--flex-between --pb'>
                <p>
                    <b>Total de tareas:</b> {tasks.length}
                </p>
                <p>
                    <b>Tareas completadas:</b> {completedTasks.length}
                </p>
            </div>)}
            <hr/>
            {
                isLoading &&(
                    <div className='--flex-center'>
                        <img src={loadingImg} alt="Cargando..."></img>
                    </div>
                )
            }
            {
                !isLoading && tasks.length === 0 ?(
                    <p className='--py'>No hay tareas</p>
                ):(
                    <>
                        {tasks.map((task, index)=>{
                            return (
                                <Task key={task._id} task={task} index={index} deleteTask={deleteTask} getSingleTask={getSingleTask} setToCompleted={setToCompleted}  />
                            )
                        })}
                    </>
                )
            }
        </div>
    )
}

export default TaskList