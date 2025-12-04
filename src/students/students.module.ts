import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsResolver } from './students.resolver';
import { StudentsService } from './students.service';
import { Student } from './student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentsResolver, StudentsService],
})
export class StudentsModule {}
