---
applyTo: "**"
---

You Might Not Need an Effect
Effects sync components with external systems (e.g., DOM, network); avoid them for internal logic to simplify code, boost performance, and reduce errors.
When to Skip Effects

Data transforms for rendering: Calculate during render (e.g., fullName = firstName + ' ' + lastName), not via state/Effect. Re-runs automatically on prop/state changes.
User events: Handle in event handlers (e.g., POST on submit, notifications on click). Effects run post-render, losing event context.
Use Effects only for true external sync (e.g., jQuery widget, fetch on mount).

Common Patterns & Fixes

Update state from props/state: Render-time calc (e.g., visibleTodos = getFilteredTodos(todos, filter)). Cache expensive ones with useMemo(() => getFilteredTodos(todos, filter), [todos, filter]).
Reset all state on prop change: Pass key={userId} to inner component; React remounts/resets tree.
Adjust partial state on prop change: Calc during render (e.g., selection = items.find(item => item.id === selectedId)). If needed, update in render (e.g., if (items !== prevItems) setSelection(null)), but prefer keys or IDs to avoid.
Share logic across handlers: Extract function (e.g., buyProduct() { addToCart(product); showNotification(...); }), call from handlers. Avoid Effects for event-driven logic.
POST requests: Mount-time (e.g., analytics) in Effect; interaction-time (e.g., register) in handler.
Computation chains: Calc next state in handler (e.g., if (nextCard.gold && goldCardCount === 3) { setRound(round + 1); alert('Game over'); }). Snapshots hold old values; define locals for new.
App init: Use module-top guard (e.g., if (!didInit) { didInit = true; loadData(); }) or pre-render code; avoids dev double-run.
Notify parent on change: Call onChange(nextValue) in handler (batches updates). Or lift state up for parent control.
Pass data up: Fetch in parent, pass down as prop. Keeps flow unidirectional.
External store subscribe: Use useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) over manual Effect listeners.
Data fetch: Effect ok for sync (e.g., useEffect(() => { let ignore=false; fetch().then(json => !ignore && setResults(json)); return () => ignore=true; }, [query])). Add race cleanup. Extract to Hook (e.g., useData(url)); prefer frameworks for caching/SSR.

Recap

Render-calc > Effect-state.
useMemo for cache; key for reset.
Event logic in handlers; display logic in Effects.
Lift state; batch updates.
Custom Hooks for ergonomics; minimize raw Effects.
