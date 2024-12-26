'use client';

import { useParams } from 'next/navigation';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarIcon, CommandIcon, DownloadIcon } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

interface Report {
  id: string;
  content: string;
  projectId: string;
  command?: string;
  reportType: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function Details() {
  const { slug } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/reports/${slug}`);
        setReport(data);
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.message : 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [slug]);

  const exportReport = async (format: 'pdf' | 'markdown' | 'json') => {
    if (!report) return;

    try {
      switch (format) {
        case 'pdf':
          const doc = new jsPDF();
          
          // Add title
          doc.setFontSize(20);
          doc.text(`${report.reportType} Report`, 20, 20);
          
          // Add metadata
          doc.setFontSize(12);
          doc.text(`Created: ${new Date(report.createdAt).toLocaleString()}`, 20, 30);
          if (report.command) {
            doc.text(`Command: ${report.command}`, 20, 40);
          }
          
          // Add content with word wrapping
          doc.setFontSize(12);
          const splitContent = doc.splitTextToSize(report.content, 170);
          doc.text(splitContent, 20, report.command ? 50 : 40);
          
          // Save PDF
          doc.save(`report-${report.id}.pdf`);
          toast({
            title: "Export Successful",
            description: "Your PDF has been downloaded"
          });
          break;

        case 'markdown':
          const markdownContent = `# ${report.reportType} Report\n\nCreated: ${new Date(report.createdAt).toLocaleString()}\n${report.command ? `\nCommand: ${report.command}\n` : ''}\n\n${report.content}`;
          downloadFile(markdownContent, `report-${report.id}.md`, 'text/markdown');
          toast({
            title: "Export Successful",
            description: "Your Markdown file has been downloaded"
          });
          break;
        
        case 'json':
          const jsonContent = JSON.stringify(report, null, 2);
          downloadFile(jsonContent, `report-${report.id}.json`, 'application/json');
          toast({
            title: "Export Successful",
            description: "Your JSON file has been downloaded"
          });
          break;
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: `Failed to export as ${format.toUpperCase()}`
      });
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <span className="text-3xl font-bold">
                {report?.reportType.charAt(0).toUpperCase() + report?.reportType.slice(1)} Report
              </span>
              <Badge variant="secondary" className="ml-4">{report?.reportType}</Badge>
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportReport('markdown')}>
                  Export as Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportReport('json')}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportReport('pdf')}>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {new Date(report?.createdAt ?? '').toLocaleString()}
            {report?.command && (
              <div className="ml-4 flex items-center">
                <CommandIcon className="mr-2 h-4 w-4" />
                {report.command}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{report?.content ?? ''}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}