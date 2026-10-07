import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UsersService
 *
 * Este servicio gestiona la lógica de negocio de los usuarios.
 * En lugar de usar una base de datos, los datos se almacenan en un array
 * en memoria (users[]). Esto significa que los datos son volátiles:
 * se pierden al reiniciar el servidor, pero es suficiente para demostrar
 * el funcionamiento de un CRUD completo.
 *
 * Estructura del almacenamiento en memoria:
 * - users: User[]  → array que contiene todos los usuarios creados
 * - nextId: number → contador que asigna un ID único a cada nuevo usuario
 */
@Injectable()
export class UsersService {
  /**
   * Array en memoria que actúa como "base de datos".
   * Cada elemento es un objeto de tipo User con la forma:
   * { id: number, name: string, email: string, age: number }
   *
   * Ejemplo del estado del array después de crear dos usuarios:
   * [
   *   { id: 1, name: 'Juan', email: 'juan@mail.com', age: 25 },
   *   { id: 2, name: 'María', email: 'maria@mail.com', age: 30 }
   * ]
   */
  private users: User[] = [];

  /**
   * Contador auto-incremental para generar IDs únicos.
   * Empieza en 1 y aumenta con cada usuario creado.
   * Funciona igual que un AUTO_INCREMENT en SQL.
   */
  private nextId = 1;

  /**
   * Retorna todos los usuarios almacenados en el array.
   * Si no hay usuarios, retorna un array vacío [].
   */
  findAll(): User[] {
    return this.users;
  }

  /**
   * Busca un usuario por su ID dentro del array usando Array.find().
   * Si no existe, lanza una excepción 404 (NotFoundException).
   */
  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  /**
   * Crea un nuevo usuario y lo agrega al array.
   * Pasos:
   * 1. Crea el objeto con el nextId actual y los datos del DTO
   * 2. Incrementa nextId para el próximo usuario
   * 3. Agrega el nuevo usuario al array con push()
   * 4. Retorna el usuario creado con su ID asignado
   */
  create(dto: CreateUserDto): User {
    const newUser: User = {
      id: this.nextId++,
      ...dto,
    };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * Actualiza los datos de un usuario existente en el array.
   * Usa Object.assign() para sobreescribir solo los campos enviados,
   * manteniendo los demás sin cambios (actualización parcial).
   * Como el array guarda referencias a objetos, el cambio se refleja
   * directamente en el array sin necesidad de buscarlo de nuevo.
   */
  update(id: number, dto: UpdateUserDto): User {
    const user = this.findOne(id);
    Object.assign(user, dto);
    return user;
  }

  /**
   * Elimina un usuario del array usando su índice.
   * Pasos:
   * 1. Busca el índice del usuario con findIndex()
   * 2. Si no existe (índice -1), lanza excepción 404
   * 3. Elimina el elemento del array con splice(index, 1)
   * 4. Retorna un mensaje de confirmación
   */
  remove(id: number): { message: string } {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    this.users.splice(index, 1);
    return { message: `Usuario ${id} eliminado correctamente` };
  }
}
