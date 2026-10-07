import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Head,
  Options,
  Param,
  Body,
  ParseIntPipe,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // POST /users
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // PUT /users/:id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // DELETE /users/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // HEAD /users — igual que GET pero sin body, solo verifica que el recurso existe
  @Head()
  @HttpCode(200)
  headUsers(@Res() res: Response) {
    const users = this.usersService.findAll();
    res.set('X-Total-Count', String(users.length));
    res.end();
  }

  // OPTIONS /users — informa los métodos HTTP disponibles en esta ruta
  @Options()
  @HttpCode(204)
  optionsUsers(@Res() res: Response) {
    res.set('Allow', 'GET, POST, HEAD, OPTIONS');
    res.end();
  }
}
