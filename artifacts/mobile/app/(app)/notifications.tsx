import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useNotifications,
  type Notification as StoreNotification,
  type NotifCategory as StoreNotifCategory,
} from "@/context/NotificationsContext";

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  navy:    "#061941",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#F0F0F0",
  success: "#00B03C",
  danger:  "#EF4444",
  warn:    "#D97706",
  accent:  "#00D9A0",
  info:    "#2563EB",
  purple:  "#7C3AED",
};

/* ─── Notification types ─────────────────────────────────────────────────── */
// The shape and the actual data now live in NotificationsContext — the one
// source of truth shared across the whole app — so this screen never keeps
// its own local copy that could drift out of sync or get reset on remount.
type NotifCategory = StoreNotifCategory;
type Notification  = StoreNotification;
type TxStatus       = "completed" | "pending" | "failed";

/* ─── Category metadata ──────────────────────────────────────────────────── */
const CAT_META: Record<NotifCategory, {
  icon:      keyof typeof Feather.glyphMap;
  iconBg:    string;
  iconColor: string;
  label:     string;
}> = {
  transaction:  { icon: "arrow-down-left",  iconBg: "#F0FFF9", iconColor: C.success, label: "Transactions"    },
  deposit:      { icon: "arrow-down-circle",iconBg: "#EFF6FF", iconColor: C.info,    label: "Deposits"        },
  withdrawal:   { icon: "arrow-up-circle",  iconBg: "#FFF0F0", iconColor: C.danger,  label: "Withdrawals"     },
  transfer:     { icon: "repeat",           iconBg: "#F5F3FF", iconColor: C.purple,  label: "Transfers"       },
  virtual_card: { icon: "credit-card",      iconBg: "#EFF6FF", iconColor: C.info,    label: "Virtual Cards"   },
  security:     { icon: "shield",           iconBg: "#FFF0F0", iconColor: C.danger,  label: "Security"        },
  login_alert:  { icon: "log-in",           iconBg: "#FFF0F0", iconColor: C.danger,  label: "Login Alerts"    },
  promotion:    { icon: "gift",             iconBg: "#FFF7ED", iconColor: C.warn,    label: "Promotions"      },
  cashback:     { icon: "percent",          iconBg: "#F0FFF9", iconColor: C.success, label: "Cashback"        },
  reward:       { icon: "star",             iconBg: "#FFF7ED", iconColor: C.warn,    label: "Rewards"         },
  verification: { icon: "check-circle",     iconBg: "#F0FFF9", iconColor: C.success, label: "Verification"    },
  referral:     { icon: "users",            iconBg: "#FFF7ED", iconColor: C.warn,    label: "Referrals"       },
  system:       { icon: "bell",             iconBg: "#EFF6FF", iconColor: C.info,    label: "System Updates"  },
};

const STATUS_STYLE: Record<TxStatus, { label: string; bg: string; color: string }> = {
  completed: { label: "Completed", bg: "#F0FFF4", color: C.success },
  pending:   { label: "Pending",   bg: "#FFF7ED", color: C.warn    },
  failed:    { label: "Failed",    bg: "#FFF0F0", color: C.danger  },
};

/* ─── Helper: time ───────────────────────────────────────────────────────── */
const NOW = Date.now();

