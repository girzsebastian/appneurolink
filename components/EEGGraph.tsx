import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Line, G } from 'react-native-svg';
import * as d3 from 'd3-shape';

interface EEGGraphProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

const EEGGraph: React.FC<EEGGraphProps> = ({
  data,
  width = 350,
  height = 100,
  color = '#00ff00',
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.noDataText}>Waiting for EEG signal...</Text>
      </View>
    );
  }

  // Prepare data for medical-grade visualization
  const samples = data.slice(-80); // Last 80 samples for smoother display
  
  // Auto-scale based on actual data range for better visualization
  const maxValue = Math.max(...samples.map(Math.abs), 1);
  const scale = Math.min(maxValue, 5000); // Cap at 5000 for reasonable scaling
  
  const points: [number, number][] = samples.map((value, index) => {
    const x = (index / Math.max(samples.length - 1, 1)) * width;
    // Normalize EEG value using dynamic scale
    const normalizedValue = (value / scale) * 0.5 + 0.5; // Center at 0.5, range 0-1
    const y = height - (normalizedValue * height * 0.8) - (height * 0.1); // Use 80% of height, centered
    return [x, y];
  });

  // Create smooth line using d3 curve
  const lineGenerator = d3
    .line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveMonotoneX); // Smooth interpolation for medical signals

  const pathData = lineGenerator(points);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Grid lines for reference */}
        <G opacity={0.2}>
          {/* Horizontal center line */}
          <Line
            x1={0}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke="#666"
            strokeWidth={1}
          />
          {/* Top and bottom reference lines */}
          <Line
            x1={0}
            y1={height * 0.25}
            x2={width}
            y2={height * 0.25}
            stroke="#444"
            strokeWidth={0.5}
          />
          <Line
            x1={0}
            y1={height * 0.75}
            x2={width}
            y2={height * 0.75}
            stroke="#444"
            strokeWidth={0.5}
          />
        </G>

        {/* EEG Signal Path */}
        {pathData && (
          <Path
            d={pathData}
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#666',
    fontSize: 14,
  },
});

export default EEGGraph;

