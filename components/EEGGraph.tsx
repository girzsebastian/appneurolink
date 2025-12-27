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
  const samples = data.slice(-100); // Last 100 samples
  const points: [number, number][] = samples.map((value, index) => {
    const x = (index / Math.max(samples.length - 1, 1)) * width;
    // Normalize EEG value (-2048 to +2048) to graph height
    const normalizedValue = ((value + 2048) / 4096); // 0 to 1
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

