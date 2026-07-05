'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useF1Store, RaceFlagState } from '../../store/f1Store';
import { Play, Pause, RotateCcw, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { f1ApiService } from '../../services/f1Api';

export default function LiveTimingPage() {
  const {
    liveDrivers,
    raceState,
    setRaceState,
    isSimulating,
    setIsSimulating,
    lapCount,
    maxLaps,
    resetSimulator,
    selectedLiveDriverId,
    setSelectedLiveDriverId
  } = useF1Store();

  const pathRef = useRef<SVGPathElement>(null);
  const [coords, setCoords] = useState<{ [id: string]: { x: number; y: number } }>({});
  const [liveGPName, setLiveGPName] = useState('British Grand Prix');
  const [session, setSession] = useState<'practice' | 'qualifying' | 'race'>('race');

  useEffect(() => {
    const loadLiveGPName = async () => {
      try {
        const calendar = await f1ApiService.getCalendar();
        const live = calendar.find(r => r.status === 'live');
        if (live) {
          setLiveGPName(live.gpName);
        }
      } catch (err) {}
    };
    loadLiveGPName();
  }, []);

  // Compute coordinates for driver dots along the SVG path
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    try {
      const pathLength = path.getTotalLength();
      const newCoords: { [id: string]: { x: number; y: number } } = {};

      liveDrivers.forEach(drv => {
        // Find coordinate on SVG path matching current driver progress
        const distance = drv.progress * pathLength;
        const pt = path.getPointAtLength(distance);
        newCoords[drv.id] = { x: pt.x, y: pt.y };
      });

      setCoords(newCoords);
    } catch (e) {
      // getPointAtLength might fail if path is not fully rendered
    }
  }, [liveDrivers]);

  const activeDriver = liveDrivers.find(d => d.id === selectedLiveDriverId) || liveDrivers[0];

  // Helper to color sector cells
  const getSectorColor = (sectorTimeStr: string, idx: number) => {
    if (sectorTimeStr === '-') return 'var(--text-muted)';
    // In our simplified mock, odd driver numbers get fast sectors
    const codeNum = parseInt(activeDriver.code) || 12;
    if (codeNum % 2 === 0 && idx === 1) return 'var(--purple-accent)'; // Purple (overall fastest)
    if (idx === 2) return 'var(--green-accent)'; // Green (personal best)
    return 'var(--yellow-accent)'; // Yellow (normal)
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Title */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Race Center Live Timing</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Real-time telemetry, track position indicators, and simulation controls for the {liveGPName}
        </span>
      </div>

      {/* Grid Layout splits visualizer and table */}
      <div className="live-layout-grid">
        {/* Left Side Telemetry and visualizers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Simulation Controls Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Live Simulator Controls</h3>
            
            {/* Session Switch Switcher */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Session</span>
              <div style={{ 
                display: 'flex', 
                backgroundColor: 'var(--bg-tertiary)', 
                padding: '4px', 
                borderRadius: '8px', 
                border: '1px solid var(--border-color)',
                width: 'fit-content'
              }}>
                {(['practice', 'qualifying', 'race'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setSession(s);
                      resetSimulator();
                    }}
                    style={{
                      backgroundColor: session === s ? 'var(--f1-red)' : 'transparent',
                      color: session === s ? 'white' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 1.1rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {!isSimulating ? (
                <button 
                  onClick={() => setIsSimulating(true)}
                  style={{
                    backgroundColor: 'var(--green-accent)',
                    border: 'none',
                    color: 'white',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Play size={16} /> Start Telemetry
                </button>
              ) : (
                <button 
                  onClick={() => setIsSimulating(false)}
                  style={{
                    backgroundColor: 'var(--yellow-accent)',
                    border: 'none',
                    color: 'black',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Pause size={16} /> Pause Timing
                </button>
              )}

              <button 
                onClick={resetSimulator}
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>

            {/* Flag statuses indicators */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '8px' }}>
                Track Status Flag
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setRaceState('green')}
                  className={`badge ${raceState === 'green' ? 'badge-green' : 'badge-muted'}`}
                  style={{ border: 'none', cursor: 'pointer', opacity: raceState === 'green' ? 1 : 0.4 }}
                >
                  <CheckCircle size={12} style={{ marginRight: '4px' }} /> Green Flag
                </button>
                <button 
                  onClick={() => setRaceState('yellow')}
                  className={`badge ${raceState === 'yellow' ? 'badge-yellow' : 'badge-muted'}`}
                  style={{ border: 'none', cursor: 'pointer', opacity: raceState === 'yellow' ? 1 : 0.4 }}
                >
                  <AlertTriangle size={12} style={{ marginRight: '4px' }} /> Yellow Flag
                </button>
                <button 
                  onClick={() => setRaceState('safety-car')}
                  className={`badge ${raceState === 'safety-car' ? 'badge-yellow' : 'badge-muted'}`}
                  style={{ border: 'none', cursor: 'pointer', opacity: raceState === 'safety-car' ? 1 : 0.4, color: 'var(--yellow-accent)' }}
                >
                  <Shield size={12} style={{ marginRight: '4px' }} /> Safety Car
                </button>
                <button 
                  onClick={() => setRaceState('red')}
                  className={`badge ${raceState === 'red' ? 'badge-live' : 'badge-muted'}`}
                  style={{ border: 'none', cursor: 'pointer', opacity: raceState === 'red' ? 1 : 0.4 }}
                >
                  <AlertTriangle size={12} style={{ marginRight: '4px' }} /> Red Flag
                </button>
              </div>
            </div>
          </div>

          {/* British GP Layout SVG visualizer */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.2rem', paddingLeft: '4px' }}>
              <span>📍</span>
              <span style={{ fontWeight: 500, letterSpacing: '0.02em' }}>Silverstone Circuit, UK</span>
            </div>
            
            <div className="track-svg-canvas" style={{ position: 'relative', backgroundColor: '#09090C', minHeight: '380px' }}>
              <svg viewBox="0 0 1375 790" width="100%" height="100%" style={{ padding: '20px', zIndex: 1, position: 'relative' }}>
                <g transform="translate(100, 45) scale(0.85)">
                  {/* Checkered Start/Finish Line */}
                  <line x1="515" y1="142" x2="503" y2="122" stroke="#ffffff" strokeWidth="8" strokeDasharray="5 5" />

                  {/* Main invisible tracker path (for high resolution math alignment) */}
                  <path 
                    ref={pathRef}
                    id="live-track-path" 
                    d="M 1330.62239,363.40298 C 1343.0739,412.61609 1349.20249,448.31414 1358.83541,498.41516 C 1361.82797,513.97948 1355.22009,533.03075 1350.54659,540.7283 C 1342.95311,553.23519 1324.32458,571.48656 1311.56629,579.06757 C 1274.53507,601.07163 1244.58597,612.2948 1203.57078,626.7917 C 1168.22982,639.28303 1129.06052,648.62591 1090.33388,654.56339 C 1058.00743,659.51961 1021.93785,661.36769 990.75486,671.62525 C 967.09722,679.40737 949.30077,693.65348 931.19565,709.5797 C 923.96358,715.94139 909.06662,722.59256 893.34059,718.42385 C 876.70807,714.01485 858.88221,709.37025 841.38632,706.51766 C 825.6892,703.95835 808.85024,702.09257 794.06066,705.47814 C 778.90437,708.94765 767.91813,719.28209 755.13781,729.17653 C 745.54893,736.60018 741.87195,748.2166 726.35488,753.84332 C 712.46598,758.87964 701.68068,759.23662 690.15212,757.34669 C 679.67227,755.62869 669.34057,750.6552 661.52602,742.72042 C 645.88899,726.84282 635.13406,705.5372 618.60101,690.69502 C 603.38423,677.0345 583.755,666.98497 564.18289,659.90417 C 452.57997,619.52847 338.8464,579.67613 226.5941,536.81186 C 167.8302,514.37249 111.0504,490.33537 55.9199,461.89963 C 42.4996,454.9776 28.5324,441.5682 22.7363,428.34582 C 16.987,415.23026 16.6631,396.94292 20.0873,382.88583 C 23.5182,368.80102 33.1737,355.70208 44.1988,345.71468 C 63.8412,327.92097 98.8139,316.9997 115.9779,296.25252 C 154.8941,249.2123 191.3181,207.90667 235.4665,159.51693 C 246.7132,147.18979 241.5437,137.13074 236.5206,132.96988 C 228.0558,125.9581 216.0249,120.21473 212.1529,111.2794 C 206.6442,98.56712 205.2779,81.84427 211.9678,66.83067 C 218.3862,52.42645 230.6034,37.66949 244.9946,30.02973 C 259.8277,22.15537 280.2721,17.77106 296.9488,20.2883 C 318.5162,23.54376 339.6706,36.56683 359.7269,47.34782 C 459.81491,101.14888 557.1484,161.42035 657.3816,214.03445 C 665.74726,218.42573 685.90966,221.02475 694.19714,207.59669 C 701.52499,195.7235 711.24018,171.39554 739.60059,163.60389 C 767.32868,155.98597 851.17406,137.81695 855.45727,137.18542 C 869.65679,135.09178 906.09649,130.97138 918.23535,136.10304 C 930.12096,141.12763 958.96688,174.8125 976.41308,194.40934 C 993.99216,214.15543 1006.12435,231.52237 1025.60441,244.11314 C 1035.70942,250.64443 1062.27669,251.42005 1071.7483,243.70007 C 1095.98661,223.94428 1120.96546,200.8216 1143.62677,177.34748 C 1150.97036,169.7405 1151.5973,154.51282 1146.5037,146.78459 C 1141.13429,138.6379 1128.06716,132.84756 1116.425,133.31182 C 1099.93229,133.96952 1080.80321,135.04553 1064.35674,135.02066 C 1054.82787,135.00598 1043.97656,127.32993 1038.37961,119.86733 C 1032.07037,111.45501 1027.41068,97.74202 1028.63818,87.39591 C 1029.93623,76.4552 1038.20232,64.3135 1047.45172,59.29687 C 1059.48914,52.7681 1077.93396,54.87111 1092.49864,59.33973 C 1132.57511,71.63566 1173.27387,82.59255 1209.39575,103.0763 C 1232.44401,116.14635 1268.20113,138.98502 1276.58907,163.59022 C 1298.93841,229.14985 1312.76724,292.83262 1330.62239,363.40298 z" 
                    fill="none"
                    stroke="transparent" 
                    strokeWidth="10"
                  />

                  {/* Core Track Line - Sector 3 Base (Dark Blue/Purple) */}
                  <path 
                    d="M 44.377608,426.59702 C 31.926099,377.38391 25.797514,341.68586 16.164586,291.58484 C 13.172032,276.02052 19.779905,256.96925 24.453415,249.2717 C 32.046886,236.76481 50.675422,218.51344 63.43371,210.93243 C 100.46493,188.92837 130.41403,177.7052 171.42922,163.2083 C 206.77018,150.71697 245.93948,141.37409 284.66612,135.43661 C 316.99257,130.48039 353.06215,128.63231 384.24514,118.37475 C 407.90278,110.59263 425.69923,96.346518 443.80435,80.420305 C 451.03642,74.058607 465.93338,67.407442 481.65941,71.576152 C 498.29193,75.985155 516.11779,80.62975 533.61368,83.48234 C 549.3108,86.041653 566.14976,87.907428 580.93934,84.521862 C 596.09563,81.05235 607.08187,70.717915 619.86219,60.823471 C 629.45107,53.399824 633.12805,41.7834 648.64512,36.156681 C 662.53402,31.12036 673.31932,30.763378 684.84788,32.653305 C 695.32773,34.371313 705.65943,39.344804 713.47398,47.279578 C 729.11101,63.157179 739.86594,84.462803 756.39899,99.304975 C 771.61577,112.9655 791.245,123.01503 810.81711,130.09583 C 922.42003,170.47153 1036.1536,210.32387 1148.4059,253.18814 C 1207.1698,275.62751 1263.9496,299.66463 1319.0801,328.10037 C 1332.5004,335.0224 1346.4676,348.4318 1352.2637,361.65418 C 1358.013,374.76974 1358.3369,393.05708 1354.9127,407.11417 C 1351.4818,421.19898 1341.8263,434.29792 1330.8012,444.28532 C 1311.1588,462.07903 1276.1861,473.0003 1259.0221,493.74748 C 1220.1059,540.7877 1183.6819,582.09333 1139.5335,630.48307 C 1128.2868,642.81021 1133.4563,652.86926 1138.4794,657.03012 C 1146.9442,664.0419 1158.9751,669.78527 1162.8471,678.7206 C 1168.3558,691.43288 1169.7221,708.15573 1163.0322,723.16933 C 1156.6138,737.57355 1144.3966,752.33051 1130.0054,759.97027 C 1115.1723,767.84463 1094.7279,772.22894 1078.0512,769.7117 C 1056.4838,766.45624 1035.3294,753.43317 1015.2731,742.65218 C 915.18509,688.85112 817.8516,628.57965 717.6184,575.96555 C 709.25274,571.57427 689.09034,568.97525 680.80286,582.40331 C 673.47501,594.2765 663.75982,618.60446 635.39941,626.39611 C 607.67132,634.01403 523.82594,652.18305 519.54273,652.81458 C 505.34321,654.90822 468.90351,659.02862 456.76465,653.89696 C 444.87904,648.87237 416.03312,615.1875 398.58692,595.59066 C 381.00784,575.84457 368.87565,558.47763 349.39559,545.88686 C 339.29058,539.35557 312.72331,538.57995 303.2517,546.29993 C 279.01339,566.05572 254.03454,589.1784 231.37323,612.65252 C 224.02964,620.2595 223.4027,635.48718 228.4963,643.21541 C 233.86571,651.3621 246.93284,657.15244 258.575,656.68818 C 275.06771,656.03048 294.19679,654.95447 310.64326,654.97934 C 320.17213,654.97934 331.02344,662.67007 336.62039,670.13267 C 342.92963,678.54499 347.58932,692.25798 346.36182,702.60409 C 345.06377,713.5448 336.79768,725.6865 327.54828,730.70313 C 315.51086,737.2319 297.06604,735.12889 282.50136,730.66027 C 242.42489,718.36434 201.72613,707.40745 165.60425,686.9237 C 142.55599,673.85365 106.79887,651.01498 98.41093,626.40978 C 76.061592,560.85015 62.232759,497.16738 44.377608,426.59702 z" 
                    fill="none"
                    stroke="#0055FF" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Core Track Line - Sector 1 Overlay (Light Blue) */}
                  <path 
                    d="M 44.377608,426.59702 C 31.926099,377.38391 25.797514,341.68586 16.164586,291.58484 C 13.172032,276.02052 19.779905,256.96925 24.453415,249.2717 C 32.046886,236.76481 50.675422,218.51344 63.43371,210.93243 C 100.46493,188.92837 130.41403,177.7052 171.42922,163.2083 C 206.77018,150.71697 245.93948,141.37409 284.66612,135.43661 C 316.99257,130.48039 353.06215,128.63231 384.24514,118.37475 C 407.90278,110.59263 425.69923,96.346518 443.80435,80.420305 C 451.03642,74.058607 465.93338,67.407442 481.65941,71.576152 C 498.29193,75.985155 516.11779,80.62975 533.61368,83.48234 C 549.3108,86.041653 566.14976,87.907428 580.93934,84.521862 C 596.09563,81.05235 607.08187,70.717915 619.86219,60.823471 C 629.45107,53.399824 633.12805,41.7834 648.64512,36.156681 C 662.53402,31.12036 673.31932,30.763378 684.84788,32.653305 C 695.32773,34.371313 705.65943,39.344804 713.47398,47.279578 C 729.11101,63.157179 739.86594,84.462803 756.39899,99.304975 C 771.61577,112.9655 791.245,123.01503 810.81711,130.09583 C 922.42003,170.47153 1036.1536,210.32387 1148.4059,253.18814 C 1207.1698,275.62751 1263.9496,299.66463 1319.0801,328.10037 C 1332.5004,335.0224 1346.4676,348.4318 1352.2637,361.65418 C 1358.013,374.76974 1358.3369,393.05708 1354.9127,407.11417 C 1351.4818,421.19898 1341.8263,434.29792 1330.8012,444.28532 C 1311.1588,462.07903 1276.1861,473.0003 1259.0221,493.74748 C 1220.1059,540.7877 1183.6819,582.09333 1139.5335,630.48307 C 1128.2868,642.81021 1133.4563,652.86926 1138.4794,657.03012 C 1146.9442,664.0419 1158.9751,669.78527 1162.8471,678.7206 C 1168.3558,691.43288 1169.7221,708.15573 1163.0322,723.16933 C 1156.6138,737.57355 1144.3966,752.33051 1130.0054,759.97027 C 1115.1723,767.84463 1094.7279,772.22894 1078.0512,769.7117 C 1056.4838,766.45624 1035.3294,753.43317 1015.2731,742.65218 C 915.18509,688.85112 817.8516,628.57965 717.6184,575.96555 C 709.25274,571.57427 689.09034,568.97525 680.80286,582.40331 C 673.47501,594.2765 663.75982,618.60446 635.39941,626.39611 C 607.67132,634.01403 523.82594,652.18305 519.54273,652.81458 C 505.34321,654.90822 468.90351,659.02862 456.76465,653.89696 C 444.87904,648.87237 416.03312,615.1875 398.58692,595.59066 C 381.00784,575.84457 368.87565,558.47763 349.39559,545.88686 C 339.29058,539.35557 312.72331,538.57995 303.2517,546.29993 C 279.01339,566.05572 254.03454,589.1784 231.37323,612.65252 C 224.02964,620.2595 223.4027,635.48718 228.4963,643.21541 C 233.86571,651.3621 246.93284,657.15244 258.575,656.68818 C 275.06771,656.03048 294.19679,654.95447 310.64326,654.97934 C 320.17213,654.97934 331.02344,662.67007 336.62039,670.13267 C 342.92963,678.54499 347.58932,692.25798 346.36182,702.60409 C 345.06377,713.5448 336.79768,725.6865 327.54828,730.70313 C 315.51086,737.2319 297.06604,735.12889 282.50136,730.66027 C 242.42489,718.36434 201.72613,707.40745 165.60425,686.9237 C 142.55599,673.85365 106.79887,651.01498 98.41093,626.40978 C 76.061592,560.85015 62.232759,497.16738 44.377608,426.59702 z" 
                    fill="none"
                    stroke="#00D2FF" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="592, 2368"
                    strokeDashoffset="-976"
                  />

                  {/* Core Track Line - Sector 2 Overlay (Orange) */}
                  <path 
                    d="M 44.377608,426.59702 C 31.926099,377.38391 25.797514,341.68586 16.164586,291.58484 C 13.172032,276.02052 19.779905,256.96925 24.453415,249.2717 C 32.046886,236.76481 50.675422,218.51344 63.43371,210.93243 C 100.46493,188.92837 130.41403,177.7052 171.42922,163.2083 C 206.77018,150.71697 245.93948,141.37409 284.66612,135.43661 C 316.99257,130.48039 353.06215,128.63231 384.24514,118.37475 C 407.90278,110.59263 425.69923,96.346518 443.80435,80.420305 C 451.03642,74.058607 465.93338,67.407442 481.65941,71.576152 C 498.29193,75.985155 516.11779,80.62975 533.61368,83.48234 C 549.3108,86.041653 566.14976,87.907428 580.93934,84.521862 C 596.09563,81.05235 607.08187,70.717915 619.86219,60.823471 C 629.45107,53.399824 633.12805,41.7834 648.64512,36.156681 C 662.53402,31.12036 673.31932,30.763378 684.84788,32.653305 C 695.32773,34.371313 705.65943,39.344804 713.47398,47.279578 C 729.11101,63.157179 739.86594,84.462803 756.39899,99.304975 C 771.61577,112.9655 791.245,123.01503 810.81711,130.09583 C 922.42003,170.47153 1036.1536,210.32387 1148.4059,253.18814 C 1207.1698,275.62751 1263.9496,299.66463 1319.0801,328.10037 C 1332.5004,335.0224 1346.4676,348.4318 1352.2637,361.65418 C 1358.013,374.76974 1358.3369,393.05708 1354.9127,407.11417 C 1351.4818,421.19898 1341.8263,434.29792 1330.8012,444.28532 C 1311.1588,462.07903 1276.1861,473.0003 1259.0221,493.74748 C 1220.1059,540.7877 1183.6819,582.09333 1139.5335,630.48307 C 1128.2868,642.81021 1133.4563,652.86926 1138.4794,657.03012 C 1146.9442,664.0419 1158.9751,669.78527 1162.8471,678.7206 C 1168.3558,691.43288 1169.7221,708.15573 1163.0322,723.16933 C 1156.6138,737.57355 1144.3966,752.33051 1130.0054,759.97027 C 1115.1723,767.84463 1094.7279,772.22894 1078.0512,769.7117 C 1056.4838,766.45624 1035.3294,753.43317 1015.2731,742.65218 C 915.18509,688.85112 817.8516,628.57965 717.6184,575.96555 C 709.25274,571.57427 689.09034,568.97525 680.80286,582.40331 C 673.47501,594.2765 663.75982,618.60446 635.39941,626.39611 C 607.67132,634.01403 523.82594,652.18305 519.54273,652.81458 C 505.34321,654.90822 468.90351,659.02862 456.76465,653.89696 C 444.87904,648.87237 416.03312,615.1875 398.58692,595.59066 C 381.00784,575.84457 368.87565,558.47763 349.39559,545.88686 C 339.29058,539.35557 312.72331,538.57995 303.2517,546.29993 C 279.01339,566.05572 254.03454,589.1784 231.37323,612.65252 C 224.02964,620.2595 223.4027,635.48718 228.4963,643.21541 C 233.86571,651.3621 246.93284,657.15244 258.575,656.68818 C 275.06771,656.03048 294.19679,654.95447 310.64326,654.97934 C 320.17213,654.97934 331.02344,662.67007 336.62039,670.13267 C 342.92963,678.54499 347.58932,692.25798 346.36182,702.60409 C 345.06377,713.5448 336.79768,725.6865 327.54828,730.70313 C 315.51086,737.2319 297.06604,735.12889 282.50136,730.66027 C 242.42489,718.36434 201.72613,707.40745 165.60425,686.9237 C 142.55599,673.85365 106.79887,651.01498 98.41093,626.40978 C 76.061592,560.85015 62.232759,497.16738 44.377608,426.59702 z" 
                    fill="none"
                    stroke="#FF8C00" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="504, 2456"
                    strokeDashoffset="-1568"
                  />

                  {/* Sector label text overlays */}
                  <text x="600" y="600" fill="#00D2FF" fontSize="15px" fontWeight={800} textAnchor="middle">SECTOR 1</text>
                  <text x="150" y="610" fill="#FF8C00" fontSize="15px" fontWeight={800} textAnchor="middle">SECTOR 2</text>
                  <text x="1100" y="220" fill="#0055FF" fontSize="15px" fontWeight={800} textAnchor="middle">SECTOR 3</text>

                  {/* Pink DRS Detection Zone 1 Overlay and Line */}
                  <g>
                    <path d="M 635,626 L 635,550" stroke="#FF00A8" strokeWidth="2.5" fill="none" />
                    <circle cx="635" cy="550" r="6" fill="#FF00A8" />
                    <g transform="translate(570, 500)">
                      <rect x="0" y="0" width="130" height="36" rx="6" fill="#FF00A8" />
                      <text x="65" y="16" fill="white" fontSize="11px" fontWeight={800} textAnchor="middle">DRS DETECTION</text>
                      <text x="65" y="28" fill="white" fontSize="11px" fontWeight={800} textAnchor="middle">ZONE 1</text>
                    </g>
                  </g>

                  {/* Pink DRS Detection Zone 2 Overlay and Line */}
                  <g>
                    <path d="M 284,135 L 284,200" stroke="#FF00A8" strokeWidth="2.5" fill="none" />
                    <circle cx="284" cy="200" r="6" fill="#FF00A8" />
                    <g transform="translate(219, 210)">
                      <rect x="0" y="0" width="130" height="36" rx="6" fill="#FF00A8" />
                      <text x="65" y="16" fill="white" fontSize="11px" fontWeight={800} textAnchor="middle">DRS DETECTION</text>
                      <text x="65" y="28" fill="white" fontSize="11px" fontWeight={800} textAnchor="middle">ZONE 2</text>
                    </g>
                  </g>

                  {/* Speed Trap Overlay and Line */}
                  <g>
                    <path d="M 1148,253 L 1148,160" stroke="#00D200" strokeWidth="2.5" fill="none" />
                    <circle cx="1148" cy="160" r="6" fill="#00D200" />
                    <g transform="translate(1105, 120)">
                      <rect x="0" y="0" width="85" height="40" rx="6" fill="#00D200" />
                      <text x="42.5" y="16" fill="white" fontSize="11px" fontWeight={800} textAnchor="middle">SPEED</text>
                      <text x="42.5" y="30" fill="white" fontSize="11px" fontWeight={800} textAnchor="middle">TRAP</text>
                    </g>
                  </g>

                  {/* Turn Numbers Circular Badges */}
                  {[
                    { num: '01', x: 717, y: 575 },
                    { num: '02', x: 680, y: 582 },
                    { num: '03', x: 635, y: 626 },
                    { num: '04', x: 520, y: 653 },
                    { num: '05', x: 456, y: 654 },
                    { num: '06', x: 230, y: 620 },
                    { num: '07', x: 340, y: 690 },
                    { num: '08', x: 327, y: 730 },
                    { num: '09', x: 70, y: 520 },
                    { num: '10', x: 170, y: 160 },
                    { num: '11', x: 284, y: 135 },
                    { num: '12', x: 384, y: 118 },
                    { num: '13', x: 480, y: 71 },
                    { num: '14', x: 713, y: 47 },
                    { num: '15', x: 1340, y: 361 },
                    { num: '16', x: 1259, y: 493 },
                    { num: '17', x: 1139, y: 630 },
                    { num: '18', x: 1078, y: 750 }
                  ].map(c => (
                    <g key={c.num}>
                      <circle cx={c.x} cy={c.y} r="16" fill="#13131a" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="2" />
                      <text x={c.x} y={c.y + 5} fill="#ffffff" fontSize="16px" fontWeight={800} textAnchor="middle">{c.num}</text>
                    </g>
                  ))}

                  {/* Render coordinates of driver dots */}
                  {Object.keys(coords).map(driverId => {
                    const driverState = liveDrivers.find(d => d.id === driverId);
                    if (!driverState) return null;
                    const coord = coords[driverId];
                    const isSelected = driverId === selectedLiveDriverId;

                    return (
                      <g key={driverId} style={{ transition: 'transform 0.15s linear' }}>
                        <circle 
                          cx={coord.x} 
                          cy={coord.y} 
                          r={isSelected ? 18 : 12}
                          fill={driverState.color}
                          stroke={isSelected ? 'white' : 'none'}
                          strokeWidth={3}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedLiveDriverId(driverId)}
                        />
                        {isSelected && (
                          <text 
                            x={coord.x} 
                            y={coord.y - 25}
                            fill="white"
                            fontSize="20px"
                            fontWeight={700}
                            textAnchor="middle"
                            style={{ filter: 'drop-shadow(0px 1px 3px black)' }}
                          >
                            {driverState.code}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Selected Driver Telemetry Dashboard */}
          {activeDriver && (
            <div className="card highlight" style={{ borderTopColor: activeDriver.color }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Driver Telemetry</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    {activeDriver.firstName} {activeDriver.lastName} ({activeDriver.code})
                  </h3>
                </div>
                <span className="badge" style={{ backgroundColor: activeDriver.color, color: 'black', fontWeight: 800 }}>
                  #{activeDriver.number}
                </span>
              </div>

              {/* Dials Speed, RPM and Gear */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Speed</span>
                  <strong style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {activeDriver.telemetry.speed} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>KM/H</span>
                  </strong>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Engine RPM</span>
                  <strong style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {activeDriver.telemetry.rpm}
                  </strong>
                </div>

                <div style={{ 
                  background: 'var(--bg-secondary)', 
                  border: `2px solid ${activeDriver.telemetry.drs ? 'var(--green-accent)' : 'var(--border-color)'}`, 
                  borderRadius: '8px', 
                  height: '74px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: activeDriver.telemetry.drs ? '0 0 10px rgba(0, 210, 122, 0.2)' : 'none'
                }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gear</span>
                  <strong style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', lineHeight: 1, color: activeDriver.telemetry.drs ? 'var(--green-accent)' : 'var(--text-primary)' }}>
                    {activeDriver.telemetry.gear === 0 ? 'N' : activeDriver.telemetry.gear}
                  </strong>
                </div>
              </div>

              {/* Throttle, Brake slide graphs and DRS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>THROTTLE %</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{activeDriver.telemetry.throttle}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${activeDriver.telemetry.throttle}%`, height: '100%', backgroundColor: 'var(--green-accent)', transition: 'width 0.15s ease' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>BRAKE %</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{activeDriver.telemetry.brake}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${activeDriver.telemetry.brake}%`, height: '100%', backgroundColor: 'var(--f1-red)', transition: 'width 0.15s ease' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>DRS STATUS</span>
                  <span className={`badge ${activeDriver.telemetry.drs ? 'badge-green' : 'badge-muted'}`}>
                    {activeDriver.telemetry.drs ? 'DRS ACTIVE' : 'DRS DISABLED'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Live Timing table */}
        <div className="table-container">
          <table className="f1-table" id="live-timing-table">
            <thead>
              <tr>
                <th style={{ width: '45px', textAlign: 'center' }}>Pos</th>
                <th>Driver</th>
                <th style={{ textAlign: 'right' }}>{session === 'race' ? 'Gap' : 'Gap (Fastest)'}</th>
                <th style={{ textAlign: 'right' }}>{session === 'race' ? 'Interval' : 'Best Lap'}</th>
                <th style={{ textAlign: 'right', width: '70px' }}>S1</th>
                <th style={{ textAlign: 'right', width: '70px' }}>S2</th>
                <th style={{ textAlign: 'right', width: '70px' }}>S3</th>
                <th style={{ textAlign: 'right', width: '90px' }}>Speed</th>
                <th style={{ textAlign: 'center', width: '60px' }}>Tyre</th>
                <th style={{ textAlign: 'center', width: '50px' }}>Pit</th>
                <th style={{ textAlign: 'center', width: '50px' }}>DRS</th>
              </tr>
            </thead>
            <tbody>
              {liveDrivers.map((drv, index) => {
                const isSelected = drv.id === selectedLiveDriverId;
                
                const displayGap = session === 'practice'
                  ? (index === 0 ? 'FASTEST' : `+${(index * 0.118 + (index % 3) * 0.035).toFixed(3)}s`)
                  : session === 'qualifying'
                    ? (index === 0 ? 'POLE' : `+${(index * 0.082 + (index % 2) * 0.024).toFixed(3)}s`)
                    : drv.gap;

                const displayInterval = session === 'practice'
                  ? `1:27.${(320 + index * 142).toFixed(0)}`
                  : session === 'qualifying'
                    ? `1:26.${(110 + index * 98).toFixed(0)}`
                    : drv.interval;
                 
                return (
                  <tr 
                    key={drv.id}
                    onClick={() => setSelectedLiveDriverId(drv.id)}
                    style={{ 
                      backgroundColor: isSelected ? 'rgba(225, 6, 0, 0.05)' : 'transparent',
                      borderLeft: isSelected ? `3px solid ${drv.color}` : 'none'
                    }}
                  >
                    <td style={{ textAlign: 'center', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {drv.position}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ width: '3px', height: '16px', backgroundColor: drv.color, borderRadius: '1px' }}></span>
                        <strong>{drv.lastName}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{drv.code}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {displayGap}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {displayInterval}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: getSectorColor(drv.s1, 1) }}>
                      {drv.s1}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: getSectorColor(drv.s2, 2) }}>
                      {drv.s2}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: getSectorColor(drv.s3, 3) }}>
                      {drv.s3}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {drv.telemetry.speed} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>KM/H</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span 
                        className="badge" 
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          fontSize: '0.75rem', 
                          fontWeight: 800, 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          backgroundColor: drv.tyreCompound === 'S' 
                            ? 'var(--f1-red)' 
                            : drv.tyreCompound === 'M' 
                              ? 'var(--yellow-accent)' 
                              : 'white',
                          color: 'black'
                        }}
                        title={`Compound: ${drv.tyreCompound} (Age: ${drv.tyreAge} laps)`}
                      >
                        {drv.tyreCompound}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {drv.pitStops}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {drv.telemetry.drs ? (
                        <span style={{ color: 'var(--green-accent)', fontWeight: 800, fontSize: '0.7rem' }}>DRS</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
