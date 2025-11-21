import { createFileRoute } from '@tanstack/react-router';
import TaskPage from '../pages/TaskPage';

export const Route = createFileRoute('/task')({
  component: TaskPage,
});