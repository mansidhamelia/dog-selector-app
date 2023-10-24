import React, { createContext, useContext, ReactNode, useState } from 'react';

// Notification type
type NotificationType = 'success' | 'error' | 'info';

// Notification data type
interface NotificationData {
    type: NotificationType;
    message: string;
    time?: number;
    visible: boolean;
}

// Context type
interface NotificationContextType {
    notification: NotificationData;
    showNotification: (type: NotificationType, message: string, time?: number) => void;
    hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationData>({
        type: 'info',
        message: '',
        time: 5000,
        visible: false,
    });

    const showNotification = (type: NotificationType, message: string, time = 5000) => {
        setNotification({ type, message, time, visible: true });
    };

    const hideNotification = () => {
        setNotification((prev) => ({ ...prev, visible: false }));
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

// Custom hook for using the notification context
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
