import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from './book.repository';
import { UserRepository } from '../user/user.repository';
import { ReadBookDto, UpdateBookDto } from './dtos';
import { plainToClass } from 'class-transformer';
import { Book } from './book.entity';
import { In } from 'typeorm';
import { CreateBookDto } from './dtos/create-book.dto';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';
import { RoleType } from '../role/roletype.enum';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    readonly _bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    readonly _userRepository: UserRepository,
  ) {}

  async get(bookId: number): Promise<ReadBookDto> {
    if (!bookId) {
      throw new BadRequestException('Book id is required');
    }

    const book = await this._bookRepository.findOne(bookId, {
      where: { status: 'ACTIVE' },
    });

    if (!book) {
      throw new BadRequestException('Book not found');
    }

    return plainToClass(ReadBookDto, book);
  }

  async getAll(): Promise<ReadBookDto[]> {
    const books: Book[] = await this._bookRepository.find({
      where: { status: 'ACTIVE' },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async getBookByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) {
      throw new BadRequestException('Author id is required');
    }

    const books: Book[] = await this._bookRepository.find({
      where: { status: 'ACTIVE', authors: In([authorId]) },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];

    for (const authorId of book.authors) {
      const authorExists = await this._userRepository.findOne(authorId, {
        where: { status: 'ACTIVE' },
      });
      if (!authorExists) {
        throw new BadRequestException(
          `There's not an author with this id: ${authorId}`,
        );
      }

      const isAuthor = authorExists.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new BadRequestException(
          `The user with id ${authorId} is not an author`,
        );
      }

      authors.push(authorExists);
    }

    const newBook = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      authors,
    });
    return plainToClass(ReadBookDto, newBook);
  }

  async createByAuthor(
    book: Partial<CreateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const author = await this._userRepository.findOne(authorId, {
      where: { status: 'INACTIVE' },
    });

    const isAuthor = author.roles.some(
      (role: Role) => role.name === RoleType.AUTHOR,
    );

    if (!isAuthor) {
      throw new BadRequestException(
        `The user with id ${authorId} is not an author`,
      );
    }

    const newBook = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      authors: [author],
    });
    return plainToClass(ReadBookDto, newBook);
  }

  async update(
    bookId: number,
    book: Partial<UpdateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const bookExists = await this._bookRepository.findOne(bookId, {
      where: { status: 'ACTIVE' },
    });

    if (!bookExists) {
      throw new BadRequestException('Book not found');
    }

    const isOwnBook = bookExists.authors.some(
      (author) => author.id === authorId,
    );

    if (!isOwnBook) {
      throw new BadRequestException(`This user isn't the book's author`);
    }

    const updateBook = await this._bookRepository.update(bookId, book);
    return plainToClass(ReadBookDto, updateBook);
  }

  async delete(bookId: number): Promise<void> {
    const bookExists = await this._bookRepository.findOne(bookId, {
      where: { status: 'ACTIVE' },
    });

    if (!bookExists) {
      throw new BadRequestException('Book not found');
    }

    await this._bookRepository.update(bookId, { status: 'INACTIVE' });
  }
}
