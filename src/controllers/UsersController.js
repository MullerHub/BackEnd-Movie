const { hash, compare } = require('bcryptjs')
const { request } = require('express')
const sqliteConnection = require('../database/sqlite')
const AppError = require('../utils/AppError')

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    const database = await sqliteConnection()
    const checkUserExist = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (checkUserExist) {
      throw new AppError('Este email já está em uso.')
    }

    const hashedPassword = await hash(password, 8)

    await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, oldPassword } = request.body
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

    if (!user) {
      throw new AppError("Usuário não encontrado²")
    }

    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWithUpdateEmail && userWithUpdateEmail.id !== id) {
      throw new AppError("Este email já está em uso²")
    }
        
    user.name = name || user.name;
    user.email = email || user.email;

    if(password && !oldPassword) {
      throw new AppError("Você precisa informar a senha antiga.")
    }
    
    if(password && oldPassword) {
    const checkOldPassword = await compare(oldPassword, user.password);
    
    if(!checkOldPassword) {
      throw new AppError("A senha antiga não confere.")
    }

    user.password = await hash(password, 8);
  }

    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
    [user.name, user.email, user.password, user.id]
)

    return response.status(200).json()
  }

  

}

module.exports = UsersController