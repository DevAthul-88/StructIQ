'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download } from 'lucide-react'
import jsPDF from 'jspdf' // Import jsPDF
import Papa from 'papaparse' // Import PapaParse for CSV export

// ExportButton component
export function ExportButton({ project }) {
  const [isExporting, setIsExporting] = useState(false)

  // Function to export as PDF
  const exportAsPDF = async () => {
    setIsExporting(true)

    // Create a new PDF document
    const doc = new jsPDF()

    // Add basic project info
    doc.text(`Project: ${project?.projectName || 'N/A'}`, 20, 20)
    doc.text(`Client: ${project?.clientName || 'N/A'}`, 20, 30)
    doc.text(`Start Date: ${project?.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}`, 20, 40)
    doc.text(`End Date: ${project?.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}`, 20, 50)
    doc.text(`Budget: $${project?.budget || 'N/A'}`, 20, 60)
    doc.text(`Status: ${project?.projectStatus || 'N/A'}`, 20, 70)
    doc.text(`Description: ${project?.description || 'N/A'}`, 20, 80)

    // Add dimensions
    const dimensionsText = project?.dimensions
      ? `${project.dimensions.length} x ${project.dimensions.width} x ${project.dimensions.height} ${project.dimensions.units}`
      : 'N/A'
    doc.text(`Dimensions: ${dimensionsText}`, 20, 100)

    // Add Layout Preferences
    doc.text('Layout Preferences:', 20, 120)
    if (project?.layoutPreferences && project.layoutPreferences.length > 0) {
      project.layoutPreferences.forEach((layout, index) => {
        doc.text(`${index + 1}. ${layout.type}: ${layout.description || 'No description'}`, 20, 130 + (index * 10))
      })
    } else {
      doc.text('No layout preferences available', 20, 130)
    }

    // Add Materials
    doc.text('Materials:', 20, 160)
    if (project?.materials && project.materials.length > 0) {
      project.materials.forEach((material, index) => {
        doc.text(`${index + 1}. ${material.type}: ${material.properties || 'No properties'}`, 20, 170 + (index * 10))
      })
    } else {
      doc.text('No materials available', 20, 170)
    }

    // Add Structural Features
    doc.text('Structural Features:', 20, 200)
    if (project?.structuralFeatures && project.structuralFeatures.length > 0) {
      project.structuralFeatures.forEach((feature, index) => {
        doc.text(`${index + 1}. ${feature.type}: ${feature.description || 'No description'} - Quantity: ${feature.quantity || 'N/A'}`, 20, 210 + (index * 10))
      })
    } else {
      doc.text('No structural features available', 20, 210)
    }

    // Save the document as a PDF
    doc.save(`project-${project?.id || 'N/A'}.pdf`)

    setIsExporting(false)
  }

  // Function to export as CSV
  const exportAsCSV = async () => {
    setIsExporting(true)

    // Create the data to be exported
    const csvData = [
      [
        "Project ID", "Project Name", "Client Name", "Start Date", "End Date", "Budget", "Status", "Description", "Dimensions", "Layout Preferences", "Materials", "Structural Features"
      ],
      [
        project?.id || 'N/A',
        project?.projectName || 'N/A',
        project?.clientName || 'N/A',
        project?.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A',
        project?.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A',
        project?.budget || 'N/A',
        project?.projectStatus || 'N/A',
        project?.description || 'N/A',
        project?.dimensions ? `${project.dimensions.length} x ${project.dimensions.width} x ${project.dimensions.height} ${project.dimensions.units}` : 'N/A',
        project?.layoutPreferences ? project.layoutPreferences.map(layout => `${layout.type}: ${layout.description || 'No description'}`).join(", ") : 'N/A',
        project?.materials ? project.materials.map(material => `${material.type}: ${material.properties || 'No properties'}`).join(", ") : 'N/A',
        project?.structuralFeatures ? project.structuralFeatures.map(feature => `${feature.type}: ${feature.description || 'No description'} - Quantity: ${feature.quantity || 'N/A'}`).join(", ") : 'N/A'
      ]
    ]

    // Use PapaParse to convert data to CSV
    const csv = Papa.unparse(csvData)

    // Create a Blob from the CSV data and download it
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `project-${project?.id || 'N/A'}.csv`
    a.click()

    setIsExporting(false)
  }

  // General export function to handle both PDF and CSV
  const exportAs = async (format: 'pdf' | 'csv') => {
    if (format === 'pdf') {
      exportAsPDF()
    } else if (format === 'csv') {
      exportAsCSV()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => exportAs('pdf')}>Export as PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAs('csv')}>Export as CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
