import { Store } from "react-notifications-component";

enum NotificationType {
  DEFAULT = "default",
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  DANGER = "danger",
}

type Props = {
  title?: string;
  message?: string;
  type?: NotificationType;
};
const notification = ({ title, message, type }: Props) =>
  Store.addNotification({
    title: title ?? "",
    message: message ?? "",
    type: type, // 'default', 'success', 'info', 'warning', 'danger'
    container: "bottom-left", // where to position the notifications
    animationIn: ["animated", "fadeIn"], // animate.css classes that's applied
    animationOut: ["animated", "fadeOut"], // animate.css classes that's applied
    dismiss: {
      duration: 3000,
    },
  });

export const success = (title: string, message: string) =>
  notification({ title, message, type: NotificationType.SUCCESS });

export const info = (title: string, message: string) =>
  notification({ title, message, type: NotificationType.INFO });

export const warning = (title: string, message: string) =>
  notification({ title, message, type: NotificationType.WARNING });

export const danger = (title: string, message: string) =>
  notification({ title, message, type: NotificationType.DANGER });

export const defaultNoty = (title: string, message: string) =>
  notification({ title, message, type: NotificationType.DEFAULT });

export default {
  success,
  info,
  warning,
  danger,
  defaultNoty,
};
