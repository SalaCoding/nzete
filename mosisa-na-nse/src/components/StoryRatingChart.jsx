import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Bar = ({ label, count, maxCount }) => {
  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <View style={styles.barContainer}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.barCount}>{count}</Text>
    </View>
  );
};

const StoryRatingChart = ({ distribution }) => {
  const ratings = [
    { star: 5, label: '★★★★★' },
    { star: 4, label: '★★★★☆' },
    { star: 3, label: '★★★☆☆' },
    { star: 2, label: '★★☆☆☆' },
    { star: 1, label: '★☆☆☆☆' },
  ];

  const totalRatings = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  const maxCount = Math. max(...Object.values(distribution));
  
  if (totalRatings === 0) {
    return <Text style={styles.emptyText}>Opesi lisolo moko te motuya.</Text>;
  }

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Motalaka ya Lisolo</Text>
      {ratings.map(({ star, label }) => (
        <Bar
          key={star}
          label={label}
          count={distribution[star] || 0}
          maxCount={maxCount}
        />
      ))}
      <Text style={styles. totalText}>Total Ratings: {totalRatings}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8,
    width: '99%',
    alignSelf: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  //starts here
  barLabel: {
    width: 90,
    fontSize: 16,
    color: '#707072ff',
    textShadowColor: 'rgba(0, 0, 0, 0. 2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  barTrack: {
    flex: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: 4,
  },
  barCount: {
    width: 30,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    color: "#888",
    fontStyle: 'italic',
    padding: 16,
  },
  totalText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  }
});

export default StoryRatingChart;