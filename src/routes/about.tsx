
import { createFileRoute } from '@tanstack/react-router';
import AboutPage from '../pages/AboutPage.tsx';

export const Route = createFileRoute('/About')(
    component: AboutPage,
});