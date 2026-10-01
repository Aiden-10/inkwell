const listeners = {};
export const EventBus = {
    on(eventName, handler) {
        (listeners[eventName] ??= []).push(handler);
    },
    emit(eventName, payload) {
        (listeners[eventName] ?? []).forEach((handler) => handler
        (payload));
    },
};