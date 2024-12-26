import React, { useState, useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Grid, Layers, Ruler, Download, ZoomIn, ZoomOut, DownloadIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SVG from './Svg';
import Legend from './Legend';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import jsPDF from 'jspdf';
import Drawing from 'dxf-writer';


// Utility functions
const scaleCoord = (value: number, scale: number) => value * scale;
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

// Types
interface Point {
  x: number;
  y: number;
}

interface Wall {
  id: string;
  startPoint: Point;
  endPoint: Point;
  thickness: number;
  type: 'exterior' | 'interior';
}

interface Room {
  id: string;
  name: string;
  bounds: {
    corners: Point[];
  };
  walls: Wall[];
}

interface DesignData {
  projectMetadata: {
    projectName: string;
    projectId: string;
    dates: {
      modified: string;
    };
    buildingType: string;
    constructionType: string;
    designCodes: string[];
    seismicZone: string;
    windZone: string;
    climateZone: string;
  };
  designSpecifications: {
    drawingNumber: string;
    constructionType: string;
    scale: string;
  };
  metadata: {
    boundingBox: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    };
    gridSize: number;
  };
  walls: {
    elements: Wall[];
  };
  rooms: {
    elements: Room[];
  };
  fireSafety: {
    emergencyExits: {
      locations: {
        id: string;
        position: Point;
      }[];
    };
    fireRatings: {
      exteriorWalls: string;
      interiorWalls: string;
      floorCeiling: string;
    };
  };
  compliance: {
    buildingCode: string;
    fireCode: string;
    seismicZone: string;
    windZone: string;
  };
}

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onToggleLayers: () => void;
  onToggleRuler: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  handleExportDXF: () => void;
  subscription: object
}



const Toolbar: React.FC<ToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onToggleLayers,
  onToggleRuler,
  onDownload,
  onDownloadPDF,
  handleExportDXF,
  subscription
}) => (
  <div className="flex gap-2 mb-4">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={onZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Zoom In</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={onZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Zoom Out</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={onToggleGrid}>
            <Grid className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Grid</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={onToggleLayers}>
            <Layers className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Layers</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={onToggleRuler}>
            <Ruler className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Ruler</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onDownload()}>
                Export as Image
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onDownloadPDF()} disabled={subscription?.title == "Free"}>
                Export as PDF {subscription?.title == "Free" && "(Pro)"}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleExportDXF()} disabled={subscription?.title == "Free"}>
                Export as DXF {subscription?.title == "Free" && "(Pro)"}
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </TooltipTrigger>
        <TooltipContent>
          <p>Download</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

const ProjectInfo: React.FC<{ designData: DesignData }> = ({ designData }) => (
  <div>

    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p><strong>Estimated Budget:</strong> ${designData?.project_summary.estimated_budget}</p>
        <p><strong>Labor Charges:</strong> {designData?.project_summary.labor_charges.percentage_of_budget}
          ({designData?.project_summary.labor_charges.breakdown.project_management}% Project Management,
          {designData?.project_summary.labor_charges.breakdown.skilled_labor}% Skilled Labor,
          {designData?.project_summary.labor_charges.breakdown.administrative_support}% Administrative Support)
        </p>
      </div>
      <div>
        <p><strong>Total Budget:</strong> ${designData?.project_summary.total_budget}</p>
        <p><strong>Time to Completion:</strong> {designData?.project_summary.time_to_completion}</p>
      </div>
    </div>




  </div>
);



