'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const changelogData = [
    {
      version: "1.2.0",
      date: "2024-12-20",
      type: "Feature",
      changes: [
        "Added AI-powered cost estimation for generated civil plans",
        "Introduced support for exporting plans in DXF format",
        "Enhanced PDF export with customizable branding options",
        "Optimized civil plan generation speed by 30%",
      ],
    },
    {
      version: "1.1.1",
      date: "2024-12-10",
      type: "Fix",
      changes: [
        "Fixed an issue where plans failed to export in DWG format",
        "Resolved bugs in the user dashboard analytics display",
        "Improved error handling for incomplete project inputs",
      ],
    },
    {
      version: "1.1.0",
      date: "2024-12-05",
      type: "Feature",
      changes: [
        "Added support for generating up to 10 project reports per month",
        "Integrated detailed material quantity breakdown in reports",
        "Enhanced the UI for better navigation and accessibility",
      ],
    },
    {
      version: "1.0.0",
      date: "2024-11-30",
      type: "Release",
      changes: [
        "Initial release of the AI Civil Plan Generator",
        "Features include generating up to 5 projects and 10 civil plans per month",
        "Export support for PDF and DWG formats",
        "Basic analytics for tracking project counts",
        "Responsive UI with a clean design for optimal user experience",
      ],
    },
  ];
  
const getBadgeColor = (type: string) => {
  switch (type) {
    case 'Feature':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100'
    case 'Fix':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    case 'Breaking':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const Changelog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredChangelog = changelogData.filter(release =>
    release.changes.some(change =>
      change.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    release.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
    release.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Changelog</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search changes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <ScrollArea className="h-[500px] pr-4">
          <AnimatePresence>
            {filteredChangelog.map((release, index) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Version {release.version}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{release.date}</p>
                  </div>
                  <Badge variant="outline" className={getBadgeColor(release.type)}>
                    {release.type}
                  </Badge>
                </div>
                <ul className="space-y-3">
                  {release.changes.map((change, changeIndex) => (
                    <motion.li
                      key={changeIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: changeIndex * 0.1 }}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      • {change}
                    </motion.li>
                  ))}
                </ul>
                {index < filteredChangelog.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default Changelog

