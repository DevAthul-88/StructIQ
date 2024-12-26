'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, FileText, FolderKanban, Palette } from 'lucide-react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Spinner } from "../ui/spinner";
import DashboardCharts from "./DashboardCharts";

interface DashboardData {
    totalUsers: number;
    totalReports: number;
    totalProjects: number;
    totalManagers: number;
    totalDesigns: number;
}

export default function DashboardPageNew() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/dashboard');
                setData(data);
            } catch (err) {
                setError(axios.isAxiosError(err) ? err.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);



    if (error) {
        return <div className="text-red-500 p-6">{error}</div>;
    }

    const stats = [
        {
            title: "Total Reports",
            value: data?.totalReports.toLocaleString(),
            icon: FileText,
        },
        {
            title: "Total Projects",
            value: data?.totalProjects.toLocaleString(),
            icon: FolderKanban,
        },
        {
            title: "Total Managers",
            value: data?.totalManagers.toLocaleString(),
            icon: Users,
        },
        {
            title: "Total Designs",
            value: data?.totalDesigns.toLocaleString(),
            icon: Palette,
        }
    ];

    if (loading) {
        return <div className="pt-40">
            <Spinner />
        </div>
    }

    return (
        <div>
            <div className="flex-1 space-y-4 pt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <DashboardCharts />
        </div>
    );
}