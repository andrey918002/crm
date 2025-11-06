import { createFileRoute } from '@tanstack/react-router';
import ShopPage from '../pages/shopPage.tsx';

export const Route = createFileRoute('/shop')({
    component: ShopPage,
});