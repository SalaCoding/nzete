import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNumberStore } from '../library/useNumberStore';
import { StatusBar } from 'expo-status-bar';

const HEADER_HEIGHT = 54;
const GROUPS_PER_LOAD = 10;

export default function NumberBrowser() {
  const numbers = useNumberStore(s => s.numbers);
  const allGroups = useNumberStore(s => s.allGroups);
  const fetchedGroups = useNumberStore(s => s.fetchedGroups || []);
  const loading = useNumberStore(s => s.loading);
  const error = useNumberStore(s => s.error);
  const fetchGroups = useNumberStore(s => s.fetchGroups);
  const fetchAllGroups = useNumberStore(s => s.fetchAllGroups);

  const [groupPage, setGroupPage] = useState(0);

  const scrollRef = useRef(null);
  const positions = useRef({});

  // Only show groups that have been fetched/loaded
  const loadedGroups = useMemo(
    () => allGroups.filter(group => fetchedGroups.includes(group)),
    [allGroups, fetchedGroups]
  );

  useEffect(() => {
    if (typeof fetchAllGroups === 'function') fetchAllGroups();
  }, [fetchAllGroups]);

  // Fetch first GROUPS_PER_LOAD groups' numbers on mount or when allGroups is ready
  useEffect(() => {
    if (
      Array.isArray(allGroups) &&
      allGroups.length > 0 &&
      typeof fetchGroups === 'function' &&
      groupPage === 0
    ) {
      const initialGroups = allGroups.slice(0, GROUPS_PER_LOAD);
      fetchGroups(initialGroups);
      setGroupPage(1);
    }
  }, [allGroups, fetchGroups, groupPage]);

  useEffect(() => {
    positions.current = {};
  }, [numbers]);

  const grouped = useMemo(() => {
    return numbers.reduce((acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    }, {});
  }, [numbers]);

  const handleJump = (group) => {
  if (!fetchedGroups.includes(group)) {
    // Not loaded, so fetch just this group and scroll after it loads
    fetchGroups([group]).then(() => {
      setTimeout(() => {
        const y = positions.current[group];
        if (y != null && scrollRef.current) {
          scrollRef.current.scrollTo({ y, animated: true });
        }
      }, 300); // Give a short delay for rendering
    });
  } else {
    // Already loaded, just scroll
    const y = positions.current[group];
    if (y != null && scrollRef.current) {
      scrollRef.current.scrollTo({ y, animated: true });
    }
  }
};

  const handleLoadMore = () => {
    // Load next batch of groups by group index, not by count
    const nextStart = groupPage * GROUPS_PER_LOAD;
    const nextGroups = allGroups.slice(nextStart, nextStart + GROUPS_PER_LOAD);
    if (nextGroups.length > 0 && typeof fetchGroups === 'function') {
      fetchGroups(nextGroups);
      setGroupPage(groupPage + 1);
    }
  };

  // Are there more groups to load?
  const hasMoreGroups =
    allGroups && groupPage * GROUPS_PER_LOAD < allGroups.length;

  if (!allGroups || allGroups.length === 0) {
    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Sticky group header */}
      <View style={[styles.header, { height: HEADER_HEIGHT }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', height: HEADER_HEIGHT }}
        >
          {loadedGroups.map(group => (
            <TouchableOpacity
              key={`group-${group}`}
              style={styles.groupButton}
              onPress={() => handleJump(group)}
            >
              <Text style={styles.groupText}>{group}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + 2,
          paddingBottom: 30,
        }}
      >
        {loadedGroups.map(group => (
          <View
            key={group}
            onLayout={e => {
              positions.current[group] = e.nativeEvent.layout.y;
            }}
            style={styles.groupSection}
          >
            <Text style={styles.groupTitle}>{group}</Text>
            {(grouped[group] || []).length === 0 ? (
              <Text style={{ color: '#aaa', marginBottom: 8 }}>(No numbers)</Text>
            ) : (
              (grouped[group] || []).map(item => (
                <View key={item.value} style={styles.card}>
                  <Text style={styles.value}>{item.value}</Text>
                  <Text style={styles.word}>{item.word}</Text>
                </View>
              ))
            )}
          </View>
        ))}
        {loading && (
          <ActivityIndicator style={{ margin: 12 }} size="small" />
        )}
        {/* Load More by group batch */}
        {hasMoreGroups && !loading && (
          <TouchableOpacity style={styles.loadMore} onPress={handleLoadMore}>
            <Text style={{ color: '#196375', fontWeight: 'bold' }}>Load More Groups</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
}

// Styles for layout and appearance
const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#eee',
    zIndex: 10,
    elevation: 12,
  },
  groupButton: {
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#196375',
    borderRadius: 6,
  },
  groupText: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  groupSection: { padding: 10 },
  groupTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    color: '#000',
    textTransform: 'uppercase',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(116, 226, 253, 0.85)',
    borderRadius: 8,
    marginBottom: 4,
    padding: 6,
  },
  value: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1b0146',
    marginLeft: 10,
  },
  word: {
    flex: 1,
    marginLeft: 12,
    fontSize: 18,
    fontFamily: 'Times New Roman',
    fontWeight: '400',
  },
  loadMore: {
    padding: 12,
    alignItems: 'center',
  },
});