import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    private logger = new Logger('TasksController');

    constructor(private tasksService: TasksService) {

    }

    @Get()
    async getTasks(
        @GetUser() user: User,
        @Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]> {

        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return await this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    async getTaskById(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id: number): Promise<Task> {
        return await this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createTask(
        @GetUser() user: User,
        @Body() createTaskDto: CreateTaskDto): Promise<Task> {
        this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);

        return await this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    async deleteTask(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    async updateTaskStatus(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return await this.tasksService.updateTaskStatus(id, status, user);
    }
}
