"use client";


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import FloorPlan from './FloorPlan';
import { Spinner } from '../ui/spinner';

function Details({subscription}) {
    const params = useParams();
    const [design, setDesign] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDesign = async () => {
        setLoading(true); // Show loading state
        try {
            const response = await axios.get(`/api/design/${params?.slug}`);
            setDesign(response.data); // Set fetched design data
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch design data'); // Display error notification
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    useEffect(() => {
        fetchDesign(); // Fetch design data when the component loads
    }, [params?.slug]);

    return (
        <div>
            {loading ? (
                <div className='pt-20'>
                    <Spinner />
                </div>
            ) : design ? (
                <div>
                     <FloorPlan subscription={subscription} designData={design?.designData} />
                </div>
            ) : (
                <div className='pt-20'>
                <Spinner />
            </div>
            )}
        </div>
    )
}

export default Details