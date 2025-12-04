# GraphQL NestJS Project - Student Management API

A complete GraphQL API built with NestJS, TypeORM, and MySQL that demonstrates CRUD operations, real-time subscriptions, and modern backend development practices.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [GraphQL API Documentation](#graphql-api-documentation)
- [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

This project is a **Student Management API** built with **GraphQL** that allows you to:
- Create, Read, Update, and Delete student records
- Query students individually or as a list
- Subscribe to real-time updates when new students are added
- Persist data in a MySQL database using TypeORM

## ✨ Features

✅ **GraphQL API** with queries, mutations, and subscriptions  
✅ **TypeORM** integration for database operations  
✅ **MySQL** database for persistent storage  
✅ **Real-time subscriptions** using PubSub pattern  
✅ **Type-safe** development with TypeScript  
✅ **Auto-generated GraphQL schema**  
✅ **GraphQL Playground** for API testing  

## 🛠 Tech Stack

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[GraphQL](https://graphql.org/)** - Query language for APIs
- **[Apollo Server](https://www.apollographql.com/)** - GraphQL server
- **[TypeORM](https://typeorm.io/)** - ORM for TypeScript
- **[MySQL](https://www.mysql.com/)** - Relational database
- **[graphql-subscriptions](https://github.com/apollographql/graphql-subscriptions)** - PubSub for real-time updates
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript

## 📁 Project Structure

```
graphql-nestjs/
├── src/
│   ├── students/
│   │   ├── student.entity.ts       # Student entity (TypeORM + GraphQL)
│   │   ├── students.service.ts     # Business logic for students
│   │   ├── students.resolver.ts    # GraphQL resolvers (queries, mutations, subscriptions)
│   │   ├── students.module.ts      # Students module
│   │   └── students.resolver.spec.ts
│   ├── app.module.ts               # Root module with GraphQL and TypeORM config
│   ├── pubsub.module.ts            # Global PubSub module for subscriptions
│   └── main.ts                     # Application entry point
├── schema.gql                      # Auto-generated GraphQL schema
├── package.json
└── tsconfig.json
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)

## 🚀 Installation & Setup

### Step 1: Clone or Navigate to the Project

```bash
cd c:\projects\minikube-projects\graphql-nestjs
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up MySQL Database

1. Start your MySQL server (XAMPP, WAMP, or standalone MySQL)

2. Create a new database:

```sql
CREATE DATABASE graphql_learning;
```

3. Update database credentials in `src/app.module.ts` if needed:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',      // ← Change if needed
  password: 'root',      // ← Change if needed
  database: 'graphql_learning',
  autoLoadEntities: true,
  synchronize: true,     // Auto-creates tables (dev only!)
})
```

> **Note:** `synchronize: true` automatically creates database tables based on your entities. Only use this in development!

## ▶️ Running the Application

### Development Mode (with hot-reload)

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Access the Application

Once running, you can access:

- **GraphQL Playground**: http://localhost:3000/graphql
- **API Endpoint**: http://localhost:3000/graphql

## 📚 GraphQL API Documentation

### Schema Overview

The API provides a `Student` type with the following fields:

```graphql
type Student {
  id: ID!
  name: String!
  age: Int!
}
```

### 🔍 Queries

#### Get All Students

```graphql
query {
  students {
    id
    name
    age
  }
}
```

#### Get Single Student by ID

```graphql
query {
  student(id: 1) {
    id
    name
    age
  }
}
```

### ✏️ Mutations

#### Add a New Student

```graphql
mutation {
  addStudent(name: "John Doe", age: 20) {
    id
    name
    age
  }
}
```

#### Update a Student

```graphql
mutation {
  updateStudent(id: 1, name: "Jane Doe", age: 21) {
    id
    name
    age
  }
}
```

#### Delete a Student

```graphql
mutation {
  deleteStudent(id: 1)
}
```

### 📡 Subscriptions

#### Subscribe to New Students

```graphql
subscription {
  studentAdded {
    id
    name
    age
  }
}
```

> **How it works:** Open two tabs in GraphQL Playground. In one tab, run the subscription above. In another tab, execute the `addStudent` mutation. You'll see the new student appear in real-time in the subscription tab!

## 📖 Step-by-Step Implementation Guide

Here's what was built in this project, step by step:

### Step 1: Project Initialization

Created a new NestJS project and installed required dependencies:

```bash
npm i --save @nestjs/graphql @nestjs/apollo graphql apollo-server-express
npm i --save @nestjs/typeorm typeorm mysql2
npm i --save graphql-subscriptions
```

### Step 2: Database Entity Creation

Created `student.entity.ts` with dual decorators for both TypeORM and GraphQL:

```typescript
@ObjectType()  // GraphQL decorator
@Entity()      // TypeORM decorator
export class Student {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Int)
  @Column()
  age: number;
}
```

**Key Concept:** The `@ObjectType()` decorator exposes this entity as a GraphQL type, while `@Entity()` makes it a database table.

### Step 3: Service Layer Implementation

Created `students.service.ts` with all CRUD operations:

- `findAll()` - Retrieve all students
- `findOne(id)` - Get a single student by ID
- `create(name, age)` - Add a new student
- `update(id, name?, age?)` - Update student details
- `delete(id)` - Remove a student

**Key Concept:** The service uses TypeORM's `Repository` pattern for database operations.

### Step 4: GraphQL Resolvers

Created `students.resolver.ts` with:

**Queries:**
- `@Query(() => [Student])` for `students` (list all)
- `@Query(() => Student)` for `student(id)` (get one)

**Mutations:**
- `@Mutation(() => Student)` for `addStudent(name, age)`
- `@Mutation(() => Student)` for `updateStudent(id, name?, age?)`
- `@Mutation(() => Boolean)` for `deleteStudent(id)`

**Subscriptions:**
- `@Subscription(() => Student)` for `studentAdded`

**Key Concept:** Resolvers are the GraphQL equivalent of REST controllers. They handle incoming GraphQL requests.

### Step 5: PubSub Configuration (Real-time Subscriptions)

Created a global `PubSubModule` to share a single PubSub instance across the app:

```typescript
// pubsub.module.ts
@Global()
@Module({
  providers: [{
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }],
  exports: ['PUB_SUB'],
})
export class PubSubModule {}
```

**Key Concept:** The `@Global()` decorator makes the PubSub instance available everywhere without re-importing.

### Step 6: Subscription Implementation

In the resolver, injected PubSub and used it:

```typescript
constructor(
  private studentsService: StudentsService,
  @Inject('PUB_SUB') private readonly pubsub: PubSub,
) {}

// Publish event when adding student
async addStudent(name: string, age: number) {
  const student = await this.studentsService.create(name, age);
  await this.pubsub.publish('studentAdded', { studentAdded: student });
  return student;
}

// Subscribe to the event
@Subscription(() => Student)
studentAdded() {
  return this.pubsub.asyncIterableIterator('studentAdded');
}
```

**Important Note:** In `graphql-subscriptions` v3, the method is called `asyncIterableIterator` (not `asyncIterator` as in v2).

### Step 7: GraphQL Module Configuration

Configured GraphQL in `app.module.ts` with:

- **Code-first approach** with `autoSchemaFile`
- **Apollo Driver** for GraphQL server
- **Subscriptions enabled** with WebSocket transport
- **GraphQL Playground** enabled for testing

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: 'schema.gql',
  playground: true,
  installSubscriptionHandlers: true,
  subscriptions: {
    'subscriptions-transport-ws': {
      path: '/graphql',
    },
  },
}),
```

### Step 8: TypeORM Configuration

Connected to MySQL database:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'graphql_learning',
  autoLoadEntities: true,
  synchronize: true, // Auto-creates tables (dev only!)
}),
```

**Key Concept:** `autoLoadEntities: true` automatically discovers entities, and `synchronize: true` creates tables automatically in development.

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

## 🐛 Troubleshooting

### Issue: "Cannot find module 'graphql-subscriptions'"

**Solution:** Install the package:
```bash
npm install graphql-subscriptions
```

### Issue: "Property 'asyncIterator' does not exist on type 'PubSub'"

**Solution:** In `graphql-subscriptions` v3, use `asyncIterableIterator` instead of `asyncIterator`:

```typescript
// ❌ Wrong (v2 syntax)
return this.pubsub.asyncIterator('studentAdded');

// ✅ Correct (v3 syntax)
return this.pubsub.asyncIterableIterator('studentAdded');
```

### Issue: Database Connection Error

**Solution:** 
1. Ensure MySQL is running
2. Verify credentials in `app.module.ts`
3. Ensure the database exists:
   ```sql
   CREATE DATABASE graphql_learning;
   ```

### Issue: Port 3000 Already in Use

**Solution:** Change the port in `src/main.ts`:
```typescript
await app.listen(3001); // or any available port
```

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [GraphQL Documentation](https://graphql.org/learn/)
- [TypeORM Documentation](https://typeorm.io/)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)

## 📝 License

This project is [MIT licensed](LICENSE).

---

**Built with ❤️ using NestJS and GraphQL**
