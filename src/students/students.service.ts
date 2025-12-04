import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { PubSub } from 'graphql-subscriptions';


@Injectable()
export class StudentsService {
    private pubsub = new PubSub();
    constructor(
        @InjectRepository(Student)
        private repo: Repository<Student>,
    ) {}

  findAll(): Promise<Student[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Student | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(name: string, age: number): Promise<Student> {
    const student = this.repo.create({ name, age });
    const saved = await this.repo.save(student);

    this.pubsub.publish('studentAdded', { studentAdded: saved });
    return saved;
  }

  async update(id: number, name?: string, age?: number): Promise<Student | null> {
    const student = await this.findOne(id);
    if (!student) return null;

    if (name) student.name = name;
    if (age) student.age = age;

    return this.repo.save(student);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  getPubSub() {
    return this.pubsub;
  }
}
