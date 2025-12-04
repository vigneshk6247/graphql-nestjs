import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { Student } from './student.entity';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

@Resolver(() => Student)
export class StudentsResolver {
  constructor(
    private studentsService: StudentsService,
    @Inject('PUB_SUB') private readonly pubsub: PubSub,
  ) {}

  // ---- QUERY ----
  @Query(() => [Student])
  students() {
    return this.studentsService.findAll();
  }

  @Query(() => Student)
  student(@Args('id', { type: () => Int }) id: number) {
    return this.studentsService.findOne(id);
  }

  // ---- MUTATIONS ----
    @Mutation(() => Student)
  async addStudent(
    @Args('name') name: string,
    @Args('age') age: number,
  ) {
    const student = await this.studentsService.create(name, age);
    await this.pubsub.publish('studentAdded', { studentAdded: student });
    return student;
  }


  @Mutation(() => Student)
  updateStudent(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('age', { type: () => Int, nullable: true }) age?: number,
  ) {
    return this.studentsService.update(id, name, age);
  }

  @Mutation(() => Boolean)
  deleteStudent(@Args('id', { type: () => Int }) id: number) {
    return this.studentsService.delete(id);
  }

  // ---- SUBSCRIPTION ----
   @Subscription(() => Student)
  studentAdded() {
    return this.pubsub.asyncIterableIterator('studentAdded');
  }
}
