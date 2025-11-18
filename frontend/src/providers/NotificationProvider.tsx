"use client";

import React, { createContext, useContext, useMemo } from "react";
import { notification } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";

interface NotificationContextType {
  api: NotificationInstance;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context.api;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification({
    // Global config
    placement: "topRight",
    duration: 4.5,
    showProgress: true,
    maxCount: 3,
    rtl: false,
  });

  const contextValue = useMemo(() => ({ api }), [api]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
