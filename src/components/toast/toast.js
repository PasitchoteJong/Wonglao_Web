const listeners = new Set();

const subscribe = (listener) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

const show = (type, message, duration = 5000) => {
    listeners.forEach((listener) => {
        listener({
            id: Date.now(),
            type,
            message,
            duration
        })
    })
};

export const toast = {
    success: (message, duration) => {
        show("success", message, duration)
    },
    error: (message, duration) => {
        show("error", message, duration)
    },
    warning: (message, duration) => {
        show("warning", message, duration)
    },
    info: (message, duration) => {
        show("info", message, duration);
    }
};
export { subscribe };