const CivilFloorPlan: React.FC<{ designData: DesignData }> = ({ designData, subscription }) => {
  const [scale, setScale] = useState(1.5);
  const [showGrid, setShowGrid] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  const [showRuler, setShowRuler] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate drawing dimensions
  const padding = 100;
  const boundingBox = designData.metadata.boundingBox;
  const drawingWidth = (boundingBox.maxX - boundingBox.minX) * scale + padding * 2;
  const drawingHeight = (boundingBox.maxY - boundingBox.minY) * scale + padding * 2;
  const handleZoomIn = useCallback(() => setScale(s => Math.min(s + 0.1, 1.5)), []); // Zoom in by 0.1, max at 1.5
  const handleZoomOut = useCallback(() => setScale(s => Math.max(s - 0.1, 0.1)), []); // Zoom out by 0.1, min at 0.1


  const handleToggleGrid = useCallback(() => setShowGrid(s => !s), []);
  const handleToggleLayers = useCallback(() => setShowLayers(s => !s), []);
  const handleToggleRuler = useCallback(() => setShowRuler(s => !s), []);
  const handleDownload = useCallback(() => {
    if (svgRef.current) {
      toPng(svgRef.current).then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'floor-plan.png';
        link.href = dataUrl;
        link.click();
      });
    }
  }, []);

  const onDownloadPDF = useCallback(() => {
    if (svgRef.current) {
      toPng(svgRef.current).then((dataUrl) => {
        const pdf = new jsPDF();
        pdf.addImage(dataUrl, 'PNG', 10, 10, 190, 0);
        pdf.save('floor-plan.pdf');
      });
    }
  }, []);


  const handleExportDXF = useCallback(() => {
    const drawing = new Drawing();
    drawing.addLayer('floor-plan', 3, 'CONTINUOUS');
    drawing.drawRect(10, 10, 100, 100);
    const dxfString = drawing.toDxfString();
    const blob = new Blob([dxfString], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = 'floor-plan.dxf';
      link.click();
    } finally {
      URL.revokeObjectURL(url);
    }
  }, []);


    // Calculate scale bar segments
    const scaleBarLength = 1000; // 1 meter in mm
    const scaleBarSegments = 5;
    const segmentLength = scaleBarLength / scaleBarSegments;




    return (
      <Card className="w-full">

        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <CardTitle>{designData.projectMetadata.projectName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Drawing No: {designData.designSpecifications.drawingNumber}
              </p>
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <Badge variant="outline">Project ID: {designData.projectMetadata.projectId}</Badge>
              <p className="text-sm text-muted-foreground mt-1">
                Date: {formatDate(designData.projectMetadata.dates.modified)}
              </p>
            </div>
          </div>
        </CardHeader>



        <CardContent className="space-y-6">
          <ProjectInfo designData={designData} />

          <Tabs defaultValue="floor-plan" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="floor-plan">Architectural</TabsTrigger>
              <TabsTrigger value="project-summery">Project Summary</TabsTrigger>
              <TabsTrigger value="structural">Structural</TabsTrigger>
              <TabsTrigger value="services">MEP</TabsTrigger>
            </TabsList>

            <TabsContent value="floor-plan" className="mt-4">
              <Toolbar
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onToggleGrid={handleToggleGrid}
                onToggleLayers={handleToggleLayers}
                onToggleRuler={handleToggleRuler}
                onDownload={handleDownload}
                onDownloadPDF={onDownloadPDF}
                handleExportDXF={handleExportDXF}
                subscription={subscription}
              />

              <div className="border rounded-lg p-4 bg-card overflow-auto">
                <SVG designData={designData} scale={scale} showGrid={showGrid} height={drawingHeight} width={drawingWidth} showLayers={showLayers} showRuler={showRuler} svgRef={svgRef} />
              </div>

              <div className="mt-6">

                <Card>
                  <CardHeader>
                    Legend
                  </CardHeader>
                  <CardContent>
                    <Legend />
                  </CardContent>
                </Card>


              </div>
            </TabsContent>

            <TabsContent value="project-summery" className="mt-4">

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Project Summary</h3>
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Estimated Budget:</strong> <span className='text-muted-foreground'>${designData?.project_summary.estimated_budget}</span></p>
                    </div>
                    <div>
                      <p><strong>Labor Charges:</strong> <span className='text-muted-foreground'>{designData?.project_summary.labor_charges.percentage_of_budget}
                        ({designData?.project_summary.labor_charges.breakdown.project_management}% Project Management,
                        {designData?.project_summary.labor_charges.breakdown.skilled_labor}% Skilled Labor,
                        {designData?.project_summary.labor_charges.breakdown.administrative_support}% Administrative Support)</span>
                      </p>
                    </div>
                    <div>
                      <p><strong>Total Budget:</strong> <span className='text-muted-foreground'>${designData?.project_summary.total_budget}</span></p>
                    </div>
                    <div>
                      <p><strong>Time to Completion:</strong> <span className='text-muted-foreground'>{designData?.project_summary.time_to_completion}</span></p>
                    </div>
                    <div>
                      <strong>Required Materials:</strong>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                        {designData?.project_summary.required_materials.map((material, index) => (
                          <li key={index}>{material.item}: {material.approximate_cost}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Required Equipment:</strong>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                        {designData?.project_summary.required_equipment.map((equipment, index) => (
                          <li key={index}>{equipment}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Personnel Needed:</strong>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                        {designData?.project_summary.personnel_needed.map((personnel, index) => (
                          <li key={index}>{personnel}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Environmental Considerations:</strong>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                        {designData?.project_summary.environmental_considerations.map((consideration, index) => (
                          <li key={index}>{consideration}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>


            </TabsContent>

            <TabsContent value="structural" className="mt-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Structural Notes</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Foundation type: As per structural calculations</li>
                  <li>• Seismic Zone: {designData.compliance.seismicZone}</li>
                  <li>• Wind Zone: {designData.compliance.windZone}</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="services" className="mt-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Fire Safety</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Exterior Walls: {designData.fireSafety.fireRatings.exteriorWalls}</li>
                  <li>• Interior Walls: {designData.fireSafety.fireRatings.interiorWalls}</li>
                  <li>• Floor/Ceiling: {designData.fireSafety.fireRatings.floorCeiling}</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  export default CivilFloorPlan;

