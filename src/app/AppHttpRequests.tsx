import { type ChangeEvent, type CSSProperties, useEffect, useState } from "react"
import Checkbox from "@mui/material/Checkbox"
import { CreateItemForm, EditableSpan } from "@/common/components"
import { todolistsApi } from "@/features/todolists/api/todolists.Api"
import { Todolist } from "@/features/todolists/api/todolistsApi.types"
import { tasksApi } from "@/features/todolists/api/tasksApi"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types"
import { TaskStatus } from "@/common/enums"

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([])
  const [tasks, setTasks] = useState<Record<string, DomainTask[]>>({})

  useEffect(() => {
    todolistsApi.getTodolists().then((res) => {
      const todolists = res.data
      setTodolists(todolists)
      todolists.forEach((todolist) => {
        tasksApi.getTasks(todolist.id).then((res) => {
          setTasks({ ...tasks, [todolist.id]: res.data.items })
        })
      })
    })
  }, [])

  const createTodolist = (title: string) => {
    todolistsApi.createTodolist(title).then((res) => {
      const newTodolist = res.data.data.item
      setTodolists([newTodolist, ...todolists])
    })
  }

  const deleteTodolist = (id: string) => {
    todolistsApi.deleteTodolist(id).then(() => {
      setTodolists(todolists.filter((tl) => tl.id !== id))
    })
  }

  const changeTodolistTitle = (id: string, title: string) => {
    todolistsApi.changeTodolistTitle(id, title).then(() => {
      setTodolists(todolists.map((tl) => (tl.id === id ? { ...tl, title } : tl)))
    })
  }

  const createTask = (todolistId: string, title: string) => {
    tasksApi.createTask(todolistId, title).then((res) => {
      setTasks({ ...tasks, [todolistId]: [res.data.data.item, ...tasks[todolistId]] })
    })
  }

  const deleteTask = (todolistId: string, taskId: string) => { }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
    const model: UpdateTaskModel = {
      description: task.description,
      title: task.title,
      priority: task.priority,
      deadline: task.deadline,
      startDate: task.startDate,
      status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New,
    }

    tasksApi.changeTaskStatus({ todolistId: task.todoListId, taskId: task.id, model }).then((res) => {
      setTasks({ ...tasks, [task.todoListId]: tasks[task.todoListId].map(el => el.id === task.id ? res.data.data.item : el) })
    })
  }

  const changeTaskTitle = (task: any, title: string) => {
    const model: UpdateTaskModel = {
      description: task.description,
      title: task.title,
      priority: task.priority,
      deadline: task.deadline,
      startDate: task.startDate,
      status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New,
    }

  }

  return (
    <div style={{ margin: "20px" }}>
      <CreateItemForm onCreateItem={createTodolist} />
      {todolists.map((todolist) => (
        <div key={todolist.id} style={container}>
          <div>
            <EditableSpan value={todolist.title} onChange={(title) => changeTodolistTitle(todolist.id, title)} />
            <button onClick={() => deleteTodolist(todolist.id)}>x</button>
          </div>
          <CreateItemForm onCreateItem={(title) => createTask(todolist.id, title)} />
          {tasks[todolist.id]?.map((task: any) => (
            <div key={task.id}>
              <Checkbox checked={task.status === TaskStatus.Completed} onChange={(e) => changeTaskStatus(e, task)} />
              <EditableSpan value={task.title} onChange={(title) => changeTaskTitle(task, title)} />
              <button onClick={() => deleteTask(todolist.id, task.id)}>x</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const container: CSSProperties = {
  border: "1px solid black",
  margin: "20px 0",
  padding: "10px",
  width: "300px",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
}
