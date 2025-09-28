import { createFileRoute } from '@tanstack/react-router';
import SettingPage from "@/pages/SettginPage.tsx";
export const Route = createFileRoute('/setting')({
    component: SettingPage,
});