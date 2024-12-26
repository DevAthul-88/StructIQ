"use client";


import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from '@/components/ui/spinner';
import { EditProjectForm } from './EditForm';


export default function EditMain() {
    const params = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchSingleProject(id: string) {
        const res = await fetch(`/api/projects/${id}`, { cache: 'no-store' });
        if (res.status === 404) {
            notFound();
        }
        if (!res.ok) {
            throw new Error(`Failed to fetch project: ${res.statusText}`);
        }
        return res.json();
    }

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await fetchSingleProject(params?.slug[0]);
                setProject(data?.project);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [params?.slug]);


    return (
        <div>

            {loading == true ? <div className='pt-40'><Spinner /></div> : <>
                <EditProjectForm project={project} />
            </>}

        </div>
    )
}

