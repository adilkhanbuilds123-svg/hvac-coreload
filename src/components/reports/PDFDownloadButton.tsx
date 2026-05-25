'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useHVACStore } from '@/store/useHVACStore';
import { calculateTotalLoad } from '@/lib/hvac-math';
import type { HVACInputs as MathInputs } from '@/lib/hvac-math';

export function PDFDownloadButton() {
  const [generating, setGenerating] = useState(false);
  const inputs = useHVACStore((s) => s.inputs);

  const handleDownload = async () => {
    setGenerating(true);
    try {
      // Dynamic import to keep bundle small
      const { pdf, Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer');

      const mathInputs: MathInputs = {
        winterDesign: inputs.winterDesign,
        summerDesign: inputs.summerDesign,
        elevation: inputs.elevation,
        heatingSetpoint: inputs.heatingSetpoint,
        coolingSetpoint: inputs.coolingSetpoint,
        latentGrains: inputs.latentGrains,
        buildingLength: inputs.buildingLength,
        buildingWidth: inputs.buildingWidth,
        ceilingHeight: inputs.ceilingHeight,
        isVaulted: inputs.isVaulted,
        vaultedHeight: inputs.vaultedHeight,
        wallInsulation: inputs.wallInsulation,
        roofInsulation: inputs.roofInsulation,
        floorType: inputs.floorType,
        floorInsulation: inputs.floorInsulation,
        windowAreaNorth: inputs.windowAreaNorth,
        windowAreaSouth: inputs.windowAreaSouth,
        windowAreaEast: inputs.windowAreaEast,
        windowAreaWest: inputs.windowAreaWest,
        windowType: inputs.windowType,
        tightness: inputs.tightness,
        occupants: inputs.occupants,
        applianceLoad: inputs.applianceLoad,
        ductLocation: inputs.ductLocation,
        ductInsulation: inputs.ductInsulation,
        footprintShape: inputs.footprintShape,
      };
      const results = calculateTotalLoad(mathInputs);

      const styles = StyleSheet.create({
        page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a1a' },
        header: { fontSize: 18, fontWeight: 'bold', marginBottom: 4, fontFamily: 'Helvetica-Bold' },
        subheader: { fontSize: 8, color: '#666', marginBottom: 20, textTransform: 'uppercase' as const, letterSpacing: 2 },
        sectionTitle: { fontSize: 12, fontWeight: 'bold', marginTop: 16, marginBottom: 8, borderBottom: '1px solid #ddd', paddingBottom: 4, fontFamily: 'Helvetica-Bold' },
        row: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, marginBottom: 3, paddingVertical: 2 },
        label: { color: '#555' },
        value: { fontFamily: 'Courier', fontWeight: 'bold' },
        valueHighlight: { fontFamily: 'Courier', fontWeight: 'bold', color: '#0891b2' },
        footer: { position: 'absolute' as const, bottom: 30, left: 40, right: 40, fontSize: 7, color: '#aaa', textAlign: 'center' as const, borderTop: '1px solid #eee', paddingTop: 8 },
      });

      const ReportDocument = (
        <Document>
          <Page size="LETTER" style={styles.page}>
            <Text style={styles.header}>CORELOAD ENGINEERING REPORT</Text>
            <Text style={styles.subheader}>
              HVAC Load Calculation | {inputs.selectedCity || 'Custom Location'}{inputs.selectedState ? `, ${inputs.selectedState}` : ''} | {new Date().toLocaleDateString()}
            </Text>

            <Text style={styles.sectionTitle}>Building Specifications</Text>
            <View style={styles.row}><Text style={styles.label}>Dimensions</Text><Text style={styles.value}>{inputs.buildingLength} x {inputs.buildingWidth} x {inputs.ceilingHeight} ft</Text></View>
            <View style={styles.row}><Text style={styles.label}>Floor Area</Text><Text style={styles.value}>{(inputs.buildingLength * inputs.buildingWidth).toLocaleString()} sqft</Text></View>
            <View style={styles.row}><Text style={styles.label}>Wall Insulation</Text><Text style={styles.value}>{inputs.wallInsulation}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Roof Insulation</Text><Text style={styles.value}>{inputs.roofInsulation}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Window Type</Text><Text style={styles.value}>{inputs.windowType} pane</Text></View>
            <View style={styles.row}><Text style={styles.label}>Building Tightness</Text><Text style={styles.value}>{inputs.tightness}</Text></View>

            <Text style={styles.sectionTitle}>Design Conditions</Text>
            <View style={styles.row}><Text style={styles.label}>Winter Design Temp</Text><Text style={styles.value}>{inputs.winterDesign}F</Text></View>
            <View style={styles.row}><Text style={styles.label}>Summer Design Temp</Text><Text style={styles.value}>{inputs.summerDesign}F</Text></View>
            <View style={styles.row}><Text style={styles.label}>Elevation</Text><Text style={styles.value}>{inputs.elevation.toLocaleString()} ft</Text></View>
            <View style={styles.row}><Text style={styles.label}>Latent Grains</Text><Text style={styles.value}>{inputs.latentGrains} gr</Text></View>

            <Text style={styles.sectionTitle}>Load Summary</Text>
            <View style={styles.row}><Text style={styles.label}>Total Heating Load</Text><Text style={styles.valueHighlight}>{results.heatingBTU.toLocaleString()} BTU/hr</Text></View>
            <View style={styles.row}><Text style={styles.label}>Total Cooling Load</Text><Text style={styles.valueHighlight}>{results.coolingBTU.toLocaleString()} BTU/hr</Text></View>
            <View style={styles.row}><Text style={styles.label}>System Tonnage</Text><Text style={styles.valueHighlight}>{results.tonnage} tons</Text></View>
            <View style={styles.row}><Text style={styles.label}>Sensible Heat Ratio</Text><Text style={styles.value}>{results.sensibleHeatRatio}</Text></View>

            <Text style={styles.sectionTitle}>Heating Breakdown</Text>
            <View style={styles.row}><Text style={styles.label}>Wall Loss</Text><Text style={styles.value}>{results.wallHeatLoss.toLocaleString()} BTU</Text></View>
            <View style={styles.row}><Text style={styles.label}>Roof Loss</Text><Text style={styles.value}>{results.roofHeatLoss.toLocaleString()} BTU</Text></View>
            <View style={styles.row}><Text style={styles.label}>Window Loss</Text><Text style={styles.value}>{results.windowHeatLoss.toLocaleString()} BTU</Text></View>
            <View style={styles.row}><Text style={styles.label}>Floor Loss</Text><Text style={styles.value}>{results.floorLoss.toLocaleString()} BTU</Text></View>
            <View style={styles.row}><Text style={styles.label}>Infiltration</Text><Text style={styles.value}>{results.infiltrationHeating.toLocaleString()} BTU</Text></View>
            <View style={styles.row}><Text style={styles.label}>Duct Loss</Text><Text style={styles.value}>{results.ductLossHeating.toLocaleString()} BTU</Text></View>

            <Text style={styles.sectionTitle}>Cooling Breakdown</Text>
            <View style={styles.row}><Text style={styles.label}>Wall Gain</Text><Text style={styles.value}>{results.wallHeatGain.toLocaleString()} BTU</Text></View>
            <View style={styles.row}><Text style={styles.label}>Roof Gain</Text><Text style={styles.value}>{results.roofHeatGain.toLocaleString()} BTU</Text></View>
            <View style={styles.row}><Text style={styles.label}>Window Gain (Solar)</Text><Text style={styles.value}>{results.windowHeatGain.toLocaleString()} BTU</Text></View>
            <View style={styles.row}><Text style={styles.label}>Sensible Cooling Total</Text><Text style={styles.value}>{results.totalSensibleCooling.toLocaleString()} BTU</Text></View>
            <View style={styles.row}><Text style={styles.label}>Latent Cooling Total</Text><Text style={styles.value}>{results.totalLatentCooling.toLocaleString()} BTU</Text></View>

            <View style={styles.footer}>
              <Text>Generated by CoreLoad HVAC Calculator | ACCA Manual J Methodology | {new Date().toISOString()}</Text>
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(ReportDocument).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coreload-report-${inputs.selectedCity || 'custom'}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-sm font-mono uppercase tracking-wider text-zinc-300 hover:border-cyan-cooling hover:text-cyan-cooling transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {generating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {generating ? 'Generating...' : 'Download PDF Report'}
    </button>
  );
}
