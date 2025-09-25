import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle, Truck, Users, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Incident {
  id: string;
  type: string;
  severity: string;
  location: { lat: number; lng: number };
  description: string;
  status: string;
  timestamp: string;
}

interface Resource {
  id: string;
  type: string;
  status: string;
  location: { lat: number; lng: number };
  capacity: number;
  assignedTo?: string;
}

interface RealTimeMapProps {
  incidents: Incident[];
  resources: Resource[];
}

const RealTimeMap: React.FC<RealTimeMapProps> = ({ incidents, resources }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [mapToken, setMapToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Mock map implementation for demo (would use Mapbox in production)
  const MapContainer = () => (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-blue-50 to-green-50 rounded-lg overflow-hidden border">
      {/* Complete India Map SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 1000" preserveAspectRatio="xMidYMid meet">
        {/* India Complete Outline with all territories */}
        <g>
          {/* Main India Landmass - Comprehensive Path */}
          <path 
            d="M280,200 L300,180 L320,165 L340,155 L360,145 L380,140 L400,135 L420,130 L440,125 L460,120 L480,115 L500,110 L520,108 L540,106 L560,105 L580,108 L600,112 L620,118 L640,125 L660,135 L680,148 L700,165 L720,185 L735,208 L745,232 L750,258 L755,284 L760,310 L765,336 L770,362 L775,388 L780,414 L785,440 L788,466 L790,492 L792,518 L790,544 L785,570 L780,595 L770,620 L758,644 L745,667 L730,688 L712,707 L692,724 L670,739 L646,752 L620,763 L592,772 L562,779 L530,784 L496,787 L460,788 L422,786 L382,782 L340,776 L296,768 L250,758 L202,746 L152,732 L100,716 L46,698 L90,680 L135,664 L180,650 L225,638 L270,628 L315,620 L360,614 L405,610 L450,608 L495,608 L540,610 L585,614 L630,620 L675,628 L720,638 L765,650 L810,664 L855,680 L900,698 L945,718 L990,740 L1035,764 L1080,790 L1125,818 L1170,848 L1160,878 L1145,907 L1125,935 L1100,961 L1070,985 L1035,1007 L995,1027 L950,1045 L900,1061 L845,1075 L785,1087 L720,1097 L650,1105 L575,1111 L495,1115 L410,1117 L320,1117 L225,1115 L125,1111 L20,1105 L-85,1097 L-190,1087 L-295,1075 L-400,1061 L-505,1045 L-610,1027 L-715,1007 L-820,985 L-925,961 L-1030,935 L-1135,907 L-1240,878 L-1345,848 L-1450,818 L-1555,790 L-1660,764 L-1765,740 L-1870,718 L-1975,698 L-2080,680 L-2185,664 L-2290,650 L-2395,638 L-2500,628 L-2605,620 L-2710,614 L-2815,610 L-2920,608 L-3025,608 L-3130,610 L-3235,614 L-3340,620 L-3445,628 L-3550,638 L-3655,650 L-3760,664 L-3865,680 L-3970,698 L-4075,718 L-4180,740 L-4285,764 L-4390,790 L-4495,818 L-4600,848 L-4705,878 L-4810,907 L-4915,935 L-5020,961 L-5125,985 L-5230,1007 L-5335,1027 L-5440,1045 L-5545,1061 L-5650,1075 L-5755,1087 L-5860,1097 L-5965,1105 L-6070,1111 L-6175,1115 L-6280,1117 L-6385,1117 L-6490,1115 L-6595,1111 L-6700,1105 L-6805,1097 L-6910,1087 L-7015,1075 L-7120,1061 L-7225,1045 L-7330,1027 L-7435,1007 L-7540,985 L-7645,961 L-7750,935 L-7855,907 L-7960,878 L-8065,848 L-8170,818 L-8275,790 L-8380,764 L-8485,740 L-8590,718 L-8695,698 L-8800,680 L-8905,664 L-9010,650 L-9115,638 L-9220,628 L-9325,620 L-9430,614 L-9535,610 L-9640,608 L-9745,608 L-9850,610 L-9955,614 L-10060,620 L-10165,628 L-10270,638 L-10375,650 L-10480,664 L-10585,680 L-10690,698 L-10795,718 L-10900,740 L-11005,764 L-11110,790 L-11215,818 L-11320,848 L-11425,878 L-11530,907 L-11635,935 L-11740,961 L-11845,985 L-11950,1007 L-12055,1027 L-12160,1045 L-12265,1061 L-12370,1075 L-12475,1087 L-12580,1097 L-12685,1105 L-12790,1111 L-12895,1115 L-13000,1117 L300,200 Z"
            fill="#f8fafc" 
            stroke="#64748b" 
            strokeWidth="3"
          />
          
          {/* Jammu & Kashmir */}
          <path d="M420,100 L480,90 L540,95 L580,105 L610,120 L630,140 L640,165 L645,190 L635,215 L615,235 L585,250 L545,260 L505,265 L465,265 L425,260 L385,250 L355,235 L335,215 L325,190 L330,165 L340,140 L360,120 L385,105 Z" fill="#e5f3ff" stroke="#64748b" strokeWidth="1.5"/>
          
          {/* Northeast States */}
          <path d="M820,250 L860,240 L900,245 L940,255 L970,270 L990,290 L1000,315 L1005,340 L995,365 L975,385 L945,400 L905,410 L865,415 L825,410 L790,400 L760,385 L740,365 L730,340 L735,315 L745,290 L765,270 L795,255 Z" fill="#e5f3ff" stroke="#64748b" strokeWidth="1.5"/>
          
          {/* Andaman and Nicobar Islands */}
          <path d="M1050,550 L1060,540 L1075,545 L1090,555 L1105,570 L1115,590 L1120,615 L1125,640 L1130,670 L1135,700 L1140,735 L1145,770 L1150,810 L1155,850 L1160,895 L1158,940 L1155,980 L1150,1015 L1140,1045 L1125,1070 L1105,1090 L1080,1105 L1050,1115 L1015,1120 L975,1118 L935,1115 L900,1105 L870,1090 L845,1070 L830,1045 L820,1015 L815,980 L812,940 L810,895 L815,850 L820,810 L825,770 L830,735 L835,700 L840,670 L845,640 L850,615 L860,590 L875,570 L895,555 L920,545 L950,540 Z" fill="#e5f3ff" stroke="#64748b" strokeWidth="1.5"/>
          
          {/* Lakshadweep */}
          <path d="M200,450 L210,440 L225,445 L240,455 L250,470 L255,490 L260,515 L265,540 L270,570 L275,600 L280,635 L285,670 L290,710 L288,750 L285,785 L280,815 L270,840 L255,860 L235,875 L210,885 L180,890 L145,888 L110,885 L80,875 L55,860 L40,840 L30,815 L25,785 L22,750 L20,710 L25,670 L30,635 L35,600 L40,570 L45,540 L50,515 L55,490 L65,470 L80,455 L100,445 L125,440 L155,440 Z" fill="#e5f3ff" stroke="#64748b" strokeWidth="1.5"/>
        </g>

        {/* Detailed State Boundaries */}
        <g fill="none" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.8">
          {/* Rajasthan */}
          <path d="M280,250 L340,240 L400,245 L440,260 L470,285 L485,320 L480,360 L460,400 L425,435 L380,465 L330,485 L275,495 L220,485 L175,465 L140,435 L115,400 L105,360 L115,320 L140,285 L175,260 L220,245 Z"/>
          
          {/* Gujarat */}
          <path d="M220,485 L275,495 L330,485 L380,500 L415,530 L435,570 L445,615 L440,660 L425,700 L395,735 L355,765 L310,785 L260,795 L210,790 L165,775 L125,750 L95,715 L75,675 L65,630 L70,585 L85,545 L115,510 L155,485 Z"/>
          
          {/* Maharashtra */}
          <path d="M425,435 L480,445 L535,460 L580,485 L615,520 L640,560 L655,605 L660,650 L650,695 L625,735 L590,770 L545,800 L495,825 L440,845 L385,855 L330,850 L280,835 L235,810 L200,775 L175,735 L165,690 L170,645 L185,605 L215,570 L255,545 L300,530 L350,525 L400,530 Z"/>
          
          {/* Karnataka */}
          <path d="M495,825 L545,835 L595,850 L635,875 L665,910 L685,950 L695,995 L690,1040 L675,1080 L645,1115 L605,1145 L555,1170 L500,1185 L440,1195 L380,1190 L325,1175 L275,1150 L235,1115 L205,1075 L190,1030 L185,985 L195,940 L220,900 L255,870 L300,850 L350,840 L405,835 L455,835 Z"/>
          
          {/* Tamil Nadu */}
          <path d="M555,1170 L605,1180 L655,1195 L695,1220 L725,1255 L745,1295 L755,1340 L750,1385 L735,1425 L705,1460 L665,1490 L615,1515 L560,1530 L500,1535 L440,1530 L385,1515 L335,1490 L295,1460 L265,1425 L250,1385 L245,1340 L255,1295 L275,1255 L305,1220 L345,1195 L395,1180 L450,1175 L500,1175 Z"/>
          
          {/* Kerala */}
          <path d="M380,1190 L415,1210 L445,1240 L465,1275 L475,1315 L480,1355 L475,1395 L460,1430 L435,1460 L400,1485 L360,1505 L315,1520 L270,1525 L225,1520 L185,1505 L150,1485 L125,1460 L110,1430 L105,1395 L110,1355 L125,1315 L150,1275 L185,1240 L225,1210 L270,1190 L320,1180 L370,1180 Z"/>
          
          {/* Andhra Pradesh */}
          <path d="M590,770 L640,780 L690,795 L730,820 L760,855 L780,895 L790,940 L785,985 L770,1025 L745,1060 L710,1090 L665,1115 L615,1130 L565,1140 L515,1145 L465,1140 L420,1130 L380,1115 L350,1090 L330,1060 L320,1025 L325,985 L340,940 L365,895 L400,855 L445,820 L495,795 L545,780 Z"/>
          
          {/* Telangana */}
          <path d="M535,460 L580,470 L620,485 L650,510 L670,540 L680,575 L685,610 L675,645 L655,675 L625,700 L585,720 L540,735 L495,745 L450,750 L405,745 L365,735 L335,720 L315,700 L305,675 L310,645 L325,610 L350,575 L385,540 L425,510 L470,485 L515,470 Z"/>
          
          {/* Odisha */}
          <path d="M645,570 L690,580 L730,595 L760,620 L780,650 L790,685 L785,720 L770,750 L745,775 L710,795 L670,810 L625,820 L580,825 L535,820 L495,810 L460,795 L435,775 L420,750 L415,720 L425,685 L445,650 L475,620 L515,595 L560,580 L605,575 Z"/>
          
          {/* West Bengal */}
          <path d="M740,365 L785,375 L825,390 L855,415 L875,445 L885,480 L880,515 L865,545 L840,570 L805,590 L765,605 L720,615 L675,620 L630,615 L590,605 L560,590 L540,570 L530,545 L535,515 L550,480 L575,445 L610,415 L650,390 L695,375 Z"/>
          
          {/* Jharkhand */}
          <path d="M620,485 L665,495 L705,510 L735,535 L755,565 L765,600 L760,635 L745,665 L720,690 L685,710 L645,725 L600,735 L555,740 L510,735 L470,725 L440,710 L420,690 L410,665 L415,635 L430,600 L455,565 L490,535 L530,510 L575,495 Z"/>
          
          {/* Chhattisgarh */}
          <path d="M580,485 L625,495 L665,510 L695,535 L715,565 L725,600 L720,635 L705,665 L680,690 L645,710 L605,725 L560,735 L515,740 L470,735 L430,725 L400,710 L380,690 L370,665 L375,635 L390,600 L415,565 L450,535 L490,510 L535,495 Z"/>
          
          {/* Madhya Pradesh */}
          <path d="M380,320 L435,330 L485,345 L530,370 L565,405 L590,445 L605,490 L610,535 L595,575 L570,610 L535,640 L490,665 L440,685 L385,700 L330,710 L275,715 L220,705 L170,685 L130,660 L100,625 L85,585 L85,540 L100,495 L130,455 L170,425 L220,405 L275,395 L330,395 Z"/>
          
          {/* Uttar Pradesh */}
          <path d="M440,260 L495,270 L545,285 L590,310 L625,345 L650,385 L665,430 L670,475 L660,520 L640,560 L610,595 L570,625 L525,650 L475,670 L420,685 L365,695 L310,700 L255,695 L205,685 L165,670 L135,650 L115,625 L105,595 L110,560 L125,520 L150,475 L185,430 L230,385 L285,345 L340,310 L395,285 Z"/>
          
          {/* Bihar */}
          <path d="M590,310 L635,320 L675,335 L705,360 L725,390 L735,425 L730,460 L715,490 L690,515 L655,535 L615,550 L570,560 L525,565 L480,560 L440,550 L405,535 L380,515 L365,490 L360,460 L370,425 L390,390 L420,360 L460,335 L505,320 L550,315 Z"/>
          
          {/* Punjab */}
          <path d="M340,155 L385,165 L425,180 L455,205 L475,235 L485,270 L480,305 L465,335 L440,360 L405,380 L365,395 L320,405 L275,410 L230,405 L190,395 L160,380 L140,360 L130,335 L135,305 L150,270 L175,235 L210,205 L255,180 L305,165 Z"/>
          
          {/* Haryana */}
          <path d="M385,165 L420,175 L450,190 L475,215 L490,245 L495,280 L485,315 L465,345 L435,370 L395,390 L350,405 L305,415 L260,420 L220,415 L185,405 L160,390 L145,370 L140,345 L150,315 L170,280 L200,245 L240,215 L285,190 L335,175 Z"/>
          
          {/* Himachal Pradesh */}
          <path d="M340,120 L380,130 L415,145 L445,170 L465,200 L475,235 L470,270 L455,300 L430,325 L395,345 L355,360 L310,370 L265,375 L220,370 L180,360 L150,345 L130,325 L120,300 L125,270 L140,235 L165,200 L200,170 L245,145 L295,130 Z"/>
          
          {/* Uttarakhand */}
          <path d="M415,145 L450,155 L480,170 L505,195 L520,225 L525,260 L515,295 L495,325 L465,350 L430,370 L390,385 L345,395 L300,400 L255,395 L215,385 L185,370 L165,350 L155,325 L160,295 L175,260 L200,225 L235,195 L275,170 L320,155 L370,150 Z"/>
          
          {/* Assam */}
          <path d="M820,250 L860,260 L895,275 L920,300 L935,330 L940,365 L930,400 L910,430 L880,455 L840,475 L795,490 L750,500 L705,505 L660,500 L620,490 L590,475 L570,455 L560,430 L565,400 L580,365 L605,330 L640,300 L685,275 L735,260 L785,255 Z"/>
          
          {/* Meghalaya */}
          <path d="M750,350 L780,360 L805,375 L820,395 L825,420 L820,445 L805,465 L780,480 L750,490 L715,495 L680,490 L650,480 L630,465 L620,445 L625,420 L640,395 L665,375 L695,360 L725,355 Z"/>
          
          {/* Tripura */}
          <path d="M840,380 L860,390 L875,405 L880,425 L875,445 L860,460 L840,470 L815,475 L790,470 L770,460 L755,445 L750,425 L755,405 L770,390 L790,380 L815,375 Z"/>
          
          {/* Mizoram */}
          <path d="M800,420 L820,430 L835,445 L840,465 L835,485 L820,500 L800,510 L775,515 L750,510 L730,500 L715,485 L710,465 L715,445 L730,430 L750,420 L775,415 Z"/>
          
          {/* Manipur */}
          <path d="M820,340 L840,350 L855,365 L860,385 L855,405 L840,420 L820,430 L795,435 L770,430 L750,420 L735,405 L730,385 L735,365 L750,350 L770,340 L795,335 Z"/>
          
          {/* Nagaland */}
          <path d="M860,280 L880,290 L895,305 L900,325 L895,345 L880,360 L860,370 L835,375 L810,370 L790,360 L775,345 L770,325 L775,305 L790,290 L810,280 L835,275 Z"/>
          
          {/* Arunachal Pradesh */}
          <path d="M860,200 L900,210 L935,225 L960,250 L975,280 L980,315 L975,350 L960,380 L935,405 L900,425 L860,440 L815,450 L770,455 L725,450 L685,440 L650,425 L625,405 L610,380 L605,350 L615,315 L635,280 L665,250 L705,225 L750,210 L800,205 Z"/>
          
          {/* Sikkim */}
          <path d="M680,200 L700,210 L715,225 L720,245 L715,265 L700,280 L680,290 L655,295 L630,290 L610,280 L595,265 L590,245 L595,225 L610,210 L630,200 L655,195 Z"/>
        </g>

        {/* Major Cities Enhanced */}
        <g fill="#475569" fontSize="10">
          {/* Capital */}
          <circle cx="440" cy="220" r="4" fill="#dc2626"/>
          <text x="448" y="226" className="text-sm font-bold fill-red-800">New Delhi</text>
          
          {/* Tier-1 Cities */}
          <circle cx="330" cy="450" r="3" fill="#1f2937"/>
          <text x="336" y="456" className="text-xs font-semibold fill-gray-800">Mumbai</text>
          
          <circle cx="600" cy="850" r="3" fill="#1f2937"/>
          <text x="606" y="856" className="text-xs font-semibold fill-gray-800">Bangalore</text>
          
          <circle cx="760" cy="380" r="3" fill="#1f2937"/>
          <text x="766" y="386" className="text-xs font-semibold fill-gray-800">Kolkata</text>
          
          <circle cx="650" cy="1180" r="3" fill="#1f2937"/>
          <text x="656" y="1186" className="text-xs font-semibold fill-gray-800">Chennai</text>
          
          <circle cx="570" cy="780" r="3" fill="#1f2937"/>
          <text x="576" y="786" className="text-xs font-semibold fill-gray-800">Hyderabad</text>
          
          <circle cx="380" cy="480" r="3" fill="#1f2937"/>
          <text x="386" y="486" className="text-xs font-semibold fill-gray-800">Pune</text>
          
          {/* State Capitals */}
          <circle cx="350" cy="280" r="2.5" fill="#64748b"/>
          <text x="356" y="285" className="text-xs fill-gray-700">Jaipur</text>
          
          <circle cx="520" cy="240" r="2.5" fill="#64748b"/>
          <text x="526" y="245" className="text-xs fill-gray-700">Lucknow</text>
          
          <circle cx="300" cy="520" r="2.5" fill="#64748b"/>
          <text x="306" y="525" className="text-xs fill-gray-700">Gandhinagar</text>
          
          <circle cx="450" cy="380" r="2.5" fill="#64748b"/>
          <text x="456" y="385" className="text-xs fill-gray-700">Bhopal</text>
          
          <circle cx="680" cy="640" r="2.5" fill="#64748b"/>
          <text x="686" y="645" className="text-xs fill-gray-700">Bhubaneswar</text>
          
          <circle cx="620" cy="320" r="2.5" fill="#64748b"/>
          <text x="626" y="325" className="text-xs fill-gray-700">Patna</text>
          
          <circle cx="270" cy="1350" r="2.5" fill="#64748b"/>
          <text x="276" y="1355" className="text-xs fill-gray-700">Thiruvananthapuram</text>
          
          <circle cx="390" cy="190" r="2.5" fill="#64748b"/>
          <text x="396" y="195" className="text-xs fill-gray-700">Chandigarh</text>
          
          <circle cx="430" cy="160" r="2.5" fill="#64748b"/>
          <text x="436" y="165" className="text-xs fill-gray-700">Shimla</text>
          
          <circle cx="450" cy="180" r="2.5" fill="#64748b"/>
          <text x="456" y="185" className="text-xs fill-gray-700">Dehradun</text>
          
          <circle cx="870" cy="320" r="2.5" fill="#64748b"/>
          <text x="876" y="325" className="text-xs fill-gray-700">Guwahati</text>
          
          <circle cx="470" cy="620" r="2.5" fill="#64748b"/>
          <text x="476" y="625" className="text-xs fill-gray-700">Raipur</text>
          
          <circle cx="620" cy="550" r="2.5" fill="#64748b"/>
          <text x="626" y="555" className="text-xs fill-gray-700">Ranchi</text>
        </g>
      </svg>

      {/* Incidents on India Map */}
      {incidents.map((incident, index) => {
        // Enhanced location mapping with more diverse regions
        const locations = [
          { x: 440, y: 220, name: "Delhi", state: "National Capital Territory" },
          { x: 330, y: 450, name: "Mumbai", state: "Maharashtra" },
          { x: 600, y: 850, name: "Bangalore", state: "Karnataka" },
          { x: 760, y: 380, name: "Kolkata", state: "West Bengal" },
          { x: 650, y: 1180, name: "Chennai", state: "Tamil Nadu" },
          { x: 350, y: 280, name: "Jaipur", state: "Rajasthan" },
          { x: 570, y: 780, name: "Hyderabad", state: "Telangana" },
          { x: 520, y: 240, name: "Lucknow", state: "Uttar Pradesh" },
          { x: 300, y: 520, name: "Ahmedabad", state: "Gujarat" },
          { x: 450, y: 380, name: "Bhopal", state: "Madhya Pradesh" },
          { x: 380, y: 480, name: "Pune", state: "Maharashtra" },
          { x: 270, y: 1350, name: "Kochi", state: "Kerala" },
          { x: 620, y: 320, name: "Patna", state: "Bihar" },
          { x: 680, y: 640, name: "Bhubaneswar", state: "Odisha" },
          { x: 870, y: 320, name: "Guwahati", state: "Assam" },
          { x: 470, y: 620, name: "Raipur", state: "Chhattisgarh" },
          { x: 620, y: 550, name: "Ranchi", state: "Jharkhand" },
          { x: 390, y: 190, name: "Chandigarh", state: "Punjab/Haryana" },
        ];
        
        const location = locations[index % locations.length];
        
        return (
          <div
            key={incident.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20
              ${incident.severity === 'critical' ? 'animate-pulse' : ''}
            `}
            style={{
              left: `${(location.x / 1200) * 100}%`,
              top: `${(location.y / 1000) * 100}%`,
            }}
            onClick={() => setSelectedIncident(incident)}
            title={`${incident.type} in ${location.name}, ${location.state}`}
          >
            <div className={`relative p-2.5 rounded-full shadow-xl ${
              incident.severity === 'critical' ? 'bg-red-600 shadow-red-500/60' :
              incident.severity === 'high' ? 'bg-orange-500 shadow-orange-500/60' : 'bg-blue-500 shadow-blue-500/60'
            }`}>
              <AlertTriangle className="h-5 w-5 text-white" />
              {incident.severity === 'critical' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping" />
              )}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-xs whitespace-nowrap border shadow-lg">
              <div className="font-semibold text-gray-800">{incident.type}</div>
              <div className="text-gray-600">{location.name}</div>
            </div>
          </div>
        );
      })}

      {/* Resources on India Map */}
      {resources.map((resource, index) => {
        const locations = [
          { x: 460, y: 240, name: "Delhi NCR", state: "National Capital Territory" },
          { x: 350, y: 470, name: "Mumbai Region", state: "Maharashtra" },
          { x: 620, y: 870, name: "Bangalore Region", state: "Karnataka" },
          { x: 780, y: 400, name: "Kolkata Region", state: "West Bengal" },
          { x: 670, y: 1200, name: "Chennai Region", state: "Tamil Nadu" },
          { x: 370, y: 300, name: "Rajasthan Hub", state: "Rajasthan" },
          { x: 590, y: 800, name: "Telangana Hub", state: "Telangana" },
          { x: 540, y: 260, name: "UP Hub", state: "Uttar Pradesh" },
          { x: 320, y: 540, name: "Gujarat Hub", state: "Gujarat" },
          { x: 470, y: 400, name: "MP Hub", state: "Madhya Pradesh" },
          { x: 400, y: 500, name: "Maharashtra Hub", state: "Maharashtra" },
          { x: 290, y: 1370, name: "Kerala Hub", state: "Kerala" },
          { x: 640, y: 340, name: "Bihar Hub", state: "Bihar" },
          { x: 700, y: 660, name: "Odisha Hub", state: "Odisha" },
          { x: 890, y: 340, name: "Northeast Hub", state: "Assam" },
          { x: 490, y: 640, name: "Chhattisgarh Hub", state: "Chhattisgarh" },
        ];
        
        const location = locations[index % locations.length];
        
        return (
          <div
            key={resource.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${(location.x / 1200) * 100}%`,
              top: `${(location.y / 1000) * 100}%`,
            }}
            title={`${resource.type} - ${resource.status} at ${location.name}`}
          >
            <div className={`p-2.5 rounded-full shadow-xl ${
              resource.status === 'deployed' ? 'bg-green-600 shadow-green-500/60' :
              resource.status === 'available' ? 'bg-blue-600 shadow-blue-500/60' : 'bg-gray-500 shadow-gray-500/60'
            }`}>
              {resource.type === 'ambulance' ? <Truck className="h-4 w-4 text-white" /> :
               resource.type === 'fire_truck' ? <Zap className="h-4 w-4 text-white" /> :
               <Users className="h-4 w-4 text-white" />}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1.5 text-xs whitespace-nowrap border shadow-lg">
              <div className="font-semibold text-gray-800">{resource.type}</div>
              <div className="text-gray-600">{location.name}</div>
            </div>
          </div>
        );
      })}

      {/* Enhanced Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/96 backdrop-blur-sm rounded-xl p-4 space-y-3 border shadow-xl max-w-xs">
        <h4 className="font-bold text-base text-gray-800">India Emergency Monitoring</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-600 rounded-full shadow-sm" />
            <span className="text-gray-700">Critical Incidents</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm" />
            <span className="text-gray-700">High Priority</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm" />
            <span className="text-gray-700">Medium Priority</span>
          </div>
          <hr className="border-gray-200"/>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-600 rounded-full shadow-sm" />
            <span className="text-gray-700">Active Resources</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-600 rounded-full shadow-sm" />
            <span className="text-gray-700">Available Resources</span>
          </div>
          <hr className="border-gray-200"/>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-700 rounded-full shadow-sm" />
            <span className="text-gray-700 text-xs">National Capital</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 bg-gray-700 rounded-full shadow-sm" />
            <span className="text-gray-700 text-xs">Major Cities</span>
          </div>
        </div>
      </div>

      {/* Enhanced Map Controls */}
      <div className="absolute top-4 right-4 space-y-3">
        <Button variant="secondary" size="sm" className="bg-white/95 hover:bg-white shadow-lg">🔍 Zoom In</Button>
        <Button variant="secondary" size="sm" className="bg-white/95 hover:bg-white shadow-lg">🔍 Zoom Out</Button>
        <Button variant="secondary" size="sm" className="bg-white/95 hover:bg-white shadow-lg">🎯 Center India</Button>
        <Button variant="secondary" size="sm" className="bg-white/95 hover:bg-white shadow-lg">📍 My Location</Button>
      </div>

      {/* Enhanced Scale and Info */}
      <div className="absolute bottom-4 right-4 space-y-2">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-sm border shadow-lg">
          <div className="font-semibold text-gray-800">Coverage</div>
          <div className="text-gray-600 text-xs">All India • Real-time</div>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-xs border shadow-lg">
          <div className="text-gray-600">Scale: ~2000km width</div>
        </div>
      </div>
    </div>
  );

  if (showTokenInput) {
    return (
      <div className="space-y-4">
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            To enable full interactive mapping with Mapbox, please provide your Mapbox access token.
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">
              Get your token here
            </a>
          </AlertDescription>
        </Alert>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Mapbox token (optional)"
            className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm"
            value={mapToken}
            onChange={(e) => setMapToken(e.target.value)}
          />
          <Button onClick={() => setShowTokenInput(false)}>
            {mapToken ? 'Use Token' : 'Use Demo Map'}
          </Button>
        </div>
        <MapContainer />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MapContainer />
      
      {/* Incident Details Modal */}
      {selectedIncident && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{selectedIncident.type}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedIncident.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={
                    selectedIncident.severity === 'critical' ? 'destructive' :
                    selectedIncident.severity === 'high' ? 'secondary' : 'outline'
                  }>
                    {selectedIncident.severity}
                  </Badge>
                  <Badge variant="outline">{selectedIncident.status}</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedIncident(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeMap;