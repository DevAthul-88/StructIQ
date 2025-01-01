"use client";


import { notFound, useParams } from 'next/navigation'
import { ProjectHeader } from './project-header'
import { ProjectDetails } from './project-details'
import { ProjectDimensions } from './project-dimensions'
import { ProjectLayouts } from './project-layouts'
import { ProjectMaterials } from './project-materials'
import { ProjectStructuralFeatures } from './project-structural-features'
import { ExportButton } from './export-button'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from '@/components/ui/spinner';


export default function ProjectPage() {
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
        <div className="flex justify-between items-center mb-8">
          <ProjectHeader project={project} />
          <ExportButton project={project} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProjectDetails project={project} />
            {project?.dimensions && <ProjectDimensions dimensions={project?.dimensions} />}
          </div>
          <div>
            <ProjectLayouts layouts={project?.layoutPreferences} />
            <ProjectMaterials materials={project?.materials} />
            <ProjectStructuralFeatures features={project?.structuralFeatures} />
          </div>
        </div>
      </>}

    </div>
  )
}

