import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Todo from 'App/Models/Todo'

export default class TodosController {
  public async index() {
    const todos = await Todo.query()
    return todos
  }

  public async show({ params }: HttpContextContract) {
    try {
      const todo = await Todo.find(params.id)
      if (todo) {
        return todo
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const todo = await Todo.find(params.id)

    if (todo) {
      todo.title = request.input('title')
      todo.desc = request.input('desc')
      todo.done = request.input('done')

      if (await todo.save()) {
        return todo
      }
      return // 422 unprocessable content
    }
    return // 401 unauthorized
  }

  public async store({ auth, request }: HttpContextContract) {
    // const user =
    await auth.authenticate()
    const todo = new Todo()

    todo.title = request.input('title')
    console.log(todo.title)
    todo.desc = request.input('desc')

    await todo.save()
    return todo
  }

  public async destroy({ response, auth, params }: HttpContextContract) {
    await auth.authenticate()

    await Todo.query().where('id', params.id).delete()
    return response.json({ message: 'Deleted successfully' })
  }
}