function formatRelative(ts: number): string {
  const msAgo   = NOW - ts;
  const minsAgo = Math.floor(msAgo / 60_000);
  if (minsAgo < 1)  return "Just now";
  if (minsAgo < 60) return `${minsAgo}m ago`;
  const hAgo = Math.floor(minsAgo / 60);
  if (hAgo < 24) return `${hAgo}h ago`;
  const dAgo = Math.floor(hAgo / 24);
  if (dAgo === 1) return "Yesterday";
  if (dAgo < 7)  return `${dAgo} days ago`;
  const date = new Date(ts);
  return date.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

function formatExact(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

type Group = "Today" | "Yesterday" | "Earlier This Week" | "Earlier This Month" | "Older";

function getGroup(ts: number): Group {
  const msAgo  = NOW - ts;
  const daysAgo = msAgo / 86_400_000;
  if (daysAgo < 1)  return "Today";
  if (daysAgo < 2)  return "Yesterday";
  if (daysAgo < 7)  return "Earlier This Week";
  if (daysAgo < 30) return "Earlier This Month";
  return "Older";
}

const GROUP_ORDER: Group[] = [
  "Today", "Yesterday", "Earlier This Week", "Earlier This Month", "Older",
];

const FILTER_ALL = "All";
type FilterOption = typeof FILTER_ALL | NotifCategory;

/* ─── FlatList item types ────────────────────────────────────────────────── */
type ListItem =
  | { kind: "header"; title: Group; key: string }
  | { kind: "notif";  notif: Notification; key: string };

/* ─── Skeleton row ───────────────────────────────────────────────────────── */
function SkeletonRow({ index }: { index: number }) {
  const opacity = useSharedValue(1);
  React.useEffect(() => {
    const loop = () => {
      opacity.value = withTiming(0.4, { duration: 700 }, () => {
        opacity.value = withTiming(1, { duration: 700 }, loop);
      });
    };
    loop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={[sk.row, style]}>
      <View style={sk.icon} />
      <View style={sk.lines}>
        <View style={[sk.line, { width: `${60 + (index % 3) * 12}%` }]} />
        <View style={[sk.line, { width: `${40 + (index % 4) * 8}%`, marginTop: 6 }]} />
        <View style={[sk.line, { width: "25%", marginTop: 4 }]} />
      </View>
    </Animated.View>
  );
}

/* ─── Notification card ──────────────────────────────────────────────────── */
function NotifCard({
  item, index, selected, multiSelectMode,
  onPress, onDismiss, onMarkUnread, onLongPress, onToggleSelect,
}: {
  item: Notification;
  index: number;
  selected: boolean;
  multiSelectMode: boolean;
  onPress: () => void;
  onDismiss: () => void;
  onMarkUnread: () => void;
  onLongPress: () => void;
  onToggleSelect: () => void;
}) {
  const router     = useRouter();
  const swipeRef   = useRef<Swipeable>(null);
  const st = item.status ? STATUS_STYLE[item.status] : null;

  const handleCTA = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.cta?.action) router.push(`/(app)/${item.cta.action}` as any);
  };

  /* ── Right actions: Delete ── */
  const renderRightActions = useCallback(() => (
    <TouchableOpacity
      style={nc.swipeDeleteAction}
      onPress={() => {
        swipeRef.current?.close();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setTimeout(() => onDismiss(), 120);
      }}
      activeOpacity={0.85}
    >
      <Feather name="trash-2" size={20} color="#FFFFFF" />
      <Text style={nc.swipeActionText}>Delete</Text>
    </TouchableOpacity>
  ), [onDismiss]);

  /* ── Left actions: Mark Unread ── */
  const renderLeftActions = useCallback(() => (
    <TouchableOpacity
      style={nc.swipeUnreadAction}
      onPress={() => {
        swipeRef.current?.close();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onMarkUnread();
      }}
      activeOpacity={0.85}
    >
      <Feather name="mail" size={20} color="#FFFFFF" />
      <Text style={nc.swipeActionText}>
        {item.read ? "Mark\nUnread" : "Mark\nRead"}
      </Text>
    </TouchableOpacity>
  ), [onMarkUnread, item.read]);

  const handleSwipeRightOpen = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => onDismiss(), 180);
  }, [onDismiss]);

  return (
    <Animated.View entering={FadeInDown.duration(260).delay(Math.min(index * 20, 280)).springify()}>
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={(dir) => {
          if (dir === "right") handleSwipeRightOpen();
        }}
        rightThreshold={72}
        leftThreshold={72}
        friction={1.8}
        overshootRight={false}
        overshootLeft={false}
        enabled={!multiSelectMode}
      >
        <TouchableOpacity
          style={[nc.card, !item.read && nc.cardUnread, selected && nc.cardSelected]}
          activeOpacity={0.78}
          onPress={() => {
            if (multiSelectMode) { onToggleSelect(); return; }
            Haptics.selectionAsync();
            onPress();
          }}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onLongPress();
          }}
          delayLongPress={380}
        >
          {/* Multi-select checkbox */}
          {multiSelectMode && (
            <Animated.View entering={FadeIn.duration(160)} style={nc.checkbox}>
              <View style={[nc.checkboxInner, selected && nc.checkboxChecked]}>
                {selected && <Feather name="check" size={11} color="#FFFFFF" />}
              </View>
            </Animated.View>
          )}

          {/* Unread blue dot */}
          {!item.read && !multiSelectMode && <View style={nc.unreadDot} />}

          {/* Icon */}
          <View style={[nc.iconWrap, { backgroundColor: item.iconBg }]}>
            <Feather name={item.icon} size={18} color={item.iconColor} />
          </View>

          {/* Content */}
          <View style={nc.content}>
            <View style={nc.topRow}>
              <Text style={[nc.title, !item.read && nc.titleBold]} numberOfLines={1}>
                {item.title}
              </Text>
              {!multiSelectMode && (
                <TouchableOpacity
                  onPress={onDismiss}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="x" size={14} color={C.textMut} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={nc.body} numberOfLines={2}>{item.body}</Text>

            <View style={nc.metaRow}>
              {/* Relative time */}
              <Text style={nc.time}>{formatRelative(item.ts)}</Text>
              {/* Exact timestamp */}
              <Text style={nc.timeSep}>·</Text>
              <Text style={nc.timeExact}>{formatExact(item.ts)}</Text>
              {/* Status badge */}
              {st && (
                <View style={[nc.badge, { backgroundColor: st.bg }]}>
                  <View style={[nc.badgeDot, { backgroundColor: st.color }]} />
                  <Text style={[nc.badgeText, { color: st.color }]}>{st.label}</Text>
                </View>
              )}
            </View>

            {/* CTA button */}
            {item.cta && !multiSelectMode && (
              <TouchableOpacity style={nc.ctaBtn} onPress={handleCTA} activeOpacity={0.8}>
                <Text style={nc.ctaText}>{item.cta.label}</Text>
                <Feather name="arrow-right" size={11} color={C.info} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
        <View style={nc.separator} />
      </Swipeable>
    </Animated.View>
  );
}

/* ─── Main screen ────────────────────────────────────────────────────────── */
export default function NotificationsScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const topPad  = Platform.OS === "web" ? 20 : insets.top;

  const [items,           setItems]           = useState<Notification[]>(MOCK);
  const [loading,         setLoading]         = useState(false);
  const [refreshing,      setRefreshing]       = useState(false);
  const [searchText,      setSearchText]       = useState("");
  const [searchOpen,      setSearchOpen]       = useState(false);
  const [activeFilter,    setFilter]           = useState<FilterOption>(FILTER_ALL);
  const [multiSelectMode, setMultiSelectMode]  = useState(false);
  const [selectedIds,     setSelectedIds]      = useState<Set<string>>(new Set());
  /* Infinite scroll: items shown */
  const [visibleCount,    setVisibleCount]     = useState(20);

  const searchRef = useRef<TextInput>(null);
  const searchH   = useSharedValue(0);
  const searchOp  = useSharedValue(0);

  const searchBarStyle = useAnimatedStyle(() => ({
    height:   searchH.value,
    opacity:  searchOp.value,
    overflow: "hidden",
  }));

  const toggleSearch = useCallback(() => {
    const next = !searchOpen;
    setSearchOpen(next);
    searchH.value  = withSpring(next ? 52 : 0,  { damping: 20, stiffness: 280 });
    searchOp.value = withTiming(next ? 1 : 0, { duration: 180 });
    if (next) setTimeout(() => searchRef.current?.focus(), 120);
    else { setSearchText(""); searchRef.current?.blur(); }
  }, [searchOpen, searchH, searchOp]);

  /* ── Refresh ── */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setVisibleCount(20);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  /* ── Infinite scroll ── */
  const onEndReached = useCallback(() => {
    setVisibleCount(prev => prev + 15);
  }, []);

  /* ── Derived data ── */
  const unreadCount = items.filter(n => !n.read).length;

  const markAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) =>
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const toggleReadState = (id: string) =>
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));

  const dismiss = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(prev => prev.filter(n => n.id !== id));
  };

  /* ── Multi-select helpers ── */
  const enterMultiSelect = (id: string) => {
    if (multiSelectMode) {
      // Already in multi-select: long press toggles the tapped item
      toggleSelect(id);
      return;
    }
    setMultiSelectMode(true);
    setSelectedIds(new Set([id]));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIds(new Set(filtered.map(n => n.id)));
  };

  const cancelMultiSelect = () => {
    setMultiSelectMode(false);
    setSelectedIds(new Set());
  };

  const deleteSelected = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setItems(prev => prev.filter(n => !selectedIds.has(n.id)));
    cancelMultiSelect();
  };

  /* ── Filtered + grouped ── */
  const filtered = useMemo(() => {
    const q = searchText.toLowerCase().trim();
    return items.filter(n => {
      if (activeFilter !== FILTER_ALL && n.category !== activeFilter) return false;
      if (q && !n.title.toLowerCase().includes(q) && !n.body.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, activeFilter, searchText]);

  /* Reset pagination when search/filter changes */
  React.useEffect(() => {
    setVisibleCount(20);
  }, [searchText, activeFilter]);

  /* Apply visible count (infinite scroll) */
  const visibleFiltered = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const grouped = useMemo(() => {
    const buckets: Partial<Record<Group, Notification[]>> = {};
    for (const n of visibleFiltered) {
      const g = getGroup(n.ts);
      if (!buckets[g]) buckets[g] = [];
      buckets[g]!.push(n);
    }
    return GROUP_ORDER.filter(g => buckets[g]?.length).map(g => ({ title: g, data: buckets[g]! }));
  }, [visibleFiltered]);

  /* Build flat list data */
  const listData = useMemo<ListItem[]>(() => {
    const result: ListItem[] = [];
    for (const sec of grouped) {
      result.push({ kind: "header", title: sec.title, key: `h-${sec.title}` });
      for (const notif of sec.data) {
        result.push({ kind: "notif", notif, key: `n-${notif.id}` });
      }
    }
    return result;
  }, [grouped]);

  const hasMore = visibleCount < filtered.length;

  /* ── Filter chips ── */
  const filterOptions: FilterOption[] = [FILTER_ALL, ...Object.keys(CAT_META) as NotifCategory[]];

  const renderItem = useCallback(({ item, index }: { item: ListItem; index: number }) => {
    if (item.kind === "header") {
      return (
        <Animated.View entering={FadeIn.duration(220)}>
          <Text style={s.sectionLabel}>{item.title}</Text>
        </Animated.View>
      );
    }
    const { notif } = item;
    return (
      <NotifCard
        item={notif}
        index={index}
        selected={selectedIds.has(notif.id)}
        multiSelectMode={multiSelectMode}
        onPress={() => markRead(notif.id)}
        onDismiss={() => dismiss(notif.id)}
        onMarkUnread={() => toggleReadState(notif.id)}
        onLongPress={() => enterMultiSelect(notif.id)}
        onToggleSelect={() => toggleSelect(notif.id)}
      />
    );
  }, [selectedIds, multiSelectMode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* ── Header ── */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        {multiSelectMode ? (
          /* Multi-select header */
          <>
            <TouchableOpacity
              style={s.iconBtn}
              onPress={cancelMultiSelect}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x" size={20} color={C.navy} />
            </TouchableOpacity>

            <Text style={s.title}>
              {selectedIds.size} selected
            </Text>

            <View style={s.headerActions}>
              <TouchableOpacity
                onPress={selectAll}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={s.markAll}>Select all</Text>
              </TouchableOpacity>
              {selectedIds.size > 0 && (
                <TouchableOpacity
                  onPress={deleteSelected}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={[s.markAll, { color: C.danger }]}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        ) : (
          /* Normal header */
          <>
            <TouchableOpacity
              style={s.iconBtn}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="arrow-left" size={22} color={C.navy} />
            </TouchableOpacity>

            <View style={s.headerCenter}>
              <Text style={s.title}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>

            <View style={s.headerActions}>
              <TouchableOpacity
                style={s.iconBtn}
                onPress={toggleSearch}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name={searchOpen ? "x" : "search"} size={18} color={C.navy} />
              </TouchableOpacity>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={markAllRead} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={s.markAll}>Mark all read</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </Animated.View>

      {/* ── Search bar ── */}
      {!multiSelectMode && (
        <Animated.View style={[s.searchWrap, searchBarStyle]}>
          <View style={s.searchBox}>
            <Feather name="search" size={15} color={C.textMut} />
            <TextInput
              ref={searchRef}
              style={s.searchInput}
              placeholder="Search notifications…"
              placeholderTextColor={C.textMut}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Feather name="x-circle" size={15} color={C.textMut} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}

      {/* ── Filter chips ── */}
      {!multiSelectMode && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.chipScroll}
          contentContainerStyle={s.chipContent}
        >
          {filterOptions.map(f => {
            const isActive = activeFilter === f;
            const meta = f !== FILTER_ALL ? CAT_META[f as NotifCategory] : null;
            return (
              <TouchableOpacity
                key={f}
                style={[s.chip, isActive && s.chipActive]}
                onPress={() => { Haptics.selectionAsync(); setFilter(f); }}
                activeOpacity={0.75}
              >
                {meta && (
                  <View style={[s.chipDot, { backgroundColor: isActive ? "#FFFFFF" : meta.iconColor }]} />
                )}
                <Text style={[s.chipText, isActive && s.chipTextActive]}>
                  {f === FILTER_ALL ? "All" : meta!.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <View style={s.divider} />

      {/* ── Content ── */}
      {loading ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} index={i} />)}
        </ScrollView>
      ) : filtered.length === 0 ? (
        <Animated.View entering={FadeInUp.duration(320)} style={s.emptyState}>
          <View style={s.emptyIcon}>
            <Feather name={searchText || activeFilter !== FILTER_ALL ? "search" : "bell-off"} size={32} color={C.textMut} />
          </View>
          <Text style={s.emptyTitle}>
            {searchText ? "No results found" : activeFilter !== FILTER_ALL ? "No notifications here" : "You're all caught up"}
          </Text>
          <Text style={s.emptySub}>
            {searchText
              ? `No notifications match "${searchText}"`
              : activeFilter !== FILTER_ALL
              ? "No notifications in this category yet."
              : "New alerts will appear here when activity happens on your account."}
          </Text>
          {(searchText || activeFilter !== FILTER_ALL) && (
            <TouchableOpacity
              style={s.clearBtn}
              onPress={() => { setSearchText(""); setFilter(FILTER_ALL); }}
            >
              <Text style={s.clearBtnText}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={item => item.key}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 60 }]}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.25}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={C.accent}
              colors={[C.accent]}
            />
          }
          ListFooterComponent={
            hasMore ? (
              <View style={s.loadingMore}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRow key={i} index={i} />
                ))}
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: C.bg },
  header:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 10, paddingTop: 8 },
  iconBtn:       { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerCenter:  { flexDirection: "row", alignItems: "center", gap: 6, flex: 1, justifyContent: "center" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  title:         { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy },
  badge:         { backgroundColor: C.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 },
  badgeText:     { fontSize: 11, fontFamily: "Manrope_700Bold", color: "#FFF" },
  markAll:       { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.info },

  searchWrap:  { paddingHorizontal: 16, paddingBottom: 6, overflow: "hidden" },
  searchBox:   { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F8F9FA", borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, height: 40 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Manrope_400Regular", color: C.text, paddingVertical: 0 },

  chipScroll:  { maxHeight: 44, marginBottom: 4 },
  chipContent: { paddingHorizontal: 16, gap: 6, alignItems: "center", paddingVertical: 6 },
  chip:        { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA" },
  chipActive:  { backgroundColor: C.navy, borderColor: C.navy },
  chipDot:     { width: 6, height: 6, borderRadius: 3 },
  chipText:    { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  chipTextActive: { color: "#FFFFFF" },

  divider:      { height: 1, backgroundColor: C.border },
  scroll:       { paddingTop: 4 },
  sectionLabel: { fontSize: 11, fontFamily: "Manrope_700Bold", color: C.textMut, textTransform: "uppercase", letterSpacing: 0.7, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6 },

  loadingMore: { paddingVertical: 8 },

  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 10 },
  emptyIcon:  { width: 72, height: 72, borderRadius: 36, backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle: { fontSize: 17, fontFamily: "Manrope_700Bold", color: C.text },
  emptySub:   { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec, textAlign: "center", lineHeight: 20 },
  clearBtn:   { marginTop: 4, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 10, backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE" },
  clearBtnText: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.info },
});

const nc = StyleSheet.create({
  card:        { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 20, paddingVertical: 13, gap: 12, position: "relative", backgroundColor: C.bg },
  cardUnread:  { backgroundColor: "#F8FCFF" },
  cardSelected:{ backgroundColor: "#EFF6FF" },
  unreadDot:   { position: "absolute", top: 19, left: 7, width: 6, height: 6, borderRadius: 3, backgroundColor: C.info },
  iconWrap:    { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
  content:     { flex: 1, gap: 2 },
  topRow:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title:       { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text, flex: 1 },
  titleBold:   { fontFamily: "Manrope_700Bold" },
  body:        { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec, lineHeight: 17 },

  metaRow:     { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2, flexWrap: "wrap" },
  time:        { fontSize: 11, fontFamily: "Manrope_500Medium", color: C.textMut },
  timeSep:     { fontSize: 11, color: C.textMut },
  timeExact:   { fontSize: 10, fontFamily: "Manrope_400Regular", color: C.textMut, opacity: 0.7 },

  badge:       { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  badgeDot:    { width: 5, height: 5, borderRadius: 3 },
  badgeText:   { fontSize: 10, fontFamily: "Manrope_600SemiBold" },

  ctaBtn:      { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE" },
  ctaText:     { fontSize: 11, fontFamily: "Manrope_600SemiBold", color: C.info },

  separator: { height: 1, backgroundColor: C.border, marginHorizontal: 20 },

  /* Checkbox for multi-select */
  checkbox:        { justifyContent: "center", marginTop: 1, flexShrink: 0 },
  checkboxInner:   { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: C.textMut, alignItems: "center", justifyContent: "center" },
  checkboxChecked: { backgroundColor: C.info, borderColor: C.info },

  /* Swipe actions */
  swipeDeleteAction: { justifyContent: "center", alignItems: "center", width: 80, backgroundColor: C.danger, gap: 4, borderTopRightRadius: 0, borderBottomRightRadius: 0 },
  swipeUnreadAction: { justifyContent: "center", alignItems: "center", width: 80, backgroundColor: C.info, gap: 4 },
  swipeActionText:   { fontSize: 11, fontFamily: "Manrope_600SemiBold", color: "#FFFFFF", textAlign: "center" },
});

const sk = StyleSheet.create({
  row:   { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  icon:  { width: 42, height: 42, borderRadius: 13, backgroundColor: "#F0F0F0" },
  lines: { flex: 1, gap: 0 },
  line:  { height: 10, borderRadius: 5, backgroundColor: "#F0F0F0" },
});
